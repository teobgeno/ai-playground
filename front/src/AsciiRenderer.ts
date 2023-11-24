import { GridEngineHeadless, Tilemap } from "grid-engine";

/**
 * A renderer that displays an ASCII representation of the current Grid Engine
 * state into a provided container element.
 */
export class AsciiRenderer {
  constructor(
    private containerId: string,
    private gridEngine: GridEngineHeadless,
    private tilemap: Tilemap
  ) {}

  /** Render the current state of Grid Engine. */
  render(): void {
    const strArr: string[] = [];
    // Iterate through all tiles of the map.
    for (let r = 0; r < this.tilemap.getHeight(); r++) {
      strArr.push('<div style="display:flex">');
      for (let c = 0; c < this.tilemap.getWidth(); c++) {
        const pos = { x: c, y: r };
        if (this.gridEngine.getCharactersAt(pos).length > 0) {
          // tile is occupied by a character
          strArr.push('<div class="tile">⛄</div>');
        }  else if((this.tilemap as any).map.forestLayer.data[pos.y][pos.x] === 2) {
          strArr.push('<div class="tile">🌳</div>');
        } else {
          strArr.push('<div class="tile"></div>');
        }

      }
      strArr.push('</div>');
    }

    //else if (this.gridEngine.isTileBlocked(pos))

    this.renderStr(strArr.join(""));
  }

  /** Renders a string into the provided container element. */
  private renderStr(str: string): void {
    const container = document?.getElementById(this.containerId);
    if (!container) {
      console.error(`Container ${this.containerId} could not be found.`);
      return;
    }
    container.innerHTML = `<div class="map-cont">${str}</div>`;
  }
}
