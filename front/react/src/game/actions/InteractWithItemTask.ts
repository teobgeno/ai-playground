import { BaseTask } from "./BaseTask";
import { GridEngine } from "grid-engine";

import { TaskStatus, Task } from "./types";
import { Storable } from "../items/types.ts";
import { CharacterState, Character } from "../characters/types";


export class InteractWithItemTask extends BaseTask implements Task {
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
                    if(this.canMoveCharacter()) {
                        this.pointer = 2;
                        this.next();
                    } else {
                        this.setStatus(TaskStatus.Error);
                        console.warn('error cannot move');
                    }
                    break;
                case 2:
                    if(this.shouldMoveCharacter()) {
                        this.moveCharacter()
                    } else {
                        this.pointer = 3;
                        this.next();
                    }
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
        }
    };
}
