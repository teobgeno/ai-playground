import {
  GridEngineHeadless,
  ArrayTilemap,
  CollisionStrategy,
} from "grid-engine";
import { AsciiRenderer } from "./AsciiRenderer";

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

  constructor() {
    this.gridEngineHeadless = new GridEngineHeadless();
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
  }

  public findNearestSections(sectionIds: Array<number>) {
    return this.sections.filter(x=> sectionIds.includes(x.sectionId));
  }

  public getNearestSections(sections:Array<any>) {
    if(sections.length === 1) {
      return (this.tilemap as any).map[sections[0].layer].data;
    }
    return null;
  }

  public findNearestGameObject(selectedSections, gameObjectIds) {
    const sectionIds = selectedSections.map((e) => e.sectionId);
    const gameObjectsIds = gameObjectIds.filter(x=> sectionIds.includes(x.section_id)).map((e) => e.id);
    return this.gameObjects.filter(x=> gameObjectsIds.includes(x.id));
  }

  public getNearestGameObject(section, objCode) {
    let distances: any = [];
    const instances = countInstances(section);
    if (instances[objCode] > 1) {
      distances = sortObjsByProperty(
        this.calcGameObjectsDistances(section, objCode),
        "distance"
      );
    }
    return distances[0];
  }

  public findAroundGameObject(gameObject) {
    let t = (this.tilemap as any).map.collisions.data;
    const neighbourTiles = {
      top: { x: gameObject.x, y: gameObject.y - 1, distance: 0 },
      topLeft: { x: gameObject.x - 1, y: gameObject.y - 1, distance: 0 },
      topRight: { x: gameObject.x + 1, y: gameObject.y - 1, distance: 0 },
      left: { x: gameObject.x - 1, y: gameObject.y, distance: 0 },
      right: { x: gameObject.x + 1, y: gameObject.y, distance: 0 },
      bottom: { x: gameObject.x, y: gameObject.y + 1, distance: 0 },
      bottomLeft: { x: gameObject.x - 1, y: gameObject.y + 1, distance: 0 },
      bottomRight: { x: gameObject.x + 1, y: gameObject.y + 1, distance: 0 },
    };

    let freeTiles: any = [];
    for (const [key, value] of Object.entries(neighbourTiles)) {
      t.hasOwnProperty(value.x);
      if (t.hasOwnProperty(value.y) && t[value.y].hasOwnProperty(value.x)) {
        if (t[value.y][value.x] !== 1) {
          value.distance = this.manhattanDist(0, 0, value.y, value.x);
          freeTiles.push(value);
        }
      }
    }

    console.log(freeTiles);
    return freeTiles[2];
    return { x: gameObject.x, y: gameObject.y - 1 };
  }

  private calcGameObjectsDistances(s, objCode) {
    let distances: any = [];
    for (let i = 0; i < s.length; i++) {
      let row = s[i];
      for (let j = 0; j < row.length; j++) {
        if (row[j] == 2) {
          distances.push({
            x: j,
            y: i,
            distance: this.manhattanDist(0, 0, i, j),
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
