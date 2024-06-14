import { GridEngine } from "grid-engine";
import { Hoe } from "../tools/Hoe";
import {Land} from "../farm/Land";
//import MoveCharAction from "./MoveCharAction";
import { Tilemaps } from "phaser";
import {Task, TaskStatus} from "./types";
import {Humanoid} from "../characters/Humanoid";
import {LandEntity} from "../farm/types";

export class WeedingTask implements Task{
    private gridEngine: GridEngine;
    private character: Humanoid;
    public pointerX: number;
    public pointerY: number;
    private tile:Tilemaps.Tile;
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
        tile:Tilemaps.Tile,
        landsMap: Array<Land>,
        farmLandMap: Map<string, LandEntity>,
        landTile: Land,
        hoe: Hoe
    ) {
        this.character = character;
        this.gridEngine = gridEngine;
        this.pointerX = pointerX;
        this.pointerY = pointerY;
        this.tile = tile;
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

    public getTile() {
        return this.tile;
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
        const landIndex = this.landsMap.findIndex(x=> x.getPosX() === this.tile.pixelX && x.getPosY() === this.tile.pixelY);
        this.landsMap.splice(landIndex, 1)
        // console.log(landIndex + '---' + this.tile.pixelX + '---' + this.tile.pixelY)
        // console.log(this.landsMap)
        this.status = TaskStatus.Completed;
    }

    public next = () => {
        if(this.status === TaskStatus.Running) {
            switch (this.pointer) {
                case 1:
                    this.initTask();
                    break;
                case 2:
                    this.moveCharacter();
                    break;
                case 3:
                   this.weedGround();
                    break;
            }
        }
    };

    private initTask(){
        this.farmLandMap.set(this.pointerX + "-" + this.pointerY, { isWeeded: true, hasCrop: false });
        this.pointer = 2;
        this.next();
    }

    private moveCharacter() {
        this.pointer = 3;
        this.character.setCharState('walk')
        this.gridEngine.moveTo(this.character.getId(), {
            x: this.tile.x,
            y: this.tile.y,
        });
        // const m = new MoveCharAction(
        //     this.character,
        //     this.gridEngine,
        //     this.tile.x,
        //     this.tile.y
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
