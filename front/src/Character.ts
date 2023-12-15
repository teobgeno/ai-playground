import { GridEngineHeadless } from "grid-engine";
export class Character {
  private gridEngineHeadless: GridEngineHeadless;
  public posX: number = 0;
  public posY: number = 0;

  constructor(gridEngineHeadless) {
    this.gridEngineHeadless = gridEngineHeadless;
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
        this.posX = enterTile.x;
        this.posY = enterTile.y;
        if (enterTile.x == targetPos.x && enterTile.y == targetPos.y) {
          cb();
        }
      });
  }
}
