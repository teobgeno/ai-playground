import { BaseTask } from "./BaseTask";
import { MapManager } from "../MapManager";
import { GridEngine } from "grid-engine";

import {Land} from "../farm/Land";
import { Hoe } from "../items/Hoe";

import {TaskStatus, Task} from "./types";
import {Humanoid} from "../characters/Humanoid";

export class TillageTask extends BaseTask implements Task{

    private mapManager: MapManager;
    private landEntity:Land;
    private hoe:Hoe;

    constructor(
        mapManager: MapManager,
        gridEngine: GridEngine,
        character: Humanoid,
        landEntity: Land,
        hoe: Hoe
    ) {
        super(gridEngine, character);
        this.mapManager = mapManager;
        this.hoe = hoe;
        this.landEntity = landEntity;
        this.mapManager.addPlotLandEntity(this.landEntity);
        console.log('task weed')
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
        this.landEntity.rollbackLand();

        this.mapManager.updatePlotLandCoords(this.landEntity.getX() + "-" + this.landEntity.getY(), { isWeeded: false, hasCrop: false });
        this.mapManager.deletePlotLandEntityByCoords(this.landEntity.getPixelX(), this.landEntity.getPixelY());

        this.status = TaskStatus.Completed;
    }

    public next = () => {
        if(this.status === TaskStatus.Running) {
            switch (this.pointer) {
                case 1:
                    this.moveCharacter(this.landEntity.getX(), this.landEntity.getY());
                    break;
                case 2:
                   this.weedGround();
                    break;
            }
        }
    };

    private weedGround() {
        console.log('weeding');
        this.character.anims.play('attack_right', true);
        //this.character.setCharState('weed')
        setTimeout(() => {
            this.character.anims.restart();
            this.character.anims.stop();
            if(this.status === TaskStatus.Running) {
                this.mapManager.updatePlotLandCoords(this.landEntity.getX() + "-" + this.landEntity.getY(), { isWeeded: true, hasCrop: false });
                this.status = TaskStatus.Completed;
                this.landEntity.init();
            }
          }, this.hoe.weedSpeed);
    }
}
