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
               this.weedGround();
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

    private weedGround() {
        console.log('weeding');
        this.character.anims.play('attack_right', true);
        //this.character.setCharState('weed')
        setTimeout(() => {
            this.status = TaskStatus.Completed;
            this.character.anims.restart();
            this.character.anims.stop();
            //this.character.setCharState('idle')
          }, 1000);
    }
}
