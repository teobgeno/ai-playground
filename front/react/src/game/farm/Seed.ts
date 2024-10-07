import { BaseItem } from "../items/BaseItem";
import { GenericItem } from "../items/GenericItem";
import { InventoryItem } from "../items/InventoryItem";
import { Storable } from "../items/types";
import {
    ObjectId,
} from "../core/types";
import { Utils } from "../core/Utils";
export class Seed extends BaseItem implements Storable{
    public inventory: InventoryItem;
    public crop: GenericItem;
    public health: number;                              // defines health of the growing plant and the quality of the initial crop. 
    public baseGrowthRate: number;                      // base value for growth stage.
    public currentGrowthStagePercentage: number = 0;    // when 100% go to next level
    public growthStageIntervals: Array<number>;         // growthStageInterval intervals to add growth if any.
    public reGrowthStageIntervals: Array<number> = [];  // reGrowthStageInterval intervals to add growth if any -> time to ms
    public baseWaterConsumption: number;                // water consumption per growthStageInterval
    public currentGrowthStageFrame: number;             // current sprite frame
    public growthStageFrames: Array<number>;
    public reGrowthStageFrames: Array<number>;
    public startGrowthStageFrame: number;               // start sprite frame
    public maxGrowthStageFrame: number;                 // end sprite frame
    public regrowStageFrame: number;                    // end sprite frame

    /***
     * Day = 900 secs / 15 minutes
     * E.x Corn  stages Frame 0  -> growthStageInterval every 18 sec to reach 100% for next level ->  18*100 = 1800 = 2 days
     * E.x Corn  stages Frame 1  -> growthStageInterval every 27 sec to reach 100% for next level ->  27*100 = 2700 = 3 days 
     * E.x Corn growthStageIntervals = [18000, 27000, 27000, 27000, 27000, 27000].
     * E.x Corn reGrowthStageIntervals = [27000].
     * E.x Corn growthStageFrames = [30,31,32,33,34].
     * E.x Corn reGrowthStageFrames = [33,34].
     * ((86400*desiredDays)/TimeScale)/100
     */

    constructor(objectId: ObjectId, title: string, inventory: InventoryItem) {
        super(Utils.generateId(), objectId, title);
        this.objectId = objectId;
        this.inventory = inventory;
        return this;
    }

    public static clone(orig: Seed) {
        return new Seed(
            orig.objectId,
            orig.title,
            InventoryItem.clone(orig.getInventory())
        )
        .setBaseGrowthRate(orig.baseGrowthRate)
        .setCurrentGrowthStagePercentage(orig.currentGrowthStagePercentage)
        .setGrowthStageIntervals(orig.growthStageIntervals)
        .setReGrowthStageIntervals(orig.reGrowthStageIntervals)
        .setBaseWaterConsumption(orig.baseWaterConsumption)
        .setCurrentGrowthStageFrame(orig.currentGrowthStageFrame)
        .setStartGrowthStageFrame(orig.startGrowthStageFrame)
        .setMaxGrowthStageFrame(orig.maxGrowthStageFrame)
        .setCrop(GenericItem.clone(orig.crop));
    }

    public getInventory() {
        return this.inventory;
    }

    public canRegow() {
        return this.reGrowthStageIntervals.length > 0;
    }

    public setBaseGrowthRate(baseGrowthRate: number) {
        this.baseGrowthRate = baseGrowthRate;
        return this;
    }

    public setCurrentGrowthStagePercentage(currentGrowthStagePercentage: number) {
        this.currentGrowthStagePercentage = currentGrowthStagePercentage;
        return this;
    }

    public setGrowthStageIntervals(growthStageIntervals: Array<number>) {
        this.growthStageIntervals = growthStageIntervals;
        return this;
    }

    public setReGrowthStageIntervals(reGrowthStageIntervals: Array<number>) {
        this.reGrowthStageIntervals = reGrowthStageIntervals;
        return this;
    }

    public setBaseWaterConsumption(baseWaterConsumption: number) {
        this.baseWaterConsumption = baseWaterConsumption;
        return this;
    }

    public setCurrentGrowthStageFrame(currentGrowthStageFrame: number) {
        this.currentGrowthStageFrame = currentGrowthStageFrame;
        return this;
    }

    public setStartGrowthStageFrame(startGrowthStageFrame: number) {
        this.startGrowthStageFrame = startGrowthStageFrame;
        return this;
    }

    public setMaxGrowthStageFrame(maxGrowthStageFrame: number) {
        this.maxGrowthStageFrame = maxGrowthStageFrame;
        return this;
    }

    public setCrop(crop: GenericItem) {
        this.crop = crop;
        return this;
    }

    public getCropFromHarvest() {
        this.crop.getInventory().amount = Math.floor(this.getRandomArbitrary(1, 4));
        return this.crop;
    }

    private getRandomArbitrary(min: number, max: number) {
        return Math.random() * (max - min) + min;
    }

    public execute() {}
}
