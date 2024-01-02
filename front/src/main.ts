import { GridEngineHeadless } from "grid-engine"
import { AsciiRenderer } from "./AsciiRenderer"
import { NoIdeaClient } from "./no-idea-client"
import { Task } from "./Task"
import { TaskGather } from "./TaskGather"
import { Action } from "./Action"
import { Map } from "./Map"
import { Character } from "./Character"

export class App {
  private gridEngineHeadless: GridEngineHeadless
  private asciiRenderer: AsciiRenderer
  private noIdeaClient: NoIdeaClient
  private moveInterval: any

  constructor() {
    this.noIdeaClient = new NoIdeaClient({
      BASE: "http://localhost:8000",
    })
  }

  public async createTask() {
    const apiData: any = await this.noIdeaClient.default.testTestGet()
    this.gridEngineHeadless = new GridEngineHeadless()
    let map = new Map(this.gridEngineHeadless)
    map.initMap()
    let character = new Character()
    let taskGather = new TaskGather(this.gridEngineHeadless, map, apiData)
    character.addTask(taskGather)
    character.startTask()
  }

  public moveCharacter(targetPos) {
    //const targetPos = { x: 1, y: 8 }
    //console.log(gridEngineHeadless.getCharLayer('player'))
    //console.log(gridEngineHeadless.findShortestPath({position:{ x: 0, y: 0 }, charLayer:''}, {position:{ x: 4, y: 5 }, charLayer:''}));

    this.gridEngineHeadless.moveTo("player", targetPos)
    this.gridEngineHeadless
      .positionChangeFinished()
      .subscribe(({ enterTile }) => {
        if (enterTile.x == targetPos.x && enterTile.y == targetPos.y) {
          console.log("ok")
          clearInterval(this.moveInterval)
        }
      })

    this.moveInterval = setInterval(() => {
      this.gridEngineHeadless.update(0, 50)
      this.asciiRenderer.render()
    }, 100)

    // //the m rows are horizontal and the n columns are vertical
    // function manhattanDist(x1, y1, x2, y2) {
    // let dist = Math.abs(x2 - x1) + Math.abs(y2 - y1);
    // return dist;
    // }

    // for(var i = 0; i < data.length; i++) {
    //   var row = data[i];
    //   for(var j = 0; j < row.length; j++) {
    //     if(row[j] > 20) {
    //       console.log(row[j] + ' -- ' + manhattanDist(0,0,i,j));
    //     }
    //   }
    // }
  }
}

const app = new App()
app.createTask()
