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
    public growthStageIntervals: Array<number>;         // growthStageInterval intervals to add growth if any. Values in desired days.
    public reGrowthStageIntervals: Array<number> = [];  // reGrowthStageInterval intervals to add growth if any. Values in desired days.
    public currentInterval: number;                     // current key of growthStageFrames or reGrowthStageFrames
    public baseWaterConsumption: number;                // water consumption per growthStageInterval
    public growthStageFrames: Array<number>;            // grow frame sprite
    public reGrowthStageFrames: Array<number>;          // regrow frame sprite
    public currentFrame: number;                        // current key of growthStageFrames or reGrowthStageFrames


    /***
     * Day = 900 secs / 15 minutes
     * E.x Corn  stages Frame 0  -> growthStageInterval every 18 sec to reach 100% for next level ->  18*100 = 1800 = 2 days
     * E.x Corn  stages Frame 1  -> growthStageInterval every 27 sec to reach 100% for next level ->  27*100 = 2700 = 3 days 
     * E.x Corn growthStageIntervals = [2, 3, 3, 3, 3, 3].
     * E.x Corn reGrowthStageIntervals = [3].
     * E.x Corn growthStageFrames = [30,31,32,33,34].
     * E.x Corn reGrowthStageFrames = [33,34].
     * growthStageIntervals and reGrowthStageIntervals values are converted to sec based on timescale -> ((86400*desiredDays)/TimeScale)/100
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
        .setCurrentInterval(orig.currentInterval)
        .setBaseWaterConsumption(orig.baseWaterConsumption)
        .setGrowthStageFrames(orig.growthStageFrames)
        .setReGrowthStageFrames(orig.reGrowthStageFrames)
        .setCurrentFrame(orig.currentFrame)
      
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

    public setCurrentInterval(currentInterval: number) {
        this.currentInterval = currentInterval;
        return this;
    }

    public setBaseWaterConsumption(baseWaterConsumption: number) {
        this.baseWaterConsumption = baseWaterConsumption;
        return this;
    }

    public setGrowthStageFrames(growthStageFrames: Array<number>) {
        this.growthStageFrames = growthStageFrames;
        return this;
    }

    public setReGrowthStageFrames(reGrowthStageFrames: Array<number>) {
        this.reGrowthStageFrames = reGrowthStageFrames;
        return this;
    }

    public setCurrentFrame(currentFrame: number) {
        this.currentFrame = currentFrame;
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
