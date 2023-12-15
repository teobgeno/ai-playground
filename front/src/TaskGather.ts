import { Map } from "./Map"
import { Character } from "./Character"

export class TaskGather {
  private map: Map
  private character: Character
  private data: any
  private pointer: number = 0
  private selectedSectionsIds: any
  private selectedLayers: any
  private selectedGameObjects: any

  constructor(map: Map, character: Character, data: any) {
    this.map = map
    this.character = character
    this.data = data
  }
  public  execute() {
    this.next();
  }
  private next() {
    this.pointer++;
    switch (this.pointer) {
      case 1:
        this.findNearestSections();
        break
      case 2:
        this.getNearestSections();
        break
        case 3:
        //this.findNearestGameObject();
        break
    }
  }
  private findNearestSections() {
    this.selectedSectionsIds = this.map.findNearestSections(
      this.data.params.sections
    )
    this.next()
  }
  private getNearestSections() {
    this.selectedLayers = this.map.getNearestSections(
      this.selectedSectionsIds,
    )
    this.next()
  }
  private findNearestGameObject() {
    this.selectedGameObjects = this.map.findNearestGameObject(
      this.selectedLayers,
      2
    )
    this.next()
  }
  private findAroundGameObject() {
    this.map.findAroundGameObject(this.selectedGameObjects)
    this.next()
  }
  private moveCharacter() {}
  private onMoveCharacterEnd() {}
}
