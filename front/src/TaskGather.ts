import { Map } from "./Map";
import { Character } from "./Character";

export class TaskGather {
  private map: Map;
  private character: Character;
  private data: any;
  private pointer: number = 0;
  private selectedSections: any;
  private selectedLayers: any;
  private selectedGameObjects: any;
  private selectedMapGameObject: any;
  private selectedMapCloseTile: any;

  constructor(map: Map, character: Character, data: any) {
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
        this.findNearestSections();
        break;
      case 2:
        this.getNearestSections();
        break;
      case 3:
        this.findNearestGameObject();
        break;
      case 4:
        this.getNearestGameObject();
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
    }
  }
  private findNearestSections() {
    this.selectedSections = this.map.findNearestSections(
      this.data.params.sections
    );
    this.next();
  }
  private getNearestSections() {
    this.selectedLayers = this.map.getNearestSections(this.selectedSections);
    this.next();
  }
  private findNearestGameObject() {
    this.selectedGameObjects = this.map.findNearestGameObject(
      this.selectedSections,
      this.data.params.game_objects
    );
    this.next();
  }
  private getNearestGameObject() {
    this.selectedMapGameObject = this.map.getNearestGameObject(
      this.selectedLayers,
      this.selectedGameObjects[0].mapCode
    );
    this.next();
  }

  private findAroundGameObject() {
    this.selectedMapCloseTile = this.selectedMapGameObject =
      this.map.findAroundGameObject(this.selectedMapGameObject);
    this.next();
  }
  private moveCharacter() {
    this.character.move(this.selectedMapCloseTile, this.next);
  }
  private startAction() {
    console.log("Execute " + this.data.action);
  }
}
