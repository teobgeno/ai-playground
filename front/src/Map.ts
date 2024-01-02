import {
  GridEngineHeadless,
  ArrayTilemap,
  CollisionStrategy,
} from "grid-engine"
import { AsciiRenderer } from "./AsciiRenderer"
import PubSub from "pubsub-js"
import { Character } from "./Character"
import { Utils } from "./Utils"

interface Section {
  layer: string
  sectionId: number
}
export interface Coords {
  x: number
  y: number
}
export interface GameObjectCode extends Coords{
  mapCode?:number
}
export interface GameObjectDistance extends Coords{
  distance: number
}
export class Map {
  private gridEngineHeadless: GridEngineHeadless
  private asciiRenderer: AsciiRenderer
  private tilemap: ArrayTilemap
  private sections: Array<Section>
  private gameObjects: any
  private gameLoopInterval: any
  private exploredMap:number[][]
  private isRendering : boolean

  constructor(gridEngineHeadless) {
    this.gridEngineHeadless = gridEngineHeadless
    this.sections = [{ layer: "forestLayer", sectionId: 1 }]
    this.gameObjects = [{ title: "tree", id: 1, mapCode: 2 }]
    this.isRendering = false;
    PubSub.subscribe('on-character-move', this.moveCharacter);
  }

  public initMap() {
    // this.exploredMap = {
    //   forestLayer: {
    //     data: [
    //       [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    //       [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    //       [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    //       [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    //       [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    //       [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    //       [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    //       [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    //       [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    //       [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    //     ],
    //   },
    // }

    this.exploredMap = [
      [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ]

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
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
          [0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
          [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
          [2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
          [2, 3, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
          [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
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
      this.tilemap,
      this.exploredMap
    )
    this.asciiRenderer.render()

    this.gameLoopInterval = setInterval(() => {
      if(this.isRendering) {
        this.gridEngineHeadless.update(0, 50)
        this.asciiRenderer.render()
      }
    
    }, 100)
  }

  // public getTileMap() {
  //   this.tilemap.getTileAt(7, 0)
  // }

  moveCharacter = (msg, data) => {
    console.log(data.targetPos)
    this.isRendering = true;
    this.gridEngineHeadless.moveTo("player", data.targetPos)
    this.fovCharacter(data.targetPos, data.fovDistance)
    this.gridEngineHeadless
      .positionChangeFinished()
      .subscribe(({ enterTile }) => {
        // check https://annoraaq.github.io/grid-engine/api/classes/GridEngineHeadless.html#move
        //this.gridEngineHeadless.stopMovement("player")
        if (enterTile.x == data.targetPos.x && enterTile.y == data.targetPos.y) {
          data.cb()
          this.isRendering = false;
        }
      })
  }

  fovCharacter = (currentPos, fovDistance) => {
    const fovTiles = {
      top: { x: currentPos.x, y: currentPos.y - fovDistance },
      topLeft: { x: currentPos.x - fovDistance, y: currentPos.y - fovDistance },
      topRight: { x: currentPos.x + fovDistance, y: currentPos.y - fovDistance },
      left: { x: currentPos.x - fovDistance, y: currentPos.y },
      right: { x: currentPos.x + fovDistance, y: currentPos.y },
      bottom: { x: currentPos.x, y: currentPos.y + fovDistance },
      bottomLeft: {
        x: currentPos.x - fovDistance,
        y: currentPos.y + fovDistance
      },
      bottomRight: {
        x: currentPos.x + fovDistance,
        y: currentPos.y + fovDistance
      },
    }

    for (const [key, value] of Object.entries(fovTiles)) {
      this.exploredMap.hasOwnProperty(value.x)
      if (this.exploredMap.hasOwnProperty(value.y) && this.exploredMap[value.y].hasOwnProperty(value.x)) {
        this.exploredMap [value.y][value.x] = 1;
      }
    }
  }

  public findProperSections(sectionsIds: Array<number>) {
    return this.sections.filter((x) => sectionsIds.includes(x.sectionId))
  }

  public getNearestSection(sections: Array<Section>) {
    if (sections.length === 1) {
      //return (this.tilemap as any).map[sections[0].layer].data
      return sections[0];
      //return this.getSectionArea(sections[0])
    }
    return null
  }

  public getSectionArea(section: Section) {
    let area: Array<GameObjectCode> = []
    const layer = (this.tilemap as any).map[section.layer].data
    for (let i = 0; i < layer.length; i++) {
      let row = layer[i]
      for (let j = 0; j < row.length; j++) {
        if (row[j] > 0) {
          area.push({
            x: j,
            y: i,
            mapCode: row[j]
          })
        }
      }
    }
    return area
  }

  public isInSection(section: Section, position: Coords) {
    const layer = (this.tilemap as any).map[section.layer].data;
    if(layer[position.y][position.x] !== 0){
      return true;
    }
    return false;
  }

  public getNearestEntryInSection(sectionArea: Array<GameObjectCode>, character: Character) {
    const sectionAreaDistances = Utils.sortObjsByProperty(this.calcGameObjectsDistances(this.getFreeTilesFromCollection(sectionArea), character), "distance")
    return sectionAreaDistances[0]

  }

  public removeGameObject(sections: Array<any>, mapGameObject) {
    ;(this.tilemap as any).map[sections[0].layer].data[mapGameObject.y][
      mapGameObject.x
    ] = 0
    ;(this.tilemap as any).map["collisions"].data[mapGameObject.y][
      mapGameObject.x
    ] = 0
    ;(this.tilemap.getLayers()[0] as any).tiles[mapGameObject.y][
      mapGameObject.x
    ].isBlocking = false
    //console.log(this.gridEngineHeadless.isTileBlocked({ x: mapGameObject.x, y:mapGameObject.y }));
  }

  public findProperGameObject(selectedSections: Array<Section>, gameObjectsIds) {
    const selectedSectionsIds = selectedSections.map((e) => e.sectionId)
    const selectedGameObjectsIds = gameObjectsIds
      .filter((x) => selectedSectionsIds.includes(x.section_id))
      .map((e) => e.id)
    return this.gameObjects.filter((x) => selectedGameObjectsIds.includes(x.id))
  }

  public getNearestGameObject(sectionArea: Array<GameObjectCode>, objCode: number, character: Character) {
    let distances: Array<GameObjectDistance> = []
    const instances = this.countInstances(sectionArea)
    if (instances[objCode] > 0) {
      
      const exploredGameObjects = this.getExploredGameObjects(sectionArea, objCode);
      if(exploredGameObjects.length ) {
        distances = Utils.sortObjsByProperty(
          this.calcGameObjectsDistances(exploredGameObjects, character),
          "distance"
        )
        return distances[0]
      }
     
    }

    return null
  }

  public findAroundGameObject(mapGameObject, character: Character) {
    let t = (this.tilemap as any).map.collisions.data
    const neighbourTiles = {
      top: { x: mapGameObject.x, y: mapGameObject.y - 1, distance: 0 },
      topLeft: { x: mapGameObject.x - 1, y: mapGameObject.y - 1, distance: 0 },
      topRight: { x: mapGameObject.x + 1, y: mapGameObject.y - 1, distance: 0 },
      left: { x: mapGameObject.x - 1, y: mapGameObject.y, distance: 0 },
      right: { x: mapGameObject.x + 1, y: mapGameObject.y, distance: 0 },
      bottom: { x: mapGameObject.x, y: mapGameObject.y + 1, distance: 0 },
      bottomLeft: {
        x: mapGameObject.x - 1,
        y: mapGameObject.y + 1,
        distance: 0,
      },
      bottomRight: {
        x: mapGameObject.x + 1,
        y: mapGameObject.y + 1,
        distance: 0,
      },
    }

    let freeTiles: Array<GameObjectDistance> = []
    for (const [key, value] of Object.entries(neighbourTiles)) {
      t.hasOwnProperty(value.x)
      if (t.hasOwnProperty(value.y) && t[value.y].hasOwnProperty(value.x)) {
        if (t[value.y][value.x] !== 1) {
          value.distance = this.manhattanDist(
            character.posX,
            character.posY,
            value.x,
            value.y
          )
          freeTiles.push(value)
        }
      }
    }
    freeTiles = Utils.sortObjsByProperty(freeTiles, "distance")
    //console.log( freeTiles[0])
    return freeTiles[0]
  }

  private getExploredGameObjects(sectionArea: Array<GameObjectCode>, objCode) {

    let exploredGameObjects: Array<GameObjectCode> = []

    for (let item of sectionArea) {
      //TODO:: item.mapCode in array objCode should be array
      if (item.mapCode === objCode && this.exploredMap[item.y][item.x] === 1) {
        exploredGameObjects.push({
          x: item.x,
          y: item.y,
        })
      }
    }
    return exploredGameObjects;
  }

  public calcGameObjectsDistances(gameObjects: Array<GameObjectCode>, character: Character) {
    let distances: Array<GameObjectDistance> = []
    for (let gameObject of gameObjects) {
      distances.push({
        x: gameObject.x,
        y: gameObject.y,
        distance: this.manhattanDist(character.posX, character.posY, gameObject.x, gameObject.y),
      })
    }
    return distances
  }

  private getFreeTilesFromCollection(tiles: Array<GameObjectCode | GameObjectDistance>) {
    let t = (this.tilemap as any).map.collisions.data
    let freeTiles: Array<GameObjectCode| GameObjectDistance> = []
    for (const [key, value] of Object.entries(tiles)) {
      t.hasOwnProperty(value.x)
      if (t.hasOwnProperty(value.y) && t[value.y].hasOwnProperty(value.x)) {
        if (t[value.y][value.x] !== 1) {
          freeTiles.push(value)
        }
      }
    }
    freeTiles = Utils.sortObjsByProperty(freeTiles, "distance")

    return freeTiles
  }

  private manhattanDist(x1, y1, x2, y2) {
    //https://gamedev.stackexchange.com/questions/31546/find-nearest-tile-of-type-x
    let dist = Math.abs(x2 - x1) + Math.abs(y2 - y1)
    return dist
  }

  private countInstances (sectionArea: Array<GameObjectCode>) {
    return sectionArea.reduce((acc, arr) => {
      if(arr.mapCode) {
        acc[arr.mapCode] = acc[arr.mapCode] !== undefined ? acc[arr.mapCode] + 1 : 1
      }
      return acc
    }, {})
  }
}
