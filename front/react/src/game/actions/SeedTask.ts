import { GridEngine } from "grid-engine";
import { Land } from "../farm/Land";
//import MoveCharAction from "./MoveCharAction";
import { Tilemaps } from "phaser";
import { Task, TaskStatus } from "./types";
import { Humanoid } from "../characters/Humanoid";
import { LandEntity } from "../farm/types";

import { Seed } from "../farm/Seed";

export class SeedTask implements Task {
    private gridEngine: GridEngine;
    private character: Humanoid;
    public pointerX: number;
    public pointerY: number;
    public tile: Tilemaps.Tile;
    private status: TaskStatus;
    private pointer: number = 0;
    private landsMap: Array<Land> = [];
    private farmLandMap: Map<string, LandEntity>;
    private landTile: Land;
    private seed: Seed;

    constructor(
        gridEngine: GridEngine,
        character: Humanoid,
        pointerX: number,
        pointerY: number,
        tile: Tilemaps.Tile,
        landsMap: Array<Land>,
        farmLandMap: Map<string, LandEntity>,
        landTile: Land,
        seed: Seed
    ) {
        this.character = character;
        this.gridEngine = gridEngine;
        this.pointerX = pointerX;
        this.pointerY = pointerY;
        this.tile = tile;
        this.landsMap = landsMap;
        this.farmLandMap = farmLandMap;
        this.landTile = landTile;
        this.seed = seed;
        this.status = TaskStatus.Initialized;
        this.landTile.createCrop({...this.seed} as Seed);
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
        this.status =
            this.status === TaskStatus.Initialized
                ? TaskStatus.Running
                : this.status;
        this.pointer = 1;
        this.next();
    }

    public cancel = () => {
        console.log("cancel task");
        this.status = TaskStatus.Rollback;

        this.gridEngine.stopMovement(this.character.getId());
        //this.landTile.rollbackLand();

        this.farmLandMap.set(this.pointerX + "-" + this.pointerY, {
            isWeeded: true,
            hasCrop: false,
        });
        //this.landsMap = this.landsMap.filter(x=> x.getPosX() !== this.tile.pixelX && x.getPosY() !== this.tile.pixelY);

        this.status = TaskStatus.Completed;
    };

    public next = () => {
        if (this.status === TaskStatus.Running) {
            switch (this.pointer) {
                case 1:
                    this.moveCharacter();
                    break;
                case 2:
                    this.plantSeed();
                    break;
            }
        }
    };

    private moveCharacter() {
        this.pointer = 2;
        this.character.setCharState("walk");
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

    private plantSeed() {
        console.log("seed");
        this.character.anims.play("attack_right", true);
        //this.character.setCharState('seed')
        setTimeout(() => {
            this.character.anims.restart();
            this.character.anims.stop();
            if (this.status === TaskStatus.Running) {
                this.landTile.plantCrop();
                this.farmLandMap.set(this.pointerX + "-" + this.pointerY, {
                    isWeeded: true,
                    hasCrop: true,
                });
                this.status = TaskStatus.Completed;
            }
        }, 1000);
    }
}
