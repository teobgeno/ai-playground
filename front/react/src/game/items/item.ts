import { InventoryItem } from "../characters/types";
import { CursorType } from "../cursors/types";

export class Item implements InventoryItem {
    public id: number;
    public title: string;

    public isStackable: boolean = true;
    public amount: number = 0;
    public icon: string = '';
    public cursorType: CursorType = CursorType.NONE;

    constructor(id: number, title: string) {
        this.id = id;
        this.title = title;
        return this;
    }

    public static clone(orig: Item) {
        return new Item(orig.id, orig.title)
            .setIsStackable(orig.isStackable)
            .setAmount(orig.amount)
            .setIcon(orig.icon)
    }

    public setIsStackable(isStackable: boolean) {
        this.isStackable = isStackable;
        return this;
    }

    public setAmount(amount: number) {
        this.amount = amount;
        return this;
    }
    public setIcon(icon: string) {
        this.icon = icon;
        return this;
    }
}
