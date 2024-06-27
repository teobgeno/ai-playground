import { CursorType } from "../cursors/types";

export class InventoryItem  {

    public isStackable: boolean = true;
    public amount: number = 0;
    public icon: string = '';
    public cursorType: CursorType = CursorType.NONE;

 
    public static clone(orig: InventoryItem) {
        return new InventoryItem()
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

    public setCursorType(cursorType: CursorType) {
        this.cursorType = cursorType;
        return this;
    }
}
