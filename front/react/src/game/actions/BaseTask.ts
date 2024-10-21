import { GridEngine } from "grid-engine";
import { TaskStatus } from "./types";
import { CharacterState, Character } from "../characters/types";

export abstract class BaseTask {
    protected gridEngine: GridEngine;
    protected character: Character;
    protected status: TaskStatus;
    protected pointer: number = 0;
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

    public getCharacterIdTag() {
        return this.character.getIdTag();
    }

}
