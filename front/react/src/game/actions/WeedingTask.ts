import { GridEngine } from "grid-engine";
import Character from "../Character";
import MoveCharAction from "./MoveCharAction";
import {Task, TaskStatus} from "./types";

export default class WeedingTask implements Task{
    private character: Character;
    private gridEngine: GridEngine;
    public posX: number;
    public posY: number;
    public status: TaskStatus;
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
    public getStatus() {
       return this.status;
    }
    public start() {
        this.status = TaskStatus.Running;
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
                this.status = TaskStatus.Completed;
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
