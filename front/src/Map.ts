import {
  GridEngineHeadless,
  ArrayTilemap,
  CollisionStrategy,
} from "grid-engine";
import { AsciiRenderer } from "./AsciiRenderer";
import { Character } from "./Character";

import {
  countInstances,
  sortObjsByProperty
} from "./Utils";

export class Map {
  private gridEngineHeadless: GridEngineHeadless;
  private asciiRenderer: AsciiRenderer;
  private tilemap: ArrayTilemap;
  private sections: any;
  private gameObjects: any;
  private gameLoopInterval: any

  constructor(gridEngineHeadless) {
    this.gridEngineHeadless = gridEngineHeadless;
    this.sections = [
      { layer: "forestLayer", sectionId: 1 }
    ];

    this.gameObjects = [{ title: "tree", id:1, mapCode: 2 }];
  }

  public initMap() {
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
    });
    this.gridEngineHeadless.create(this.tilemap, {
      characters: [{ id: "player" }],
      characterCollisionStrategy: CollisionStrategy.BLOCK_ONE_TILE_AHEAD,
    });

    this.asciiRenderer = new AsciiRenderer(
      "content",
      this.gridEngineHeadless,
      this.tilemap
    );
    this.asciiRenderer.render();

    this.gameLoopInterval = setInterval(() => {
      this.gridEngineHeadless.update(0, 50)
      this.asciiRenderer.render()
    }, 100)
  }

  public getTileMap() {
    this.tilemap.getTileAt(7,0);
  }

  public findProperSections(sectionsIds: Array<number>) {
    return this.sections.filter(x=> sectionsIds.includes(x.sectionId));
  }

  public getNearestSections(sections:Array<any>) {
    if(sections.length === 1) {
      return (this.tilemap as any).map[sections[0].layer].data;
    }
    return null;
  }
  
  public removeGameObject(sections:Array<any>, mapGameObject) {
    (this.tilemap as any).map[sections[0].layer].data[mapGameObject.y][mapGameObject.x] = 0;
    (this.tilemap as any).map['collisions'].data[mapGameObject.y][mapGameObject.x] = 0;
    (this.tilemap.getLayers()[0] as any).tiles[mapGameObject.y][mapGameObject.x].isBlocking = false;
    //console.log(this.gridEngineHeadless.isTileBlocked({ x: mapGameObject.x, y:mapGameObject.y }));
  }

  public findProperGameObject(selectedSections, gameObjectsIds) {
    const selectedSectionsIds = selectedSections.map((e) => e.sectionId);
    const selectedGameObjectsIds = gameObjectsIds.filter(x=> selectedSectionsIds.includes(x.section_id)).map((e) => e.id);
    return this.gameObjects.filter(x=> selectedGameObjectsIds.includes(x.id));
  }

  public getNearestGameObject(layer, objCode, character: Character) {
    let distances: any = [];
    const instances = countInstances(layer);
    if (instances[objCode] > 0) {
      distances = sortObjsByProperty(
        this.calcGameObjectsDistances(layer, objCode, character),
        "distance"
      );
      return distances[0];
    }
    
    return null;
  }

  public findAroundGameObject(mapGameObject, character: Character) {
    let t = (this.tilemap as any).map.collisions.data;
    const neighbourTiles = {
      top: { x: mapGameObject.x, y: mapGameObject.y - 1, distance: 0 },
      topLeft: { x: mapGameObject.x - 1, y: mapGameObject.y - 1, distance: 0 },
      topRight: { x: mapGameObject.x + 1, y: mapGameObject.y - 1, distance: 0 },
      left: { x: mapGameObject.x - 1, y: mapGameObject.y, distance: 0 },
      right: { x: mapGameObject.x + 1, y: mapGameObject.y, distance: 0 },
      bottom: { x: mapGameObject.x, y: mapGameObject.y + 1, distance: 0 },
      bottomLeft: { x: mapGameObject.x - 1, y: mapGameObject.y + 1, distance: 0 },
      bottomRight: { x: mapGameObject.x + 1, y: mapGameObject.y + 1, distance: 0 },
    };

    let freeTiles: any = [];
    for (const [key, value] of Object.entries(neighbourTiles)) {
      t.hasOwnProperty(value.x);
      if (t.hasOwnProperty(value.y) && t[value.y].hasOwnProperty(value.x)) {
        if (t[value.y][value.x] !== 1) {
          value.distance = this.manhattanDist(character.posX, character.posY, value.x, value.y);
          freeTiles.push(value);
        }
      }
    }
    freeTiles = sortObjsByProperty(
      freeTiles,
      "distance"
    );
    //console.log( freeTiles[0])
    return freeTiles[0];
  }

  private calcGameObjectsDistances(layer, objCode, character: Character) {
    let distances: any = [];
    for (let i = 0; i < layer.length; i++) {
      let row = layer[i];
      for (let j = 0; j < row.length; j++) {
        if (row[j] === objCode) {
          //console.log(character.posX, character.posY, j, i)
          distances.push({
            x: j,
            y: i,
            distance: this.manhattanDist(character.posX, character.posY, j, i),
          });
        }
      }
    }
    return distances;
  }

  private manhattanDist(x1, y1, x2, y2) {
    //https://gamedev.stackexchange.com/questions/31546/find-nearest-tile-of-type-x
    let dist = Math.abs(x2 - x1) + Math.abs(y2 - y1);
    return dist;
  }
}
