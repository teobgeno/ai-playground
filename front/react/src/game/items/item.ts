import { InventoryItem } from "../characters/types";
import { CursorType } from "../cursors/types";

export class Item implements InventoryItem {
    public id: number;
    public isStackable: boolean;
    public amount: number;
    public icon: string;
    public cursorType: CursorType;

    constructor() {}
}
