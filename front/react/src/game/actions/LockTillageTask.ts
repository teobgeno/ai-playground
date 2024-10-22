import { BaseTask } from "./BaseTask";
import { MapManager } from "../MapManager";
import { ServiceLocator } from "../core/serviceLocator";
import { GridEngine } from "grid-engine";

import { FarmLand } from "../farm/FarmLand";

import { TaskStatus, Task } from "./types";
import { Character } from "../characters/types";

export class LockTillageTask extends BaseTask implements Task {
    private scene: Phaser.Scene;
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
        
        if (this.status === TaskStatus.Initialized) {
            this.setStatus(TaskStatus.Running);
        }

        this.pointer = 1;
        this.next();
    }

    public cancel = () => {

        const mapManager = ServiceLocator.getInstance<MapManager>('mapManager')!;
        this.status = TaskStatus.Rollback;

        const farmLand = mapManager.getPlotLandCoord(this.posX, this.posY);
        (farmLand as FarmLand).rollbackLand();

        mapManager.setPlotLandCoords(
            (farmLand as FarmLand).getSprite().getX(),
            (farmLand as FarmLand).getSprite().getY(),
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

        if(
            mapManager.canTillageToTile(this.posX, this.posY) &&
            !this.gridEngine.isBlocked({ x: this.posX, y: this.posY },"CharLayer")
        ) {
           const landEntity = new FarmLand(
                this.scene,
                {x: this.posX, y: this.posY, pixelX: mapManager.tileToWorldX(this.posX) || 0, pixelY: mapManager.tileToWorldY(this.posY) || 0}
            );
            
            mapManager.setPlotLandCoords( this.posX, this.posY, landEntity);
            this.setStatus(TaskStatus.Completed);
            
            this.pointer = 2;
            this.next();
        } else {
            this.setStatus(TaskStatus.Error);
            this.notifyOrder({characterIdTag: this.character.getIdTag()});
            console.warn('error cannot lock farm land for create.');
        }
        
       
    }

    public complete() {
        this.notifyOrder({characterIdTag: this.character.getIdTag()});
    }

}