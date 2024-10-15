import { OrderStatus, Order, Task, TaskStatus } from "./types";
import { ServiceLocator } from "../core/serviceLocator";
import { TimeManager } from "../TimeManager";



export class BaseOrder implements Order{
    protected tasks: Array<Task> = [];
    protected currentTask: Task;
    protected startDate: Date;
    protected endDate: Date;
    protected isRecurring: boolean;
    protected taskPointer: number = 0;

    protected status: OrderStatus;
    protected pointer: number = 0;
    protected destinationMoveX: number = 0;
    protected destinationMoveY: number = 0;

    constructor() {

        this.status = OrderStatus.Initialized;
    }

    public addTask(task: Task) {
        return this.tasks.push(task);
    }

    public getTasks() {
        return this.tasks;
    }

    public setStatus(status: OrderStatus) {
        this.status = status;
    }
    public getStatus() {
       return this.status;
    }

    public start() {
        this.setStatus(OrderStatus.Running);
    }

    public cancel() {
        this.setStatus(OrderStatus.Canceled);
    }

    public pause() {
        this.setStatus(OrderStatus.Paused);
    }

    public isInTimeRange() {

        const timeManager = ServiceLocator.getInstance<TimeManager>('timeManager')!;
        let ret = false;
        if(this.startDate && 
            this.endDate && 
            timeManager.getCurrentDate() >= this.startDate &&
            timeManager.getCurrentDate() <= this.endDate
        ) {
            ret = true;
        }

        if(!this.startDate && !this.endDate) {
            
            ret = true;
        }
        
        return ret;
    }

    public runTasks() {
        if (

            (!this.currentTask) ||
            (this.currentTask && this.currentTask.getStatus() === TaskStatus.Completed)
            
        ) {
            
            this.currentTask = this.tasks[this.taskPointer];
            
            if (this.currentTask.getStatus() === TaskStatus.Initialized) {
                this.currentTask.start();
            }

            if(this.currentTask && this.currentTask.getStatus() === TaskStatus.Canceled) {
                this.currentTask.cancel();
            }

            this.taskPointer++;
        }
    }

    public update() {

        if(this.isInTimeRange() && this.taskPointer <= this.tasks.length) {
            this.setStatus(OrderStatus.Running);
            this.runTasks();
        }

        if(this.isInTimeRange() && this.taskPointer > this.tasks.length) {

            if(this.isRecurring) {
                this.taskPointer = 0;
                this.setStatus(OrderStatus.Running);
                this.runTasks();
            } else {
                this.setStatus(OrderStatus.Completed);
            }
           
        }
        
        if(!this.isInTimeRange() && this.isRecurring){
            this.setStatus(OrderStatus.WaitingNextReccur);
        } 

    }

}
