import { BaseTask } from "./BaseTask";
import { MapManager } from "../MapManager";
import { GridEngine } from "grid-engine";
import { Utils } from "../core/Utils";

import { FarmLand } from "../farm/FarmLand";
import { Hoe } from "../items/Hoe";

import { TaskStatus, Task } from "./types";
import { CharacterState, Character } from "../characters/types";

export class TillageTask extends BaseTask implements Task {
    private mapManager: MapManager;
    private landEntity: FarmLand;
    private hoe: Hoe;

    constructor(
        mapManager: MapManager,
        gridEngine: GridEngine,
        character: Character,
        landEntity: FarmLand,
        hoe: Hoe
    ) {
        super(gridEngine, character);
        this.mapManager = mapManager;
        this.hoe = hoe;
        this.landEntity = landEntity;
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
        clearInterval(this.IntervalProcess);
        this.status = TaskStatus.Rollback;

        this.gridEngine.stopMovement(this.character.getIdTag());
        this.landEntity.rollbackLand();

        this.mapManager.setPlotLandCoords(
            this.landEntity.getSprite().getX(),
            this.landEntity.getSprite().getY(),
            null
        );

        this.updateCharacter();

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
        this.lastTimestamp = Utils.getTimeStamp();
        this.initTimestamp =  this.lastTimestamp;
        this.IntervalProcess = setInterval(this.tillGroundProc, 1000)

        this.character.anims.play("attack_right", true);
        this.character.setCharState(CharacterState.TILL);
    }

    private tillGroundProc = () => {
        if(((Utils.getTimeStamp() - this.lastTimestamp)*1000) >= this.hoe.weedSpeed) {
            this.staminaCost = this.staminaCost + 5;
            clearInterval(this.IntervalProcess);
            this.complete();
        } else {
            this.staminaCost = this.staminaCost + 5;
        }
    }

    private complete() {

       this.updateCharacter();

        if (this.status === TaskStatus.Running) {
            this.status = TaskStatus.Completed;
            this.landEntity.init();
        }
    }

    private updateCharacter() {
        this.character.anims.restart();
        this.character.anims.stop();
        this.character.decreaseStamina(this.staminaCost);
        this.character.setCharState(CharacterState.IDLE);
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