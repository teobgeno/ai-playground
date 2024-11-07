import { ServiceLocator } from "../core/serviceLocator";
import { GameMediator } from "../GameMediator";
import { TimeManager } from "../TimeManager";

import { OrderStatus, Order, Task, TaskStatus } from "./types";

//import parser from 'cron-parser';

export class BaseOrder implements Order{
    private tasks: Array<Task> = [];
    private currentTask: Task | null;
    private isRecurring: boolean;
    private interval: number;                                   // + game minutes to finish time for the next run. 
    private maxIterations: number = 0;                          // how many times the recurring order will repeat. > 0 = n times. 0 = forever
    private repeatOnCancel: boolean = false;                    // when a recurring order is canceled the order is set to completed and destroyed. When true the order is set to WaitingNextReccur.
    private startTime: string;                                  // game time to start order. 
    private endTime: string;                                    // game time to finish order. 
    private lastEndDate: Date;
    private recurringTimer: ReturnType<typeof setInterval>;
    private curIterations: number = 0;
    private taskPointer: number = 0;
    private status: OrderStatus;
    private tasksSharedData: Array<object> = [];

    constructor() {
        this.status = OrderStatus.Initialized;
    }

    public setIsRecurring(isRecurring: boolean) {
        this.isRecurring = isRecurring;
        return this;
    }

    public setInterval(interval: number) {
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
        task.setSharedDataPool(this.tasksSharedData);
        task.setSharedDataPoolFunc(this.updateSharedDataPool);
        this.tasks.push(task);
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

    public updateSharedDataPool = <T extends object>(obj: T) => {
        this.tasksSharedData.push(obj);
        console.log('Modify task shared data')
        console.log(this.tasksSharedData);
     }

    private getStartDateTime() {

        const timeManager = ServiceLocator.getInstance<TimeManager>('timeManager')!;

        const start = timeManager.getCurrentDate();
        const startTimeParts = this.startTime.split(':');
        start.setHours(Number(startTimeParts[0]));
        start.setMinutes(Number(startTimeParts[1]));
        start.setSeconds(Number(startTimeParts[2]));

        return start;
    }

    private getEndDateTime() {

        const timeManager = ServiceLocator.getInstance<TimeManager>('timeManager')!;

        const end = timeManager.getCurrentDate();
        const endTimeParts = this.endTime.split(':');
        end.setHours(Number(endTimeParts[0]));
        end.setMinutes(Number(endTimeParts[1]));
        end.setSeconds(Number(endTimeParts[2]));

        return end;
    }

    public start() {
        this.setStatus(OrderStatus.Running);
    }

    public update() {
        // Exit early if no tasks or order is in a terminal state
        if (!this.isRunnable()) return;
    
        // If current task is completed, move to the next one
        if (this.currentTask && 
            ( this.currentTask.getStatus() === TaskStatus.Completed || this.currentTask.getStatus() === TaskStatus.WaitingNextIteration)
        ) {
            this.taskPointer++;
        }
    
        // Check if we're in the valid time range and there are remaining tasks
        if (this.isInTimeRange() && this.taskPointer < this.tasks.length) {
            this.setStatus(OrderStatus.Running);
            this.runTasks();
        } 
    
        // Check for completion or recurring logic
        if (this.isInTimeRange() && this.taskPointer === this.tasks.length) {
            this.handleOrderCompletionOrRecurrence();
        }
    
        // Handle case when not in time range for recurring orders
        if (!this.isInTimeRange() && this.isRecurring) {
            this.startWaiting();
        }
    }

    public pause() {
        this.setStatus(OrderStatus.Paused);
    }

    public cancel() {
        const gameMediator = ServiceLocator.getInstance<GameMediator>('gameMediator')!;
        this.setStatus(OrderStatus.Rollback);
        for (const task of this.tasks) {
            if(task.getStatus() !== TaskStatus.Completed) {
                task.cancel();
            }
        }
        this.setStatus(OrderStatus.Completed);
        gameMediator.emitEvent('on-order-change-status', {characterIdTag: this.tasks[0].getCharacterIdTag()});
    }

    private isRunnable(): boolean {
        return !(
            this.status === OrderStatus.Paused || 
            this.status === OrderStatus.Rollback || 
            this.status === OrderStatus.Canceled
        );
    }

    public canContinueReccur() {
        const timeManager = ServiceLocator.getInstance<TimeManager>('timeManager')!;
        if(timeManager.getCurrentDate() > this.checkNextInterval() && this.isInTimeRange()) {
            return true;
        }
        return false;
    }

    private restartTasks() {
        this.taskPointer = 0;
        for (const task of this.tasks) {
            task.setStatus(TaskStatus.Running)
        }
        this.currentTask = null;
    }

    private isCompletedIteration() {
        let completedIteration = true;
        for (const task of this.tasks) {
            if(task.getStatus() !== TaskStatus.Completed) {
                completedIteration = false; 
                break;
            }
        }

       return completedIteration;
    }

    // Manage task execution and status checking
    private runTasks() {
        if (!this.currentTask || this.currentTask.getStatus() === TaskStatus.Completed || this.currentTask.getStatus() === TaskStatus.WaitingNextIteration) {
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
        const timeManager = ServiceLocator.getInstance<TimeManager>('timeManager')!;
        
        if (this.isRecurring) {
            const currentTime = timeManager.getCurrentDate();
            this.curIterations = this.isCompletedIteration() ? this.curIterations + 1: this.curIterations;

            if (!this.lastEndDate || this.lastEndDate < currentTime) {
                this.lastEndDate = currentTime;
            }

            if(this.maxIterations === 0  || this.curIterations <= this.maxIterations) {
                if (currentTime > this.checkNextInterval()) {
                    this.taskPointer = 0;
                    this.setStatus(OrderStatus.Running);
                    this.runTasks();
                } else {
                    this.startWaiting();
                }
            } else {
                this.setStatus(OrderStatus.Completed);
                gameMediator.emitEvent('on-order-change-status', {characterIdTag: this.tasks[0].getCharacterIdTag()});
            }
            

        } else {
            this.setStatus(OrderStatus.Completed);
            gameMediator.emitEvent('on-order-change-status', {characterIdTag: this.tasks[0].getCharacterIdTag()});
        }
    }

    private startWaiting() {

        this.setStatus(OrderStatus.WaitingNextReccur);
        const gameMediator = ServiceLocator.getInstance<GameMediator>('gameMediator')!;
        gameMediator.emitEvent('on-order-change-status', {characterIdTag: this.tasks[0].getCharacterIdTag()});
        this.restartTasks();

        this.recurringTimer = setInterval(()=>{
            if(this.canContinueReccur()){ 
                console.log('trigger wake order');
                clearInterval(this.recurringTimer);
                this.setStatus(OrderStatus.Initialized);
                gameMediator.emitEvent('on-order-next-reccur', {characterIdTag: this.tasks[0].getCharacterIdTag()});
            }
        }, 1000);
    }

    private isInTimeRange() {

        const timeManager = ServiceLocator.getInstance<TimeManager>('timeManager')!;
        
        if(!this.startTime && !this.endTime) {
            return true;
        }
    
        if( timeManager.getCurrentDate() >= this.getStartDateTime() && timeManager.getCurrentDate() <= this.getEndDateTime()) {
           return true;
        }

         return false;
    }

    private checkNextInterval() {
        //https://github.com/harrisiirak/cron-parser#readme
        const timeManager = ServiceLocator.getInstance<TimeManager>('timeManager')!;
        let nextDate = timeManager.addMinutesToUTCDate(this.lastEndDate, this.interval);
        if(nextDate > this.getEndDateTime()) {
            nextDate = this.getStartDateTime();
        }

        return nextDate;
        // const options = {
        //     currentDate:  this.lastEndDate ,
        // };

        // const interval = parser.parseExpression(this.interval, options);
        // //console.log(interval.next().toString());
        // return interval.next().toDate();
        
    }

}
