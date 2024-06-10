
import {  CursorType } from "../cursors/types";

export interface InventoryItem
{
    id:number;
    isStackable:boolean;
    amount: number
    cursorType:CursorType
}
