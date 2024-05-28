import { GridEngine } from "grid-engine";
import Character from "../Character";

export default class MoveCharAction {
    private character: Character;
    private gridEngine: GridEngine;
    private posX: number;
    private posY: number;

    constructor(
        character: Character,
        gridEngine: GridEngine,
        posX: number,
        posY: number
    ) {
        this.character = character;
        this.gridEngine = gridEngine;
        this.posX = posX;
        this.posY = posY;
    }
    public execute() {
        console.log(this.gridEngine.isBlocked({
            x: this.posX,
            y: this.posY,
        },'CharLayer'))
        this.character.setCharState('walk')
        this.gridEngine.moveTo(this.character.getId(), {
            x: this.posX,
            y: this.posY,
        });
    }
}
