import { InventoryItem } from "../characters/types";
import { CursorType } from "../cursors/types";

export class CornSeed implements InventoryItem {
    public id:number;
    public isStackable:boolean;
    public amount: number
    public icon:string;
    public cursorType:CursorType
 

    constructor() {
        this.id = 2;
        this.isStackable = true;
        this.amount = 3;
        this.icon = '🌽';
        this.cursorType = CursorType.CROP;
    }

    public execute() {}
}
