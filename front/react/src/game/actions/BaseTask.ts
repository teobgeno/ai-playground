import { ServiceLocator } from "../core/serviceLocator";
import { GameMediator } from "../GameMediator";
import { GridEngine } from "grid-engine";
import { TaskStatus, Task } from "./types";
import { CharacterState, Character } from "../characters/types";


export abstract class BaseTask {
    protected gridEngine: GridEngine;
    protected character: Character;
    protected status: TaskStatus;
    protected pointer: number = 0;
    protected initTimestamp: number = 0;
    protected lastTimestamp: number = 0;
    protected IntervalProcess: ReturnType<typeof setInterval>;
    protected IntervalTicks: number = 0;
    protected staminaCost: number = 0;
    // protected childtasks: Array<Task> = []; //in case task need to generate tasks and return them to order for execution
    // protected runOnce: boolean = false; // flag task for delete from the order after execution. Better add maxIterations like order.
    protected updateSharedDataPool: <T extends object>(obj: T) => void;

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

    // public getRunOnce() {
    //     return this.runOnce;
    // }

    // public setRunOnce(runOnce: boolean) {
    //     this.runOnce = runOnce;
    // }

    public getCharacterIdTag() {
        return this.character.getIdTag();
    }

    public setSharedData(func:<T extends object>(obj: T) => void) {
        this.updateSharedDataPool = func;
    }

    protected notifyOrder<T extends object>(data: T) {
        const gameMediator = ServiceLocator.getInstance<GameMediator>('gameMediator')!;
        gameMediator.emitEvent('on-order-task-change-status', data);
    }

}
