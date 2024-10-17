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

        if (this.status === TaskStatus.Running) {
            this.setStatus(TaskStatus.Initialized);
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
                    if(this.shouldMoveCharacter(this.posX, this.posY)) {
                        this.moveCharacter(this.posX, this.posY)
                    } else {
                        this.pointer = 2;
                        this.next();
                    }
                    break;
                case 2:
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

    protected shouldMoveCharacter(x: number, y: number) {
        const characterPos = this.gridEngine.getPosition(
            this.character.getIdTag()
        );
        if (characterPos.x === x && characterPos.y === y) {
            return false;
        }
        return true;
    }

    protected moveCharacter(x: number, y: number) {
        this.character.setCharState(CharacterState.AUTOWALK);
        this.destinationMoveX = x;
        this.destinationMoveY = y;
        this.gridEngine.moveTo(this.character.getIdTag(), {
            x: x,
            y: y,
        });
    }

}
