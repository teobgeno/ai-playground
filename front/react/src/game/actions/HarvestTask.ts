import { BaseTask } from "./BaseTask";
import { MapManager } from "../MapManager";
import { GridEngine } from "grid-engine";

import {Land} from "../farm/Land";

import {TaskStatus, Task} from "./types";
import {Humanoid} from "../characters/Humanoid";

export class HarvestTask extends BaseTask implements Task{

    private mapManager: MapManager;
    private landEntity:Land;

    constructor(
        mapManager: MapManager,
        gridEngine: GridEngine,
        character: Humanoid,
        landEntity: Land,
    ) {
        super(gridEngine, character);

        this.mapManager = mapManager;
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

        this.mapManager.updatePlotLandCoords(this.landEntity.getX() + "-" + this.landEntity.getY(), { isWeeded: true, hasCrop: true });
     
        this.status = TaskStatus.Completed;
    };

    public next = () => {
        if (this.status === TaskStatus.Running) {
            switch (this.pointer) {
                case 1:
                    this.moveCharacter(this.landEntity.getX(), this.landEntity.getY());
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
                this.landEntity.harvestCrop();
                //this.character.getInventory().addItem({...this.seed, amount:1});
                this.status = TaskStatus.Completed;
            }
        }, 1000);
    }
}
