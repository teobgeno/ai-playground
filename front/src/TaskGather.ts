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
  private selectedMapGameObject: any;
  private currentMovePath: Array<Coords> = []
  private selectedMapCloseTile: any;

  constructor(gridEngineHeadless: GridEngineHeadless, map: Map, data: any) {
    this.gridEngineHeadless = gridEngineHeadless;
    this.map = map;
    this.data = data;
  }
  public execute() {
    this.next();
  }
  public addOwner(character: Character) {
    this.character = character;
  }
  public next = () => {
    this.pointer++;
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
        this.findAroundGameObject();
        break;
      case 6:
        this.moveCharacter();
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
    this.next();
  }
  private getNearestSection() {
    this.selectedSection = this.map.getNearestSection(this.properSections);
    this.selectedSectionArea = this.map.getSectionArea(this.selectedSection);
    this.next();
  }
  private findProperGameObject() {
    this.selectedGameObjects = this.map.findProperGameObject(
      this.properSections,
      this.data.params.game_objects
    );
    this.next();
  }

  private getNextDestination() {
    this.getNearestGameObject();
    if(!this.selectedMapGameObject) {
      const isInTargetSection = this.map.isInSection(this.selectedSection, {x: this.character.posX, y: this.character.posY});
      if(isInTargetSection) {
       
      }
      if(!isInTargetSection) {
        
        const nearestSectionTile = this.map.getNearestEntryInSection(this.selectedSectionArea, this.character)
        const pathFinder = this.gridEngineHeadless.findShortestPath({position:{ x: this.character.posX, y: this.character.posY }, charLayer:''}, {position:{ x: nearestSectionTile.x, y: nearestSectionTile.y }, charLayer:''})
        for (let item of pathFinder.path) {
          this.currentMovePath.push(item.position)
        }

        console.log(this.currentMovePath)
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
    }
    console.log('HERE')
    console.log(this.selectedMapGameObject)
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
    this.next();
  }
  private moveCharacter() {
    // const charPos = this.character.getPos();
    // console.log(this.gridEngineHeadless.findShortestPath({position:{ x: charPos.x, y: charPos.y }, charLayer:''}, {position:{ x: this.selectedMapCloseTile.x, y: this.selectedMapCloseTile.y }, charLayer:''}))

    //this.character.move(this.selectedMapCloseTile, this.next);
  }
  private startAction() {
    console.log(
      "Execute " + this.data.action + " for " + this.data.action_duration
    );
    setTimeout(() => {
      this.next();
    }, this.data.action_duration);
  }
  private endAction() {
    console.log("finish action");
    this.map.removeGameObject(
      this.selectedSection,
      this.selectedMapGameObject
    );
    this.pointer = 0;
    this.next();
  }
}
