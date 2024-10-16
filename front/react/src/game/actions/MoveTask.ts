import { BaseTask } from "./BaseTask";
import { MapManager } from "../MapManager";
import { GridEngine } from "grid-engine";

import { FarmLand } from "../farm/FarmLand";
import { Seed } from "../farm/Seed";

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
        this.status =
            this.status === TaskStatus.Initialized
                ? TaskStatus.Running
                : this.status;
        this.pointer = 1;
        this.next();
    }

    public cancel = () => {

        this.status = TaskStatus.Rollback;
        this.gridEngine.stopMovement(this.character.getIdTag());
        this.status = TaskStatus.Completed;
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
            this.status = TaskStatus.Completed;
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
