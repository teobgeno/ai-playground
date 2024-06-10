import { Tool } from "./types";
import { InventoryItem } from "../characters/types";
import { CursorType } from "../cursors/types";

export class Hoe implements Tool, InventoryItem {
    public id:number;
    public isStackable:boolean;
    public amount: number
    public icon:string;
    public cursorType:CursorType
 

    constructor() {
        this.id = 1;
        this.isStackable = false;
        this.amount = 1;
        this.icon = '⛏️';
        this.cursorType = CursorType.HOE;
    }

    public execute() {}
}
