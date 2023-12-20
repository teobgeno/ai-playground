import { GridEngineHeadless } from "grid-engine";
import { Map } from "./Map"
export class Character {
  private gridEngineHeadless: GridEngineHeadless;
  public posX: number = 0;
  public posY: number = 0;
  private map: Map;

  constructor(gridEngineHeadless: GridEngineHeadless, map: Map) {
    this.gridEngineHeadless = gridEngineHeadless;
    this.map = map;
  }

  public move(targetPos, cb) {

    if(this.posX === targetPos.x && this.posY === targetPos.y ) {
        cb();
        return;
    }

    this.gridEngineHeadless.moveTo("player", targetPos);
    this.gridEngineHeadless
      .positionChangeFinished()
      .subscribe(({ enterTile }) => {
        // check https://annoraaq.github.io/grid-engine/api/classes/GridEngineHeadless.html#move
        //this.gridEngineHeadless.stopMovement("player")
        console.log(this.map.getTileMap())
        this.posX = enterTile.x;
        this.posY = enterTile.y;
        if (enterTile.x == targetPos.x && enterTile.y == targetPos.y) {
          cb();
        }
      });
  }
}
