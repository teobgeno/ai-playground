import {
  GridEngineHeadless,
  ArrayTilemap,
  CollisionStrategy,
} from "grid-engine"
import { AsciiRenderer } from "./AsciiRenderer"
import { Character } from "./Character"

import { sortObjsByProperty } from "./Utils"

interface Section {
  layer: string
  sectionId: number
}
interface Coords {
  x: number
  y: number
  mapCode?:number
}
interface Distance {
  x: number
  y: number
  distance: number
}
export class Map {
  private gridEngineHeadless: GridEngineHeadless
  private asciiRenderer: AsciiRenderer
  private tilemap: ArrayTilemap
  private sections: Array<Section>
  private gameObjects: any
  private gameLoopInterval: any
  private exploredMap: any

  constructor(gridEngineHeadless) {
    this.gridEngineHeadless = gridEngineHeadless
    this.sections = [{ layer: "forestLayer", sectionId: 1 }]

    this.gameObjects = [{ title: "tree", id: 1, mapCode: 2 }]
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

    // this.gameLoopInterval = setInterval(() => {
    //   this.gridEngineHeadless.update(0, 50)
    //   this.asciiRenderer.render()
    // }, 100)
  }

  public getTileMap() {
    this.tilemap.getTileAt(7, 0)
  }

  public findProperSections(sectionsIds: Array<number>) {
    return this.sections.filter((x) => sectionsIds.includes(x.sectionId))
  }

  public getNearestSections(sections: Array<Section>) {
    if (sections.length === 1) {
      //return (this.tilemap as any).map[sections[0].layer].data
      return this.getSectionArea(sections[0])
    }
    return null
  }

  public getSectionArea(section: Section) {
    let borders: Array<Coords> = []
    const layer = (this.tilemap as any).map[section.layer].data
    for (let i = 0; i < layer.length; i++) {
      let row = layer[i]
      for (let j = 0; j < row.length; j++) {
        if (row[j] > 0) {
          borders.push({
            x: j,
            y: i,
            mapCode: row[j]
          })
        }
      }
    }
    return borders
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

  public findProperGameObject(selectedSections, gameObjectsIds) {
    const selectedSectionsIds = selectedSections.map((e) => e.sectionId)
    const selectedGameObjectsIds = gameObjectsIds
      .filter((x) => selectedSectionsIds.includes(x.section_id))
      .map((e) => e.id)
    return this.gameObjects.filter((x) => selectedGameObjectsIds.includes(x.id))
  }

  public getNearestGameObject(sectionArea: Array<Coords>, objCode: number, character: Character) {
    let distances: any = []
    const instances = this.countInstances(sectionArea)
    if (instances[objCode] > 0) {
      
      const exploredGameObjects = this.getExploredGameObjects(sectionArea, objCode);
      if(exploredGameObjects.length ) {
        distances = sortObjsByProperty(
          this.calcGameObjectsDistances(exploredGameObjects, character),
          "distance"
        )
        return distances[0]
      }
     
    }

    return distances
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

    let freeTiles: any = []
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
    freeTiles = sortObjsByProperty(freeTiles, "distance")
    //console.log( freeTiles[0])
    return freeTiles[0]
  }

  private calcGameObjectsDistances(exploredGameObjects: Array<Coords>, character: Character) {
    let distances: Array<Distance> = []
    for (let exploreGameObject of exploredGameObjects) {
      distances.push({
        x: exploreGameObject.x,
        y: exploreGameObject.y,
        distance: this.manhattanDist(character.posX, character.posY, exploreGameObject.x, exploreGameObject.y),
      })
    }
    return distances
  }

  private getExploredGameObjects(sectionArea: Array<Coords>, objCode) {

    let exploredGameObjects: Array<Coords> = []

    for (let item of sectionArea) {
      if (item.mapCode === objCode && this.exploredMap[item.y][item.x] === 1) {
        exploredGameObjects.push({
          x: item.x,
          y: item.y,
        })
      }
    }
    return exploredGameObjects;
  }

  private manhattanDist(x1, y1, x2, y2) {
    //https://gamedev.stackexchange.com/questions/31546/find-nearest-tile-of-type-x
    let dist = Math.abs(x2 - x1) + Math.abs(y2 - y1)
    return dist
  }

  private countInstances (sectionArea: Array<Coords>) {
    return sectionArea.reduce((acc, arr) => {
      if(arr.mapCode) {
        acc[arr.mapCode] = acc[arr.mapCode] !== undefined ? acc[arr.mapCode] + 1 : 1
      }
      return acc
    }, {})
  }
}
