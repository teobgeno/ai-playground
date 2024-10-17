import { BaseTask } from "./BaseTask";
import { GridEngine } from "grid-engine";

import { TaskStatus, Task } from "./types";
import { CharacterState, Character } from "../characters/types";


export class MoveTask extends BaseTask implements Task{
    protected destinationMoveX: number = 0;
    protected destinationMoveY: number = 0;
    private posX: number;
    private posY: number;

    constructor(
        gridEngine: GridEngine,
        character: Character,
        posX: number,
        posY: number
    ) {
        super(gridEngine, character);
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
                        console.log('error cannot move')
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

    public getMoveDestinationPoint() {
        return { x: this.destinationMoveX, y: this.destinationMoveY };
    }

    protected canMoveCharacter() {
        if(this.gridEngine.isBlocked({ x: this.posX, y: this.posY },"CharLayer")) {
            return false;
        }

        return true;
    }

    protected shouldMoveCharacter() {
        const characterPos = this.gridEngine.getPosition(
            this.character.getIdTag()
        );
        if (characterPos.x === this.posX && characterPos.y === this.posY) {
            return false;
        }
      
        return true;
    }

    protected moveCharacter() {
        this.character.setCharState(CharacterState.AUTOWALK);
        this.destinationMoveX = this.posX;
        this.destinationMoveY = this.posY;
        this.gridEngine.moveTo(this.character.getIdTag(), {
            x: this.posX,
            y: this.posY,
        });
    }

}
