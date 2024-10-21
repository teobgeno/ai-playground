import { ServiceLocator } from "../core/serviceLocator";
import { GameMediator } from "../GameMediator";
import { TimeManager } from "../TimeManager";

import { OrderStatus, Order, Task, TaskStatus } from "./types";

import parser from 'cron-parser';

export class BaseOrder implements Order{
    private tasks: Array<Task> = [];
    private currentTask: Task | null;
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
        // Exit early if no tasks or order is in a terminal state
        if (!this.isRunnable()) return;
    
        // If current task is completed, move to the next one
        if (this.currentTask && this.currentTask.getStatus() === TaskStatus.Completed) {
            this.taskPointer++;
        }
    
        // Check if we're in the valid time range and there are remaining tasks
        if (this.isInTimeRange() && this.taskPointer < this.tasks.length) {
            this.setStatus(OrderStatus.Running);
            this.runTasks();
        } 
    
        // Check for completion or recurring logic
        else if (this.isInTimeRange() && this.taskPointer === this.tasks.length) {
            this.handleOrderCompletionOrRecurrence();
        }
    
        // Handle case when not in time range for recurring orders
        if (!this.isInTimeRange() && this.isRecurring) {
            this.setStatus(OrderStatus.WaitingNextReccur);
            this.restartTasks();
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

    private restartTasks() {
        this.taskPointer = 0;
        for (const task of this.tasks) {
            task.setStatus(TaskStatus.Running)
        }
        this.currentTask = null;
    }

    
    private isRunnable(): boolean {
        return !(
            this.status === OrderStatus.Paused || 
            this.status === OrderStatus.Rollback || 
            this.status === OrderStatus.Canceled
        );
    }
    
    // Manage task execution and status checking
    private runTasks() {
        if (!this.currentTask || this.currentTask.getStatus() === TaskStatus.Completed) {
            this.currentTask = this.tasks[this.taskPointer];
            this.currentTask.start();
    
            // Handle task errors
            if (this.currentTask && this.currentTask.getStatus() === TaskStatus.Error) {
                this.setStatus(OrderStatus.Canceled);
                this.cancel();
            }
        }
    }
    
    // Handle completion or recurrence for recurring orders
    private handleOrderCompletionOrRecurrence() {
        const gameMediator = ServiceLocator.getInstance<GameMediator>('gameMediator')!;

        if (this.isRecurring) {
            const timeManager = ServiceLocator.getInstance<TimeManager>('timeManager')!;
            const currentTime = timeManager.getCurrentDate();
    
            if (!this.lastEndDate || this.lastEndDate < currentTime) {
                this.lastEndDate = currentTime;
            }
    
            if (currentTime > this.checkNextInterval()) {
                this.taskPointer = 0;
                this.setStatus(OrderStatus.Running);
                this.runTasks();
            } else {
                this.setStatus(OrderStatus.WaitingNextReccur);
                gameMediator.emitEvent('on-order-change-status', {characterIdTag: this.currentTask?.getCharacterIdTag()});
                this.restartTasks();
            }
        } else {
            //this.scene.emit()
            this.setStatus(OrderStatus.Completed);
            gameMediator.emitEvent('on-order-change-status', {characterIdTag: this.currentTask?.getCharacterIdTag()});
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
