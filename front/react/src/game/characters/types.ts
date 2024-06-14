import { CursorType } from "../cursors/types";

export interface InventoryItem {
    id: number;
    isStackable: boolean;
    amount: number;
    icon: string;
    cursorType: CursorType;
}

export enum InventoryAction {
    Remove = -1,
    Add = 1,
}
