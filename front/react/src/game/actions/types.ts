export interface Action
{
	execute: () => void
}

export enum OrderStatus {
    Initialized = 1,
    Running = 2,
    Completed = 3,
    Rollback = 4,
    Canceled = 5,
    Paused = 6,
    WaitingNextReccur = 7
}

export enum TaskStatus {
    Initialized = 1,
    Running = 2,
    Completed = 3,
    Rollback = 4,
    Canceled = 5,
    Error = 6
}
export interface Task
{
    start: () => void;
    cancel: () => void;
    next: () => void;
    complete: () => void;
    getStatus: () => TaskStatus;
    setStatus: (status:TaskStatus) => void;
}


export interface Order
{
    start: () => void;
    cancel: () => void;
    update: () => void;
    getTasks: () => Array<Task>;
    getCurrentTask: () => Task | null;
    getStatus: () => OrderStatus;
    canContinueReccur: () => boolean;

}

