import { BaseTask } from "./BaseTask";
import { GridEngine } from "grid-engine";
import { ServiceLocator } from "../core/serviceLocator";
import { MapManager } from "../MapManager";

import { Utils } from "../core/Utils";

import { FarmLand } from "../farm/FarmLand";
import { Hoe } from "../items/Hoe";

import { TaskStatus, Task } from "./types";
import { CharacterState, Character } from "../characters/types";
import { ObjectId } from "../core/types";

export class TillageTask extends BaseTask implements Task {
    private landEntity: FarmLand;
    private hoe: Hoe;
    private posX: number;
    private posY: number;

    constructor(
        gridEngine: GridEngine,
        character: Character,
        hoe: Hoe,
        posX: number,
        posY: number
    ) {
        super(gridEngine, character);
        this.hoe = hoe;
        this.posX = posX;
        this.posY = posY;
    }

    public start() {
        
        if (this.status === TaskStatus.Initialized) {
            this.setStatus(TaskStatus.Running);
        }

        this.pointer = 1;
        this.next();
    }

    public cancel = () => {
        const mapManager = ServiceLocator.getInstance<MapManager>('mapManager')!;
        clearInterval(this.IntervalProcess);
        this.setStatus(TaskStatus.Rollback);
 

        this.gridEngine.stopMovement(this.character.getIdTag());
        const farmLand = mapManager.getPlotLandCoord(this.posX, this.posY);
        (farmLand as FarmLand).rollbackLand();
        //this.landEntity.rollbackLand();

        mapManager.setPlotLandCoords(
            (farmLand as FarmLand).getSprite().getX(),
            (farmLand as FarmLand).getSprite().getY(),
            null
        );

        this.updateCharacter();

        this.setStatus(TaskStatus.Completed);
    };

    public next = () => {
        if (this.status === TaskStatus.Running) {
            switch (this.pointer) {
                case 1:
                    this.initPlotLand();
                    this.pointer = 2;
                    this.next();
                    break;
                case 2:
                    this.tillGround();
                    break;
                case 3:
                    this.complete();
                    break;
            }
        }
    };

    public complete() {

        this.updateCharacter();
 
         if (this.status === TaskStatus.Running) {
             this.setStatus(TaskStatus.Completed);
             this.landEntity.init();
             this.notifyOrder({characterIdTag: this.character.getIdTag()});
         }
     }

    private initPlotLand() {
     
        const mapManager = ServiceLocator.getInstance<MapManager>('mapManager')!;
        const farmLand = mapManager.getPlotLandCoord(this.posX, this.posY);

        if(farmLand?.objectId === ObjectId.FarmLand) {
            this.landEntity = farmLand as FarmLand
        } else {
            console.log('error tillage')
        }
        //TODO:: trigger error and cancel if not farmland 
    }

    private tillGround() {
        this.lastTimestamp = Utils.getTimeStamp();
        this.initTimestamp =  this.lastTimestamp;
        this.IntervalProcess = setInterval(this.tillGroundProc, 1000)

        //this.character.anims.play("attack_right", true);
        this.character.setCharState(CharacterState.TILL);
    }

    private tillGroundProc = () => {
        if(((Utils.getTimeStamp() - this.lastTimestamp)*1000) >= this.hoe.weedSpeed) {
            this.staminaCost = this.staminaCost + 5;
            clearInterval(this.IntervalProcess);
            this.pointer = 3;
            this.next();
        } else {
            this.staminaCost = this.staminaCost + 5;
        }
    }

    private updateCharacter() {
        //this.character.anims.restart();
        //this.character.anims.stop();
        this.character.decreaseStamina(this.staminaCost);
        this.character.setCharState(CharacterState.IDLE);
    }


}