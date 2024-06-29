import { BaseTask } from "./BaseTask";
import { MapManager } from "../MapManager";
import { GridEngine } from "grid-engine";

import { FarmLand } from "../farm/FarmLand";
import { Seed } from "../farm/Seed";

import {TaskStatus, Task} from "./types";
import {Humanoid} from "../characters/Humanoid";

export class SeedTask extends BaseTask implements Task{

    private mapManager: MapManager;
    private landEntity:FarmLand;
    private seed: Seed;

    constructor(
        mapManager: MapManager,
        gridEngine: GridEngine,
        character: Humanoid,
        landEntity: FarmLand,
        seed: Seed
    ) {
        super(gridEngine, character);

        this.mapManager = mapManager;
        this.seed = seed;
        this.landEntity = landEntity;

        this.status = TaskStatus.Initialized;
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
        this.landEntity.rollbackCrop();

        //this.mapManager.updatePlotLandCoords(this.landEntity.getX() + "-" + this.landEntity.getY(), { isWeeded: true, hasCrop: false });
        
        this.character.getInventory().addItem(this.seed);

        this.status = TaskStatus.Completed;
    };

    public next = () => {
        if (this.status === TaskStatus.Running) {
            switch (this.pointer) {
                case 1:
                    this.moveCharacter(this.landEntity.getSprite().getX(), this.landEntity.getSprite().getY());
                    break;
                case 2:
                    this.plantSeed();
                    break;
            }
        }
    };


    private plantSeed() {
        console.log("seed");
        this.character.anims.play("attack_right", true);
        //this.character.setCharState('seed')
        setTimeout(() => {
            this.character.anims.restart();
            this.character.anims.stop();
            if (this.status === TaskStatus.Running) {
                this.landEntity.plantCrop();
                this.status = TaskStatus.Completed;
            }
        }, 1000);
    }
}
