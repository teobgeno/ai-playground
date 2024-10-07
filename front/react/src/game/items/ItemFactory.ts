import { InventoryItem } from "../items/InventoryItem"
import { GenericItem } from "../items/GenericItem";
import { CursorType } from "../cursors/types";
import { ObjectId } from "../core/types";

import { Seed } from "../farm/Seed";

export class ItemFactory {

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
        .setBaseGrowthRate(1)
        .setCurrentGrowthStagePercentage(0)
        .setGrowthStageIntervals([2, 3, 3, 3, 3])
        .setReGrowthStageIntervals([3])
        .setCurrentInterval(0)
        .setBaseWaterConsumption(0.1)
        .setGrowthStageFrames([30, 31, 32, 33, 34])
        .setReGrowthStageFrames([33, 34])
        .setCurrentFrame(0)
        .setCrop(seedCrop);

        return cornSeed;
    }
}