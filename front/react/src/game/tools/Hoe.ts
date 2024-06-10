import { Tool } from "./types";
import { InventoryItem } from "../characters/types";
import { CursorType } from "../cursors/types";

export default class Hoe implements Tool, InventoryItem {
    public id:number;
    public isStackable:boolean;
    public amount: number
    public cursorType:CursorType

    constructor() {
        this.id = 1;
        this.isStackable = false;
        this.amount = 1;
        this.cursorType = CursorType.HOE;
    }

    public execute() {}
}
