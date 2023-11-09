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
      for (let c = 0; c < this.tilemap.getWidth(); c++) {
        const pos = { x: c, y: r };
        if (this.gridEngine.getCharactersAt(pos).length > 0) {
          // tile is occupied by a character
          strArr.push("c");
        } else if (this.gridEngine.isTileBlocked(pos)) {
          // tile is blocked
          strArr.push("#");
        } else {
          // tile is free
          strArr.push(".");
        }
      }
      strArr.push("\n");
    }

    this.renderStr(strArr.join(""));
  }

  /** Renders a string into the provided container element. */
  private renderStr(str: string): void {
    const container = document?.getElementById(this.containerId);
    if (!container) {
      console.error(`Container ${this.containerId} could not be found.`);
      return;
    }
    container.innerHTML = `<pre>${str}</pre>`;
  }
}
