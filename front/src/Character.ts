import { GridEngineHeadless } from "grid-engine"
import { Map } from "./Map"
import PubSub from 'pubsub-js'
export class Character {
  private gridEngineHeadless: GridEngineHeadless
  public posX: number = 0
  public posY: number = 0
  private map: Map
  private fovDistance = 1

  constructor(gridEngineHeadless: GridEngineHeadless, map: Map) {
    this.gridEngineHeadless = gridEngineHeadless
    this.map = map
  }

  public getPos() {
    return { x: this.posX, y: this.posY }
  }

  public setPos(x: number, y: number) {
    this.posX = x
    this.posY = y
  }

  public getFovDistance() {
    return this.fovDistance;
  }

  public fov() {
    // https://math.stackexchange.com/questions/859760/calculating-size-of-an-object-based-on-distance
  }

  public move(targetPos, cb) {
    if (this.posX === targetPos.x && this.posY === targetPos.y) {
      cb()
      return
    }

    this.gridEngineHeadless.moveTo("player", targetPos)
    this.gridEngineHeadless
      .positionChangeFinished()
      .subscribe(({ enterTile }) => {
        // check https://annoraaq.github.io/grid-engine/api/classes/GridEngineHeadless.html#move
        //this.gridEngineHeadless.stopMovement("player")
        this.posX = enterTile.x
        this.posY = enterTile.y
        if (enterTile.x == targetPos.x && enterTile.y == targetPos.y) {
          cb()
        }
      })
  }
}
