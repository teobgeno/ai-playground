import { GridEngine } from "grid-engine";
import { TaskStatus } from "./types";
import { CharacterState, Character } from "../characters/types";

export abstract class BaseTask {
    protected gridEngine: GridEngine;
    protected character: Character;
    protected status: TaskStatus;
    protected pointer: number = 0;
    protected destinationMoveX: number = 0;
    protected destinationMoveY: number = 0;
    protected initTimestamp: number = 0;
    protected lastTimestamp: number = 0;
    protected IntervalProcess: ReturnType<typeof setInterval>;
    protected staminaCost: number = 0;

    constructor(gridEngine: GridEngine, character: Character) {
        this.character = character;
        this.gridEngine = gridEngine;
        this.status = TaskStatus.Initialized;
    }

    public getStatus() {
        return this.status;
    }

    public setStatus(status: TaskStatus) {
        this.status = status;
    }
    
    public getMoveDestinationPoint() {
        return { x: this.destinationMoveX, y: this.destinationMoveY };
    }
    protected shouldMoveCharacter(x: number, y: number) {
        this.pointer = 2;
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
