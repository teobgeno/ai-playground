import {
  GridEngineHeadless,
} from "grid-engine"
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


  public async createTask() {
    const t:any = await this.noIdeaClient.default.testTestGet();
    let map = new Map();
    map.initMap();
    let character = new Character();
    let taskGather = new TaskGather(map, character, t);
    taskGather.execute();

    // task.addAction(new Action(map.findNearestSection,[t.params.sections]));
    // task.addAction(new Action(map.findNearestGameObject,['[0]',2]));
    // task.addAction(new Action(map.findAroundGameObject,['[1]']));
    // task.addAction(new Action(character.move,['[1]']));
    // console.log(t)
    // console.log(map.findNearestSection(t.params.sections))
    //task.addAction(new Action(map.findNearestGameObject(1)))
    
   
  }

  public locateAction() {
    // const sectionTiles = this.findSection(1)
    // const gameObject = this.findNearestGameObject(sectionTiles, 2)
    // const nearGameObject = this.findAroundGameObject(gameObject)
    // this.moveCharacter(nearGameObject)
    // console.log(gameObject)
    // console.log(nearGameObject)
  }
}

const app = new App()
app.createTask();
