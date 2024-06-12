import {Task, TaskStatus} from "./types";
import {Humanoid} from "../characters/Humanoid";
import { Hoe } from "../tools/Hoe";
import { GridEngine } from "grid-engine";
import MoveCharAction from "./MoveCharAction";
import {Land} from "../farm/Land";

export default class WeedingTask implements Task{
    private character: Humanoid;
    private gridEngine: GridEngine;
    public posX: number;
    public posY: number;
    private status: TaskStatus;
    private pointer: number = 0;
    private landTile:Land;
    private hoe:Hoe;

    constructor(
        character: Humanoid,
        gridEngine: GridEngine,
        posX: number,
        posY: number,
        landTile: Land,
        hoe: Hoe
    ) {
        this.character = character;
        this.gridEngine = gridEngine;
        this.posX = posX;
        this.posY = posY;
        this.landTile = landTile;
        this.hoe = hoe;
        this.status = TaskStatus.Initialized;
    }

    public getStatus() {
       return this.status;
    }

    public setStatus(status: TaskStatus) {
        this.status = status;
     }

    public start() {
        this.status = this.status === TaskStatus.Initialized ? TaskStatus.Running : this.status;
        this.pointer = 1;
        this.next();
    }

    public cancel = () => {
        console.log('cancel task');
        this.status = TaskStatus.Rollback;
        this.gridEngine.stopMovement(this.character.getId());
        this.landTile.rollbackLand();
        this.status = TaskStatus.Completed;
    }

    public next = () => {
        if(this.status === TaskStatus.Running) {
            switch (this.pointer) {
                case 1:
                    this.moveCharacter();
                    break;
                case 2:
                   this.weedGround();
                    break;
            }
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
            this.character.anims.restart();
            this.character.anims.stop();
            if(this.status === TaskStatus.Running) {
                this.status = TaskStatus.Completed;
                this.landTile.init();
            }
          }, this.hoe.weedSpeed);
    }
}
