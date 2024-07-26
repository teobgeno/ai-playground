import { BaseTask } from "./BaseTask";
import { MapManager } from "../MapManager";
import { GridEngine } from "grid-engine";

import { FarmLand } from "../farm/FarmLand";
import { Hoe } from "../items/Hoe";

import { TaskStatus, Task } from "./types";
import { CharacterState } from "../characters/types";
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
        this.staminaCost = 5;
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
        //clearInterval(this.IntervalProcess);
        this.status = TaskStatus.Rollback;

        this.gridEngine.stopMovement(this.character.getIdTag());
        this.landEntity.rollbackLand();

        this.mapManager.setPlotLandCoords(
            this.landEntity.getSprite().getX(),
            this.landEntity.getSprite().getY(),
            null
        );

        this.character.setCharState(CharacterState.IDLE);

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
        this.character.anims.play("attack_right", true);
        this.character.setCharState(CharacterState.TILL);
        setTimeout(() => {
            this.character.anims.restart();
            this.character.anims.stop();
            this.character.decreaseStamina(this.staminaCost);
            this.character.setCharState(CharacterState.IDLE);
           
            if (this.status === TaskStatus.Running) {
                this.status = TaskStatus.Completed;
                this.landEntity.init();
            }
        }, this.hoe.weedSpeed);
    }
}

/*
public initTimestamp: number = 0;
public lastTimestamp: number = 0;
public IntervalProcess;

 this.lastTimestamp = Utils.getTimeStamp();
 this.initTimestamp =  this.lastTimestamp;

 ((Utils.getTimeStamp() - this.lastTimestamp)*1000) >= this.hoe.weedSpeed
    complete
  else
    this.lastTimestamp = Utils.getTimeStamp();
*/