import { GridEngine } from "grid-engine";
import Character from "../Character";

export default class WeedingTask {
    private character: Character;
    private gridEngine: GridEngine;
    private posX:number;
    private posY:number;
    private pointer: number = 0;

    constructor(
        character: Character,
        gridEngine: GridEngine
    ) {
        this.character = character;
        this.gridEngine = gridEngine;
    }
    public execute() {
        this.pointer = 1;
        this.next();
    }
    public next = () => {
        switch (this.pointer) {
            case 1:
              this.moveCharacter();
              break;
            case 2:
              this.moveCharacter();
              break;
          }
    }

    private moveCharacter() {
        this.pointer = 2;
        this.next();
    }
}
