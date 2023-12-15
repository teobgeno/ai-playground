import { Map } from "./Map"
import { Character } from "./Character"

export class TaskGather {
  private map: Map
  private character: Character
  private data: any
  private pointer: number = 0
  private selectedSections: any
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
        this.findNearestSection();
        break
      case 2:
        this.findNearestGameObject();
        break
    }
  }
  private findNearestSection() {
    this.selectedSections = this.map.findNearestSection(
      this.data.params.sections
    )
    this.next()
  }
  private findNearestGameObject() {
    this.selectedGameObjects = this.map.findNearestGameObject(
      this.selectedSections,
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
