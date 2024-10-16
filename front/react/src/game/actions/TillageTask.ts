import { BaseTask } from "./BaseTask";
import { MapManager } from "../MapManager";
import { GridEngine } from "grid-engine";
import { Utils } from "../core/Utils";

import { FarmLand } from "../farm/FarmLand";
import { Hoe } from "../items/Hoe";

import { TaskStatus, Task } from "./types";
import { CharacterState, Character } from "../characters/types";

export class TillageTask extends BaseTask implements Task {
    private scene: Phaser.Scene;
    private mapManager: MapManager;
    private landEntity: FarmLand;
    private hoe: Hoe;
    private posX: number;
    private posY: number;

    constructor(
        gridEngine: GridEngine,
        character: Character,
        scene: Phaser.Scene,
        mapManager: MapManager,
        hoe: Hoe,
        posX: number,
        posY: number
    ) {
        super(gridEngine, character);
        this.scene = scene;
        this.mapManager = mapManager;
        this.hoe = hoe;
        this.posX = posX;
        this.posY = posY;
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
                    this.initPlotLand();
                    this.pointer = 2;
                    this.next();
                    break;
                case 2:
                    this.tillGround();
                    break;
            }
        }
    };

    private initPlotLand() {
     
        const tileGround = this.mapManager.getMap().getTileAt(this.posX, this.posY, false, "Ground");

        if(tileGround) {
            this.landEntity = new FarmLand(
                this.scene,
                {x: this.posX, y: this.posY, pixelX: this.mapManager.getMap().tileToWorldX(this.posX) || 0, pixelY: this.mapManager.getMap().tileToWorldY(this.posY) || 0}
            );
            
            this.mapManager.setPlotLandCoords( this.posX, this.posY, this.landEntity);
        }
    }

    private tillGround() {
        this.lastTimestamp = Utils.getTimeStamp();
        this.initTimestamp =  this.lastTimestamp;
        this.IntervalProcess = setInterval(this.tillGroundProc, 1000)

        //sdsathis.character.anims.play("attack_right", true);
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

    public complete() {

       this.updateCharacter();

        if (this.status === TaskStatus.Running) {
            this.status = TaskStatus.Completed;
            this.landEntity.init();
        }
    }

    private updateCharacter() {
        //this.character.anims.restart();
        //this.character.anims.stop();
        this.character.decreaseStamina(this.staminaCost);
        this.character.setCharState(CharacterState.IDLE);
    }
}