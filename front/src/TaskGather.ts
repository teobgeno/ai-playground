import { GridEngineHeadless } from "grid-engine"
import { Map } from "./Map";
import { Character } from "./Character";

export class TaskGather {
  private gridEngineHeadless: GridEngineHeadless
  private map: Map;
  private character: Character;
  private data: any;
  private pointer: number = 0;
  private selectedSections: any;
  private selectedLayers: any;
  private selectedGameObjects: any;
  private selectedMapGameObject: any;
  private selectedMapCloseTile: any;

  constructor(gridEngineHeadless: GridEngineHeadless, map: Map, character: Character, data: any) {
    this.gridEngineHeadless = gridEngineHeadless;
    this.map = map;
    this.character = character;
    this.data = data;
  }
  public execute() {
    this.next();
  }
  next = () => {
    this.pointer++;
    switch (this.pointer) {
      case 1:
        this.findProperSections();
        break;
      case 2:
        this.getNearestSections();
        break;
      case 3:
        this.findProperGameObject();
        break;
      case 4:
        this.getNearestDestination();
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
    this.selectedSections = this.map.findProperSections(
      this.data.params.sections
    );
    this.next();
  }
  private getNearestSections() {
    this.selectedLayers = this.map.getNearestSections(this.selectedSections);
    this.next();
  }
  private findProperGameObject() {
    this.selectedGameObjects = this.map.findProperGameObject(
      this.selectedSections,
      this.data.params.game_objects
    );
    this.next();
  }

  private getNearestDestination() {
    this. getNearestGameObject();
    if(!this.selectedMapGameObject) {
       //if the area is full explored and no selectedMapGameObject find other section
       //if char not in section area find nearest path to enter
       //if char in area move to nearest tile to explore
    }
    console.log('HERE')
    console.log(this.selectedMapGameObject)
  }

  private getNearestGameObject() {
    this.selectedMapGameObject = this.map.getNearestGameObject(
      this.selectedLayers,
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
      this.selectedSections,
      this.selectedMapGameObject
    );
    this.pointer = 0;
    this.next();
  }
}
