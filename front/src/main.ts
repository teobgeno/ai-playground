import {
  GridEngineHeadless,
  ArrayTilemap,
  CollisionStrategy,
} from "grid-engine"
import { AsciiRenderer } from "./AsciiRenderer"

export class App {
  constructor(
    private gridEngineHeadless: GridEngineHeadless,
    private asciiRenderer: AsciiRenderer,
    private tilemap: ArrayTilemap
  ) {
    this.gridEngineHeadless = new GridEngineHeadless()
  }

  private initMap() {
    // A simple example tilemap created from an array.
    // 0 = non-blocking
    // 1 = blocking
    const tilemap = new ArrayTilemap({
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
      treesLayer: {
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
    this.gridEngineHeadless.create(tilemap, {
      characters: [{ id: "player" }],
      characterCollisionStrategy: CollisionStrategy.BLOCK_ONE_TILE_AHEAD,
    })

    const asciiRenderer = new AsciiRenderer(
      "content",
      this.gridEngineHeadless,
      tilemap
    )
    asciiRenderer.render()
  }

  private moveCharacter() {
    const targetPos = { x: 1, y: 8 }
    //console.log(gridEngineHeadless.getCharLayer('player'))
    //console.log(gridEngineHeadless.findShortestPath({position:{ x: 0, y: 0 }, charLayer:''}, {position:{ x: 4, y: 5 }, charLayer:''}));
    this.gridEngineHeadless.moveTo("player", targetPos)

    this.gridEngineHeadless
      .positionChangeFinished()
      .subscribe(({ enterTile }) => {
        // if (enterTile.x == targetPos.x && enterTile.y == targetPos.y) {
        //   gridEngineHeadless.setPosition("player", { x: 0, y: 0 });
        //   gridEngineHeadless.moveTo("player", targetPos);
        // }
      })

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

// setInterval(() => {
//   gridEngineHeadless.update(0, 50);
//   asciiRenderer.render();
// }, 100);
