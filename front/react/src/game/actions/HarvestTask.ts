import { GridEngine } from "grid-engine";
import { Land } from "../farm/Land";
import { BaseTask } from "./BaseTask";
//import MoveCharAction from "./MoveCharAction";
import { Tilemaps } from "phaser";
import { TaskStatus } from "./types";
import { Humanoid } from "../characters/Humanoid";
import { LandEntity } from "../farm/types";

export class HarvestTask extends BaseTask{
    private farmLandMap: Map<string, LandEntity>;
    private landTile: Land;
    private tile: Tilemaps.Tile;

    constructor(
        gridEngine: GridEngine,
        character: Humanoid,
        tile: Tilemaps.Tile,
        farmLandMap: Map<string, LandEntity>,
        landTile: Land,
    ) {
        super(gridEngine, character);
        this.farmLandMap = farmLandMap;
        this.landTile = landTile;
        this.tile = tile;
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
        this.landTile.rollbackCrop();

        this.farmLandMap.set(this.tile.x + "-" + this.tile.y, {
            isWeeded: true,
            hasCrop: false,
        });

        //this.character.getInventory().addItem({ ...this.seed, amount: 1 });

        this.status = TaskStatus.Completed;
    };

    public next = () => {
        if (this.status === TaskStatus.Running) {
            switch (this.pointer) {
                case 1:
                    this.moveCharacter(this.tile.x, this.tile.y);
                    break;
                case 2:
                    this.harvestCrop();
                    break;
            }
        }
    };

    private harvestCrop() {
        console.log("seed");
        this.character.anims.play("attack_right", true);
        //this.character.setCharState('seed')
        setTimeout(() => {
            this.character.anims.restart();
            this.character.anims.stop();
            if (this.status === TaskStatus.Running) {
                this.landTile.plantCrop();
                this.status = TaskStatus.Completed;
            }
        }, 1000);
    }
}
