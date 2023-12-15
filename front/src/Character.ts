import { GridEngineHeadless } from "grid-engine";
export class Character {
  private gridEngineHeadless: GridEngineHeadless;
  private posX: number;
  private posY: number;

  constructor(gridEngineHeadless) {
    this.gridEngineHeadless = gridEngineHeadless;
  }

  public move(targetPos, cb) {
    this.gridEngineHeadless.moveTo("player", targetPos);
    this.gridEngineHeadless
      .positionChangeFinished()
      .subscribe(({ enterTile }) => {
        if (enterTile.x == targetPos.x && enterTile.y == targetPos.y) {
          cb();
        }
      });
  }
}
