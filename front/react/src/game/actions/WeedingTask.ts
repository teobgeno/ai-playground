import { GridEngine } from "grid-engine";
import Character from "../Character";
import MoveCharAction from "./MoveCharAction";
import {Task} from "./types";

export default class WeedingTask implements Task{
    private character: Character;
    private gridEngine: GridEngine;
    public posX: number;
    public posY: number;
    private pointer: number = 0;

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
    public start() {
        this.pointer = 1;
        this.next();
    }
    public next = () => {
        switch (this.pointer) {
            case 1:
                this.moveCharacter();
                break;
            case 2:
                console.log('next step')
                break;
        }
    };

    private moveCharacter() {
        this.pointer = 2;
        const m = new MoveCharAction(
            this.character,
            this.gridEngine,
            this.posX,
            this.posY
        );
        m.execute();
        //this.next();
    }
}
