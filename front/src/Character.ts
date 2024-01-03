import { Task } from "./Task"
import PubSub from "pubsub-js"
import {Coords, GameObjectCode, GameObjectDistance } from "./Map";
export class Character {
  public posX: number = 0
  public posY: number = 0
  private fovDistance = 1
  private tasks: Array<Task> = []

  constructor() {}

  public getPos() {
    return { x: this.posX, y: this.posY }
  }

  public setPos(targetPos: Coords) {
    this.posX = targetPos.x
    this.posY = targetPos.y
  }

  public getFovDistance() {
    return this.fovDistance
  }

  public fov() {
    // https://math.stackexchange.com/questions/859760/calculating-size-of-an-object-based-on-distance
  }

  public move(targetPos: Coords) {
    PubSub.publish('on-character-move', {targetPos: targetPos, fovDistance:this.fovDistance, cb:this.moveFinish});
    // if (this.posX === targetPos.x && this.posY === targetPos.y) {
    //   cb()
    //   return
    // }
    // this.gridEngineHeadless.moveTo("player", targetPos)
    // this.gridEngineHeadless
    //   .positionChangeFinished()
    //   .subscribe(({ enterTile }) => {
    //     // check https://annoraaq.github.io/grid-engine/api/classes/GridEngineHeadless.html#move
    //     //this.gridEngineHeadless.stopMovement("player")
    //     this.posX = enterTile.x
    //     this.posY = enterTile.y
    //     if (enterTile.x == targetPos.x && enterTile.y == targetPos.y) {
    //       cb()
    //     }
    //   })
  }

  moveFinish = (targetPos: Coords) => {
    console.log('move finished')
    this.setPos(targetPos)
    this.tasks[0].next();
    
  }

  public addTask(task: Task) {
    task.addOwner(this)
    this.tasks.push(task)
  }

  public startTask() {
    this.tasks[0].execute();
  }
}
