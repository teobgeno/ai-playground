import { BaseTask } from "./BaseTask";
import { GridEngine } from "grid-engine";
import { ServiceLocator } from "../core/serviceLocator";
import { MapManager } from "../MapManager";

import { TaskStatus, Task } from "./types";
import { Storable } from "../items/types.ts";
import { CharacterState, Character } from "../characters/types";

export class InteractWithItemTask extends BaseTask implements Task {
    private interactionProc: (task: InteractWithItemTask) => void;
    private item: Storable;
    private posX: number;
    private posY: number;

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

    public setInteractionProc(
        func: (task: InteractWithItemTask) => void
    ) {
        this.interactionProc = func;
    }

    public start() {

        if (this.status === TaskStatus.Initialized) {
            this.setStatus(TaskStatus.Running);
        }

        this.pointer = 1;
        this.next();
    }

    public cancel = () => {

        this.setStatus(TaskStatus.Rollback);
        this.gridEngine.stopMovement(this.character.getIdTag());
        this.setStatus(TaskStatus.Completed);
    };

    public next() {

        if (this.status === TaskStatus.Running) {
            switch (this.pointer) {
                case 1:
                    // if(this.canMoveCharacter()) {
                    //     this.pointer = 2;
                    //     this.next();
                    // } else {
                    //     this.setStatus(TaskStatus.Error);
                    //     console.warn('error cannot move');
                    // }
                    this.interact();
                    break;
                case 2:
                    // if(this.shouldMoveCharacter()) {
                    //     this.moveCharacter()
                    // } else {
                    //     this.pointer = 3;
                    //     this.next();
                    // }
                    break;
                case 3:
                    this.complete();
                    break;
            }
        }
    }

    public complete = () => {
        this.character.setCharState(CharacterState.IDLE);
        if (this.status === TaskStatus.Running) {
            this.setStatus(TaskStatus.Completed);
            this.notifyOrder({characterIdTag: this.character.getIdTag()});
        }
    };

    public interact() {
        const mapManager = ServiceLocator.getInstance<MapManager>('mapManager')!;
        const mapItem = mapManager.getPlotLandCoord(this.posX, this.posY);
        if(mapItem && mapItem.getInteractive) {
            //TODO:: select proper item from character inventory
            mapItem.getInteractive().setIntercativeObject(this.item);
            if(mapItem.getInteractive().canInteractWithItem()) {
                
                /*
                mapItem.getInteractive().interactWithItem();
                this.pointer = 3;
                this.next();
                console.log('ok');
                */


            } else {
                this.setStatus(TaskStatus.Error);
                console.warn('cannot interact with map item with current tool');
            }
        } else{
            this.setStatus(TaskStatus.Error);
            console.warn('cannot find mapitem');
        }
    }
}
