export interface Action
{
	execute: () => void
}
export interface Task
{
	posX?:number;
    posY?:number;
    start: () => void;
    next: () => void;
}
