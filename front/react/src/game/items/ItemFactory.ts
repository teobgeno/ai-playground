import { InventoryItem } from "../items/InventoryItem"
import { Storable } from "./types";
import { GenericItem } from "../items/GenericItem";
import { CursorType } from "../cursors/types";
import { ObjectId } from "../core/types";

export class ItemFactory {


    constructor() {
  
    }

    public static createFencePart(amount: number) {
        const fencePart = new GenericItem(ObjectId.Fence, 'Fence', 
            new InventoryItem().setIsStackable(true)
            .setAmount(amount)
            .setIcon('https://stardewvalleywiki.com/mediawiki/images/1/1e/Wood_Fence.png')
            .setCursorType(CursorType.FENCE)
        );

        return fencePart;
    }
}