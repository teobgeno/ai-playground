import { BaseTask } from "./BaseTask.ts";
import { GridEngine } from "grid-engine";
import { ServiceLocator } from "../core/serviceLocator.ts";
import { MapManager } from "../MapManager.ts";

import { MapObject } from "../core/types.ts";
import { TaskStatus, Task } from "./types.ts";
import { Storable } from "../items/types.ts";
import { CharacterState, Character } from "../characters/types.ts";

export class BaseInteractWithItemTask extends BaseTask implements Task {
    private item: Storable;
    private posX: number;
    private posY: number;
    private intervalStep: number = 0;
    private intervalTick: number = 0;
    private mapItem: MapObject;

    constructor(
        gridEngine: GridEngine,
        character: Character,
        item: Storable,
        posX: number,
        posY: number
    ) {
        super(gridEngine, character);
        this.item = item;
        this.posX = posX;
        this.posY = posY;
        
        this.status = TaskStatus.Initialized;
    }

    public setPosX(posX: number) {
        this.posX = posX;
    }

    public getPosX() {
        return this.posX;
    }

    public setPosY(posY: number) {
        this.posY = posY;
    }

    public getPosY() {
        return this.posY;
    }

    public getIntervalStep() {
        return this.intervalStep;
    }

    public setIntervalStep(intervalStep: number) {
        this.intervalStep = intervalStep;
    }

    public getIntervalTick() {
        return this.intervalTick;
    }

    public setIntervalTick(intervalTick: number) {
        return this.intervalTick = intervalTick;
    }

    public getItem() {
        return this.item;
    }
   
    protected getAvailableMapItem() {
        const mapManager = ServiceLocator.getInstance<MapManager>('mapManager')!;
        const mapItem = mapManager.getPlotLandCoord(this.posX, this.posY);

        if(!mapItem) {
            return null;
        }

        if(!mapItem.getInteractive) {
            return null;
        }
        
        mapItem.getInteractive().setIntercativeObject(this.getItem());

        if(!mapItem.getInteractive().canInteractWithItem()) {
            return null;
        }

        return mapItem;
    }

    public start() {

        if (this.status === TaskStatus.Initialized) {
            super.start(this);
            this.modifyPropertiesFromShared();
            this.setStatus(TaskStatus.Running);
        }

        this.pointer = 1;
        this.next();
    }

    public cancel () {
        this.clearForExit();
        // this.setStatus(TaskStatus.Rollback);
        // this.gridEngine.stopMovement(this.character.getIdTag());
        // this.setStatus(TaskStatus.Completed);
    }

    public next() {

    }

    public complete () {
        this.clearForExit();
        this.character.setCharState(CharacterState.IDLE);
        if (this.status === TaskStatus.Running) {
            this.setStatus(TaskStatus.Completed);
            this.notifyOrder({characterIdTag: this.character.getIdTag()});
        }
    }
}
