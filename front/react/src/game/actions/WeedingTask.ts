import { GridEngine } from "grid-engine";
import { Hoe } from "../tools/Hoe";
import {Land} from "../farm/Land";
//import MoveCharAction from "./MoveCharAction";

import {Task, TaskStatus} from "./types";
import {Humanoid} from "../characters/Humanoid";
import {LandEntity} from "../farm/types";

export default class WeedingTask implements Task{
    private gridEngine: GridEngine;
    private character: Humanoid;
    public pointerX: number;
    public pointerY: number;
    public tileX: number;
    public tileY: number;
    private status: TaskStatus;
    private pointer: number = 0;
    private landsMap: Array<Land> = [];
    private farmLandMap: Map<string, LandEntity>;
    private landTile:Land;
    private hoe:Hoe;

    constructor(
        gridEngine: GridEngine,
        character: Humanoid,
        pointerX: number,
        pointerY: number,
        tileX: number,
        tileY: number,
        landsMap: Array<Land>,
        farmLandMap: Map<string, LandEntity>,
        landTile: Land,
        hoe: Hoe
    ) {
        this.character = character;
        this.gridEngine = gridEngine;
        this.pointerX = pointerX;
        this.pointerY = pointerY;
        this.tileX = tileX;
        this.tileY = tileY;
        this.landsMap = landsMap;
        this.farmLandMap = farmLandMap;
        this.landTile = landTile;
        this.hoe = hoe;
        this.status = TaskStatus.Initialized;
        this.landsMap.push(this.landTile);
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

        this.farmLandMap.set(this.pointerX + "-" + this.pointerY, { isWeeded: false, hasCrop: false });
        this.landsMap = this.landsMap.filter(x=> x.getPosX() !== this.tileX && x.getPosY() !== this.tileY);
        // const landIndex = this.landsMap.findIndex(x=> x.getPosX() === this.tileX && x.getPosY() === this.tileY);
        // delete this.landsMap[landIndex];

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
        this.character.setCharState('walk')
        this.gridEngine.moveTo(this.character.getId(), {
            x: this.tileX,
            y: this.tileY,
        });
        // const m = new MoveCharAction(
        //     this.character,
        //     this.gridEngine,
        //     this.tileX,
        //     this.tileY
        // );
        // m.execute();
    }

    private weedGround() {
        console.log('weeding');
        this.character.anims.play('attack_right', true);
        //this.character.setCharState('weed')
        setTimeout(() => {
            this.character.anims.restart();
            this.character.anims.stop();
            if(this.status === TaskStatus.Running) {
                this.farmLandMap.set(this.pointerX + "-" + this.pointerY, { isWeeded: true, hasCrop: false });
                this.status = TaskStatus.Completed;
                this.landTile.init();
            }
          }, this.hoe.weedSpeed);
    }
}
