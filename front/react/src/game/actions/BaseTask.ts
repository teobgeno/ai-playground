import { GridEngine } from "grid-engine";
import { Humanoid } from "../characters/Humanoid";
import { TaskStatus } from "./types";

export abstract class BaseTask {
    protected gridEngine: GridEngine;
    protected character: Humanoid;
    protected status: TaskStatus;
    protected pointer: number = 0;
    protected destinationMoveX: number = 0;
    protected destinationMoveY: number = 0;

    constructor(gridEngine: GridEngine, character: Humanoid) {
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
            this.character.getId()
        );
        if (characterPos.x === x && characterPos.y === y) {
            return false;
        }
        return true;
    }

    protected moveCharacter(x: number, y: number) {
        this.character.setCharState("walk");
        this.destinationMoveX = x;
        this.destinationMoveY = y;
        this.gridEngine.moveTo(this.character.getId(), {
            x: x,
            y: y,
        });
    }
}
