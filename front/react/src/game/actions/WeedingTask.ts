import {Task, TaskStatus} from "./types";
import { GridEngine } from "grid-engine";
import {Humanoid} from "../characters/Humanoid";
import MoveCharAction from "./MoveCharAction";
import {Land} from "../farm/Land";

export default class WeedingTask implements Task{
    private character: Humanoid;
    private gridEngine: GridEngine;
    public posX: number;
    public posY: number;
    public status: TaskStatus;
    private pointer: number = 0;
    private landTile:Land;

    constructor(
        character: Humanoid,
        gridEngine: GridEngine,
        posX: number,
        posY: number,
        landTile: Land
    ) {
        this.character = character;
        this.gridEngine = gridEngine;
        this.posX = posX;
        this.posY = posY;
        this.landTile = landTile;
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
        this.character.setCharState('weed')
        setTimeout(() => {
            this.status = TaskStatus.Completed;
            this.character.anims.restart();
            this.character.anims.stop();
            this.landTile.init();
            this.character.setCharState('idle')
          }, 1000);
    }
}
