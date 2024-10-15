export interface Action
{
	execute: () => void
}

export enum OrderStatus {
    Canceled = 0,
    Initialized = 1,
    Running = 2,
    Completed = 3,
    Rollback = 4,
    Paused = 5,
    WaitingNextReccur = 6
}

export enum TaskStatus {
    Canceled = 0,
    Running = 1,
    Completed = 2,
    Initialized = 3,
    Rollback = 4
}
export interface Task
{
    start: () => void;
    cancel: () => void;
    next: () => void;
    getStatus: () => TaskStatus;
    setStatus: (status:TaskStatus) => void;
    getMoveDestinationPoint: () => {x: number, y: number}
}


export interface Order
{
    start: () => void;
    cancel: () => void;
    getStatus: () => OrderStatus;
}

