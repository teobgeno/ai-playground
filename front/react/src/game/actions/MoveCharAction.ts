import { GridEngine } from "grid-engine";
import Character from "../Character";

export default class MoveCharAction {
    private character: Character;
    private gridEngine: GridEngine;
    private posX:number;
    private posY:number

    constructor(
        character: Character,
        gridEngine: GridEngine
    ) {
        this.character = character;
        this.gridEngine = gridEngine;
    }
    public execute() {
        this.gridEngine.moveTo(this.character.getId(), {
            x: this.posX,
            y: this.posY,
        });
    }
}
