import { OrderStatus, Order, Task, TaskStatus } from "./types";
import { ServiceLocator } from "../core/serviceLocator";
import { TimeManager } from "../TimeManager";
//const { default: parser } = require('cron-parser');
import parser from 'cron-parser';



export class BaseOrder implements Order{
    private tasks: Array<Task> = [];
    private currentTask: Task;
    private isRecurring: boolean;
    private interval: string;
    private startTime: string;
    private endTime: string;
    private lastEndDate: Date;
    private taskPointer: number = 0;
    private status: OrderStatus;

    constructor() {
        this.status = OrderStatus.Initialized;
    }

    public setIsRecurring(isRecurring: boolean) {
        this.isRecurring = isRecurring;
        return this;
    }

    public setInterval(interval: string) {
        this.interval = interval;
        return this;
    }

    public setStartTime(startTime: string) {
        this.startTime = startTime;
        return this;
    }

    public setEndTime(endTime: string) {
        this.endTime = endTime;
        return this;
    }

    public addTask(task: Task) {
        return this.tasks.push(task);
    }

    public getTasks() {
        return this.tasks;
    }

    public getCurrentTask() {
        return this.currentTask;
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

    public canContinueReccur() {
        const timeManager = ServiceLocator.getInstance<TimeManager>('timeManager')!;
        if(timeManager.getCurrentDate() > this.checkNextInterval() && this.isInTimeRange()) {
            return true;
        }
        return false;
    }

    public update() {
        if(
            this.status === OrderStatus.Paused || 
            this.status === OrderStatus.Rollback || 
            this.status === OrderStatus.Canceled
        ) {
            return
        }

        
        if(this.currentTask && this.currentTask.getStatus() === TaskStatus.Completed){
            this.taskPointer++;
        }

        if(this.isInTimeRange() && this.taskPointer < this.tasks.length) {
            this.setStatus(OrderStatus.Running);
            this.runTasks();
        }

        if(this.isInTimeRange() && this.taskPointer === this.tasks.length) {

            if(this.isRecurring) {
                const timeManager = ServiceLocator.getInstance<TimeManager>('timeManager')!;

                if(!this.lastEndDate || (this.lastEndDate < timeManager.getCurrentDate())) {
                    this.lastEndDate = timeManager.getCurrentDate();
                }
               
                //console.log(this.checkNextInterval());
                if(timeManager.getCurrentDate() > this.checkNextInterval()) {
                    this.taskPointer = 0;
                    this.setStatus(OrderStatus.Running);
                    this.runTasks();
                } else {
                    this.setStatus(OrderStatus.WaitingNextReccur);
                }
                //TODO:: if isRecurring check cron interval if pass  reset tasks status to running, order to running, taskPointer = 0
                //TODO::if isRecurring check cron interval if not pass set order status OrderStatus.WaitingNextReccur
               
            } else {
                this.setStatus(OrderStatus.Completed);
            }
           
        }
        
        if(!this.isInTimeRange() && this.isRecurring){
            this.setStatus(OrderStatus.WaitingNextReccur);
        }

    }

    public pause() {
        this.setStatus(OrderStatus.Paused);
    }

    public cancel() {
        this.setStatus(OrderStatus.Rollback);
        for (const task of this.tasks) {
            if(task.getStatus() === TaskStatus.Completed || this.currentTask === task) {
                task.cancel();
            }
        }
        this.setStatus(OrderStatus.Completed);
    }

   
    private runTasks() {
        if (

            (!this.currentTask) ||
            (this.currentTask && this.currentTask.getStatus() === TaskStatus.Completed)
            
        ) {
            
            this.currentTask = this.tasks[this.taskPointer];
            this.currentTask.start();

            //throw error from task cancel order
            if(this.currentTask && this.currentTask.getStatus() === TaskStatus.Error) {
                this.setStatus(OrderStatus.Canceled);
                this.cancel();
            }
        }
    }

    private isInTimeRange() {

        const timeManager = ServiceLocator.getInstance<TimeManager>('timeManager')!;
        
        if(!this.startTime && !this.endTime) {
            return true;
        }
    
        const current = timeManager.getCurrentDate();
   
        const start = timeManager.getCurrentDate();
        const startTimeParts = this.startTime.split(':');
        start.setHours(Number(startTimeParts[0]));
        start.setMinutes(Number(startTimeParts[1]));
        start.setSeconds(Number(startTimeParts[2]));

        const end = timeManager.getCurrentDate();
        const endTimeParts = this.endTime.split(':');
        end.setHours(Number(endTimeParts[0]));
        end.setMinutes(Number(endTimeParts[1]));
        end.setSeconds(Number(endTimeParts[2]));

        if( current >= start && current <= end) {
           return true;
        }

         return false;
    }

    private checkNextInterval() {
        //https://github.com/harrisiirak/cron-parser#readme

        const options = {
            currentDate:  this.lastEndDate ,
        };

        const interval = parser.parseExpression(this.interval, options);
        //console.log(interval.next().toString());
        return interval.next().toDate();
        
    }

}
