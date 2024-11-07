import { ServiceLocator } from "../core/serviceLocator";
import { Utils } from "../core/Utils";
import { GameMediator } from "../GameMediator";
import { GridEngine } from "grid-engine";
import { TaskStatus, Task, SharedDataItem } from "./types";
import { CharacterState, Character } from "../characters/types";



export abstract class BaseTask {
    protected id: number;
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
    protected sharedDataPool: Array<SharedDataItem> = [];
    protected updateSharedDataPool: (obj: SharedDataItem) => void;
    protected modifyPropertiesFunc: Array<()=>void> = [];
    protected restorePropertiesFunc: Array<()=>void> = [];

    constructor(gridEngine: GridEngine, character: Character) {
        this.id = Utils.generateId();
        this.character = character;
        this.gridEngine = gridEngine;
        this.status = TaskStatus.Initialized;
    }

    public getId() {
        return this.id;
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

    public setSharedDataPool(sharedDataPool: Array<SharedDataItem>) {
        this.sharedDataPool = sharedDataPool;
    }

    public setSharedDataPoolFunc(func:(obj: SharedDataItem) => void) {
        this.updateSharedDataPool = func;
    }

    public start(childObj: Task) {
        this.createFuncForModifyProperties(childObj);
    }

    protected clearForExit() {
        this.restorePropertiesFromShared();
        this.modifyPropertiesFunc = [];
        this.restorePropertiesFunc = [];
    }

    protected createFuncForModifyProperties(childObj: Task) {
        // const c = [];
        // const r = [];
        for (const item of this.sharedDataPool) {
            if (item.forId === this.getId()) { 
                for (const [key, value] of Object.entries(item)) {
                    const propSet = 'set' + key.charAt(0).toUpperCase() + '' + key.slice(1);
                    const propGet = 'get' + key.charAt(0).toUpperCase() + '' + key.slice(1);
                    if (typeof childObj[propSet as keyof Task] === 'function' && typeof childObj[propGet as keyof Task] === 'function') {
                        this.modifyPropertiesFunc.push( () => { childObj[propSet as keyof Task](value)} );
                        const curPropValue = childObj[propGet as keyof Task]();
                        this.restorePropertiesFunc.push( () => { childObj[propSet as keyof Task]( curPropValue )} );
                    }
                }
            }
        }
    }

    protected modifyPropertiesFromShared() {
        console.log(this.modifyPropertiesFunc)
        for (const func of this.modifyPropertiesFunc) {
            func();
        }
    }

    protected restorePropertiesFromShared() {
        for (const func of this.restorePropertiesFunc) {
            func();
        }
    }

    protected notifyOrder<T extends object>(data: T) {
        const gameMediator = ServiceLocator.getInstance<GameMediator>('gameMediator')!;
        gameMediator.emitEvent('on-order-task-change-status', data);
    }

}
