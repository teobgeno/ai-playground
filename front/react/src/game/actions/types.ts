export interface Action
{
	execute: () => void
}

export enum TaskStatus {
    Canceled = 0,
    Running = 1,
    Completed = 2,
}
export interface Task
{
	posX?:number;
    posY?:number;
    getStatus: () => TaskStatus;
    start: () => void;
    next: () => void;
}

