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
    protected childtasks: Array<Task> = [];
    protected runOnce: boolean = false;

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

    public getRunOnce() {
        return this.runOnce;
    }

    public setRunOnce(runOnce: boolean) {
        this.runOnce = runOnce;
    }

    public addChildTask(task: Task) {
        this.childtasks.push(task);
    }

    public getChildTasks() {
        return this.childtasks;
    }


    public getCharacterIdTag() {
        return this.character.getIdTag();
    }

    protected notifyOrder<T extends object>(data: T) {
        const gameMediator = ServiceLocator.getInstance<GameMediator>('gameMediator')!;
        gameMediator.emitEvent('on-order-task-change-status', data);
    }

}
