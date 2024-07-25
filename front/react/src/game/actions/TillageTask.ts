import { BaseTask } from "./BaseTask";
import { MapManager } from "../MapManager";
import { GridEngine } from "grid-engine";

import { FarmLand } from "../farm/FarmLand";
import { Hoe } from "../items/Hoe";

import { TaskStatus, Task } from "./types";
import { Humanoid } from "../characters/Humanoid";

export class TillageTask extends BaseTask implements Task {
    private mapManager: MapManager;
    private landEntity: FarmLand;
    private hoe: Hoe;

    constructor(
        mapManager: MapManager,
        gridEngine: GridEngine,
        character: Humanoid,
        landEntity: FarmLand,
        hoe: Hoe
    ) {
        super(gridEngine, character);
        this.mapManager = mapManager;
        this.hoe = hoe;
        this.landEntity = landEntity;
        console.log("task weed");
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

        this.gridEngine.stopMovement(this.character.getIdTag());
        this.landEntity.rollbackLand();

        this.mapManager.setPlotLandCoords(
            this.landEntity.getSprite().getX(),
            this.landEntity.getSprite().getY(),
            null
        );

        // this.mapManager.updatePlotLandCoords(this.landEntity.sprite.getX() + "-" + this.landEntity.sprite.getY(), { isWeeded: false, hasCrop: false });
        // this.mapManager.deletePlotLandEntityByCoords(this.landEntity.sprite.getPixelX(), this.landEntity.sprite.getPixelY());

        this.status = TaskStatus.Completed;
    };

    public next = () => {
        if (this.status === TaskStatus.Running) {
            switch (this.pointer) {
                case 1:
                    this.shouldMoveCharacter(
                        this.landEntity.getSprite().getX(),
                        this.landEntity.getSprite().getY()
                    )
                        ? this.moveCharacter(
                              this.landEntity.getSprite().getX(),
                              this.landEntity.getSprite().getY()
                          )
                        : this.next();
                    break;
                case 2:
                    this.tillGround();
                    break;
            }
        }
    };

    private tillGround() {
        console.log("weeding");
        this.character.anims.play("attack_right", true);
        //this.character.setCharState('weed')
        setTimeout(() => {
            this.character.anims.restart();
            this.character.anims.stop();
            if (this.status === TaskStatus.Running) {
                //this.mapManager.updatePlotLandCoords(this.landEntity.getX() + "-" + this.landEntity.getY(), { isWeeded: true, hasCrop: false });
                this.status = TaskStatus.Completed;
                this.landEntity.init();
            }
        }, this.hoe.weedSpeed);
    }
}
