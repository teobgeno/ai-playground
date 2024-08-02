import { InventoryItem } from "../items/InventoryItem"
import { Storable } from "./types";
import { GenericItem } from "../items/GenericItem";
import { CursorType } from "../cursors/types";
import { ObjectId } from "../core/types";

import { Seed } from "../farm/Seed";

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

    public static createCornSeed(amount: number) {
        
        const seedCrop = new GenericItem(ObjectId.Corn,'Corn', new InventoryItem().setIcon('https://assets.codepen.io/7237686/corn.svg?format=auto'));
        const cornSeed = new Seed(ObjectId.CornSeed, 'Corn Seeds', 
            new InventoryItem()
            .setIsStackable(true)
            .setAmount(amount).setIcon('https://assets.codepen.io/7237686/poppy_seeds.svg?format=auto')
            .setCursorType(CursorType.EXTERNAL_INTERACTION)
        )
        .setGrowthStageDuration(1000)
        .setCurrentGrowthStageFrame(30)
        .setStartGrowthStageFrame(30)
        .setMaxGrowthStageFrame(34)
        .setCrop(seedCrop);

        return cornSeed;
    }
}