import { Tool } from "./types";
import { InventoryItem } from "../characters/types";
import { CursorType } from "../cursors/types";

export default class Hoe implements Tool, InventoryItem {
    public id:number;
    public isStackable:boolean;
    public amount: number
    public cursorType:CursorType.HOE

    public execute() {}
}
