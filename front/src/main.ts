import {
  GridEngineHeadless,
  ArrayTilemap,
  CollisionStrategy,
} from "grid-engine"
import { AsciiRenderer } from "./AsciiRenderer"
import { NoIdeaClient } from "./no-idea-client"
import { Task } from "./Task"
import { Action } from "./Action"
import { Map } from "./Map"
import { Character } from "./Character"

export class App {
  private gridEngineHeadless: GridEngineHeadless
  private asciiRenderer: AsciiRenderer
  private tilemap: ArrayTilemap
  private noIdeaClient: NoIdeaClient
  private moveInterval: any

  constructor() {
    this.gridEngineHeadless = new GridEngineHeadless()
    this.noIdeaClient = new NoIdeaClient({
      BASE: "http://localhost:8000",
    })
  }

  public initMap() {
    // A simple example tilemap created from an array.
    // 0 = non-blocking
    // 1 = blocking
    this.tilemap = new ArrayTilemap({
      collisions: {
        data: [
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        ],
      },
      forestLayer: {
        data: [
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [2, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        ],
      },
    })
    this.gridEngineHeadless.create(this.tilemap, {
      characters: [{ id: "player" }],
      characterCollisionStrategy: CollisionStrategy.BLOCK_ONE_TILE_AHEAD,
    })

    this.asciiRenderer = new AsciiRenderer(
      "content",
      this.gridEngineHeadless,
      this.tilemap
    )
    this.asciiRenderer.render()
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


  public createTask() {
    const t = this.noIdeaClient.default.testTestGet();
    let task = new Task();
    let map = new Map();
    let character = new Character();

    task.addAction(new Action(map.findSection,[1]));
    task.addAction(new Action(map.findNearestGameObject,['[0]',2]));
    task.addAction(new Action(map.findAroundGameObject,['[1]']));
    task.addAction(new Action(character.move,['[1]']));
    //task.addAction(new Action(map.findNearestGameObject(1)))
    
    console.log(t)
  }

  public getApiData() {
    const t = this.noIdeaClient.default.testTestGet()
    
  }

  public locateAction() {
    const sectionTiles = this.findSection(1)
    const gameObject = this.findNearestGameObject(sectionTiles, 2)
    const nearGameObject = this.findAroundGameObject(gameObject)
    this.moveCharacter(nearGameObject)
    console.log(gameObject)
    console.log(nearGameObject)
  }

  private findSection(sectionCode) {
    let s = (this.tilemap as any).map.forestLayer.data
    return s
  }

  private findAroundGameObject(gameObject) {
    let t = (this.tilemap as any).map.collisions.data
    const neighbourTiles = {
      top: { x: gameObject.x, y: gameObject.y - 1, distance: 0},
      topLeft: { x: gameObject.x - 1, y: gameObject.y - 1, distance: 0},
      topRight: { x: gameObject.x + 1, y: gameObject.y - 1, distance: 0},
      left: { x: gameObject.x - 1, y: gameObject.y, distance: 0},
      right: { x: gameObject.x + 1, y: gameObject.y, distance: 0},
      bottom: { x: gameObject.x, y: gameObject.y + 1, distance: 0},
      bottomLeft: { x: gameObject.x - 1, y: gameObject.y + 1, distance: 0},
      bottomRight: { x: gameObject.x + 1, y: gameObject.y + 1, distance: 0},
    }


    let freeTiles:any = [];
    for (const [key, value] of Object.entries(neighbourTiles)) {
      t.hasOwnProperty(value.x)
      if (t.hasOwnProperty(value.y) && t[value.y].hasOwnProperty(value.x)) {
        if(t[value.y][value.x] !== 1){
          value.distance = this.manhattanDist(0, 0, value.y, value.x);
          freeTiles.push(value);
        }
      }
    }

    
    console.log(freeTiles)
    return freeTiles[2]
    return { x: gameObject.x, y: gameObject.y - 1 }
  }

  private findNearestGameObject(s, objCode) {
    let distances: any = []
    const instances = this.countGameObjectInstances(s)
    if (instances[objCode] > 1) {
      distances = this.sortObjsByProperty(
        this.calcGameObjectsDistances(s, objCode),
        "distance"
      )
    }
    return distances[0]
  }

  private calcGameObjectsDistances(s, objCode) {
    let distances: any = []
    for (let i = 0; i < s.length; i++) {
      let row = s[i]
      for (let j = 0; j < row.length; j++) {
        if (row[j] == 2) {
          distances.push({
            x: j,
            y: i,
            distance: this.manhattanDist(0, 0, i, j),
          })
        }
      }
    }
    return distances
  }

  private manhattanDist(x1, y1, x2, y2) {
    //https://gamedev.stackexchange.com/questions/31546/find-nearest-tile-of-type-x
    let dist = Math.abs(x2 - x1) + Math.abs(y2 - y1)
    return dist
  }

  private countGameObjectInstances(s) {
    return s.reduce((acc, arr) => {
      for (const item of arr) {
        acc[item] = acc[item] !== undefined ? acc[item] + 1 : 1
      }

      return acc
    }, {})
  }

  private sortObjsByProperty(objs, property) {
    return objs.sort((a, b) => a[property] - b[property])
  }
}

const app = new App()
//app.getApiData();
app.initMap()
//app.moveCharacter();
app.locateAction()
