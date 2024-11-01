import { BaseTask } from "./BaseTask.ts";
import { GridEngine } from "grid-engine";
import { ServiceLocator } from "../core/serviceLocator.ts";
import { MapManager } from "../MapManager.ts";

import { MapObject, ObjectId } from "../core/types.ts";
import { TaskStatus, Task } from "./types.ts";
import { Storable } from "../items/types.ts";
import { CharacterState, Character } from "../characters/types.ts";

export class SeekFindTask extends BaseTask implements Task {
    private itemToFind: ObjectId;
    private areaToScan: Array<Array<number>> = [[5, 1], [5, 2], [5, 3]];
    private posX: number;
    private posY: number;
    private intervalStep: number = 0;
    private intervalTick: number = 0;
    private mapItem: MapObject;
    

    constructor(
        gridEngine: GridEngine,
        character: Character,
        itemToFind: ObjectId,
        posX: number,
        posY: number
    ) {
        super(gridEngine, character);
        this.itemToFind = itemToFind;
        this.posX = posX;
        this.posY = posY;
        
        this.status = TaskStatus.Initialized;
    }

 
    public setCoord (coord, value) {
        //obj["c" + coord[0] + coord[1]] = { coord: coord, value: value};
    }
    
    public getCoord (coord) {
        //return obj["c" + coord[0] + coord[1]];
    }

    public start() {

        if (this.status === TaskStatus.Initialized) {
            this.setStatus(TaskStatus.Running);
        }

        this.pointer = 1;
        this.next();
    }

    public cancel () {

        // this.setStatus(TaskStatus.Rollback);
        // this.gridEngine.stopMovement(this.character.getIdTag());
        // this.setStatus(TaskStatus.Completed);
    }

    public next() {

    }

    public complete () {
        this.character.setCharState(CharacterState.IDLE);
        if (this.status === TaskStatus.Running) {
            this.setStatus(TaskStatus.Completed);
            this.notifyOrder({characterIdTag: this.character.getIdTag()});
        }
    }
}
