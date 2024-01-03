import { GridEngineHeadless } from "grid-engine"
import { Map, Coords, GameObjectCode, GameObjectDistance } from "./Map";
import { Character } from "./Character";
import { Task } from "./Task";
import { Utils } from "./Utils"

export class TaskGather implements Task{
  private gridEngineHeadless: GridEngineHeadless
  private map: Map;
  private character: Character;
  private data: any;
  private pointer: number = 0;
  private properSections: any;
  private selectedSection: any;
  private selectedSectionArea: Array<GameObjectCode>;
  private selectedGameObjects: any;
  private selectedMapGameObject: GameObjectDistance;
  private currentMovePath: Array<Coords> = []
  private selectedMapCloseTile: any;

  constructor(gridEngineHeadless: GridEngineHeadless, map: Map, data: any) {
    this.gridEngineHeadless = gridEngineHeadless;
    this.map = map;
    this.data = data;
  }
  public execute() {
    this.pointer = 1;
    this.next();
  }
  public addOwner(character: Character) {
    this.character = character;
  }
  public next = () => {
    switch (this.pointer) {
      case 1:
        this.findProperSections();
        break;
      case 2:
        this.getNearestSection();
        break;
      case 3:
        this.findProperGameObject();
        break;
      case 4:
        this.getNextDestination();
        break;
      case 5:
        //this.moveCharacter();
        break;
      case 6:
        this.findAroundGameObject();
        break;
      case 7:
        this.startAction();
        break;
      case 8:
        this.endAction();
        break;
    }
  };
  private findProperSections() {
    this.properSections = this.map.findProperSections(
      this.data.params.sections
    );
    this.pointer = 2;
    this.next();
  }
  private getNearestSection() {
    this.selectedSection = this.map.getNearestSection(this.properSections);
    this.selectedSectionArea = this.map.getSectionArea(this.selectedSection);
    this.pointer = 3;
    this.next();
  }
  private findProperGameObject() {
    this.selectedGameObjects = this.map.findProperGameObject(
      this.properSections,
      this.data.params.game_objects
    );
    this.pointer = 4;
    this.next();
  }

  private createMovementPath(targetPos: Coords) {
    this.currentMovePath = [];
    const pathFinder = this.gridEngineHeadless.findShortestPath({position:{ x: this.character.posX, y: this.character.posY }, charLayer:''}, {position:{ x: targetPos.x, y: targetPos.y }, charLayer:''})
    for (let item of pathFinder.path) {
      this.currentMovePath.push(item.position)
    }
    this.currentMovePath.shift()
  }

  private getNextDestination() {
    this.getNearestGameObject();
    if(!Object.keys(this.selectedMapGameObject).length) {
      const isInTargetSection = this.map.isInSection(this.selectedSection, {x: this.character.posX, y: this.character.posY});
      if(isInTargetSection) {
        //TODO:: explore area. Keep track  of visited tiles
        const t = this.selectedSectionArea.find(i=>i.x === this.character.posX && i.y === this.character.posY)
        if(t) {
          t.isVisited = true;
        }
        
        const nearestSectionTile = this.map.getNearestEntryInSection(this.selectedSectionArea.filter(i=>!i.isVisited), this.character)
        this.createMovementPath(nearestSectionTile)
        this.moveCharacter(4);
      }
      
      if(!isInTargetSection) {
        if(this.currentMovePath.length === 0) {
          const nearestSectionTile = this.map.getNearestEntryInSection(this.selectedSectionArea, this.character)
          this.createMovementPath(nearestSectionTile)
        }
        this.moveCharacter(4);
      }

       //if the area is full explored and no selectedMapGameObject find other section
       //if char not in section area find nearest path to enter
       //if char in area move to nearest tile to explore
       // create path  this.gridEngineHeadless.findShortestPath({position:{ x: charPos.x, y: charPos.y }, charLayer:''}, {position:{ x: this.selectedMapCloseTile.x, y: this.selectedMapCloseTile.y }, charLayer:''})
      //  while path end
			// 	  char.move +1
			// 	  map update exploredMap
			// 	  char.view -> check for game object
			// 	if game object found create path to object ++
			// 	else
			// 		-- getNearestDestination 
    } else {
      console.log('item found')
      this.pointer = 6;
      this.next();
    }
    //console.log('HERE')
    //console.log(this.selectedMapGameObject)
  }

  private moveCharacter(next) {
    const nextPath = this.currentMovePath.shift()
    if(nextPath) {
      this.character.move(nextPath);
    }
    
    this.pointer = next;
    // const charPos = this.character.getPos();
    // console.log(this.gridEngineHeadless.findShortestPath({position:{ x: charPos.x, y: charPos.y }, charLayer:''}, {position:{ x: this.selectedMapCloseTile.x, y: this.selectedMapCloseTile.y }, charLayer:''}))

    //this.character.move(this.selectedMapCloseTile, this.next);
  }

  private getNearestGameObject() {
    this.selectedMapGameObject = this.map.getNearestGameObject(
      this.selectedSectionArea,
      this.selectedGameObjects[0].mapCode,
      this.character
    );
    // if(this.selectedMapGameObject) {
    //   this.next();
    // } else {
    //   console.log('cannot find ' + this.selectedGameObjects[0].title)
    // }
   
  }

  private findAroundGameObject() {
    this.selectedMapCloseTile = this.map.findAroundGameObject(
      this.selectedMapGameObject,
      this.character
    );
    this.pointer = 7;
    this.next();
  }
  
  private startAction() {
    console.log(
      "Execute " + this.data.action + " for " + this.data.action_duration
    );
    setTimeout(() => {
      this.pointer = 8;
      this.next();
    }, this.data.action_duration);
  }
  private endAction() {
    console.log("finish action");
    this.map.removeGameObject(
      this.selectedSection,
      this.selectedMapGameObject
    );
    let t = this.selectedSectionArea.find(i=> i.x ===  this.selectedMapGameObject.x && i.y === this.selectedMapGameObject.y);
    if(t) {
      t.mapCode = 0;
    }
    this.pointer = 4;
    this.next();
  }
}
