import { GridEngine } from "grid-engine";
import { OrderStatus, Order, Task } from "./types";
import { CharacterState, Character } from "../characters/types";

export class BaseOrder implements Order{
    protected gridEngine: GridEngine;
    protected character: Character;
    protected tasks: Array<Task>;
    protected startDate: Date;
    protected endDate: Date;
    protected isRecurring: boolean;

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

    public start() {
       
    }
}
