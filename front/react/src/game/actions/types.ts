export interface Action
{
	execute: () => void
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
}

