import { GridEngine } from "grid-engine";
import { OrderStatus, Order, Task, TaskStatus } from "./types";
import {  Character } from "../characters/types";
import { ServiceLocator } from "../core/serviceLocator";
import { TimeManager } from "../TimeManager";



export class BaseOrder implements Order{
    protected gridEngine: GridEngine;
    protected character: Character;
    protected tasks: Array<Task>;
    protected currentTask: Task;
    protected startDate: Date;
    protected endDate: Date;
    protected isRecurring: boolean;
    protected taskPointer: number = 0;

    protected status: OrderStatus;
    protected pointer: number = 0;
    protected destinationMoveX: number = 0;
    protected destinationMoveY: number = 0;

    constructor(gridEngine: GridEngine, character: Character) {
        this.character = character;
        this.gridEngine = gridEngine;
        this.status = OrderStatus.Initialized;
    }

    public addTask(task: Task) {
        return this.tasks.push(task);
    }

    public getStatus() {
       return this.status;
    }

    public start() {
        //this.currentTask = this.tasks[0];
    }

    public isInTimeRange() {

        const timeManager = ServiceLocator.getInstance<TimeManager>('timeManager')!;

        if(this.startDate && 
            this.endDate && 
            timeManager.getCurrentDate() >= this.startDate &&
            timeManager.getCurrentDate() <= this.endDate
        ) {
            return true;
        }

        if(!this.startDate && !this.endDate) {
            
            return true;
        }
        
        return false;
    }

    public update() {
        if (
            (this.tasks.length > 0 && this.taskPointer < this.tasks.length) &&
            (
                (!this.currentTask) ||
                (this.currentTask && this.currentTask.getStatus() === TaskStatus.Completed)
            )
        ) {
            
            this.currentTask = this.tasks[this.taskPointer];
            
            if (this.currentTask && this.currentTask.getStatus() === TaskStatus.Initialized) {
                this.currentTask.start();
            }
            this.taskPointer++;
        }

        if(this.currentTask && this.currentTask.getStatus() === TaskStatus.Canceled) {
            this.currentTask.cancel();
        }

        if(this.tasks.length === this.tasks.length && this.isRecurring) {
            console.log('ok');
        }
    }

    public cancel() {
    }
}
