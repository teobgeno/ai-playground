import { BaseTask } from "./BaseTask";
import { MapManager } from "../MapManager";
import { ServiceLocator } from "../core/serviceLocator";
import { GridEngine } from "grid-engine";

import { FarmLand } from "../farm/FarmLand";

import { TaskStatus, Task } from "./types";
import { Character } from "../characters/types";

export class LockTillageTask extends BaseTask implements Task {
    private scene: Phaser.Scene;
    private landEntity: FarmLand;
    private posX: number;
    private posY: number;

    constructor(
        gridEngine: GridEngine,
        character: Character,
        scene: Phaser.Scene,
        posX: number,
        posY: number
    ) {
        super(gridEngine, character);
        this.scene = scene;
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

        const mapManager = ServiceLocator.getInstance<MapManager>('mapManager')!;
        this.status = TaskStatus.Rollback;

        this.landEntity.rollbackLand();

        mapManager.setPlotLandCoords(
            this.landEntity.getSprite().getX(),
            this.landEntity.getSprite().getY(),
            null
        );

        this.status = TaskStatus.Completed;
    };

    public next = () => {
        if (this.status === TaskStatus.Running) {
            switch (this.pointer) {
                case 1:
                    this.initPlotLand();
                    break;
                case 2:
                    this.complete();
                    break;

            }
        }
    };

    private initPlotLand() {
     
        const mapManager = ServiceLocator.getInstance<MapManager>('mapManager')!;
        const tileGround = mapManager.getTileAt(this.posX, this.posY, false, "Ground");

        if(tileGround) {
            this.landEntity = new FarmLand(
                this.scene,
                {x: this.posX, y: this.posY, pixelX: mapManager.tileToWorldX(this.posX) || 0, pixelY: mapManager.tileToWorldY(this.posY) || 0}
            );
            
            mapManager.setPlotLandCoords( this.posX, this.posY, this.landEntity);
            this.setStatus(TaskStatus.Completed);
        }
        
        this.pointer = 2;
        this.next();
    }

    public complete() {
       
    }

}