import { InventoryItem } from "../characters/types";
import { CursorType } from "../cursors/types";

export class Seed implements InventoryItem {
    constructor(
        public id: number,
        public isStackable: boolean,
        public amount: number,
        public icon: string,
       
        public growthStageDuration: number,
        public currentGrowthStage: number,
        public maxGrowthStage: number,
    
        public cursorType: CursorType  = CursorType.CROP,
    ) {
       
    }

    public execute() {}
}
