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
    public growthStageDuration: number;
    public currentGrowthStageFrame: number;
    public maxGrowthStageFrame: number;

    constructor(objectId: ObjectId, title: string, inventory: InventoryItem) {
        super(Utils.generateId(), objectId, title);
        this.objectId = objectId;
        this.inventory = inventory;
        return this;
    }

    public static clone(orig: Seed) {
        return new Seed(
            orig.id,
            orig.title,
            InventoryItem.clone(orig.getInventory())
        )
        .setGrowthStageDuration(orig.growthStageDuration)
        .setCurrentGrowthStageFrame(orig.currentGrowthStageFrame)
        .setMaxGrowthStageFrame(orig.maxGrowthStageFrame)
        .setCrop(GenericItem.clone(orig.crop));
    }

    public getInventory() {
        return this.inventory;
    }

    public setGrowthStageDuration(growthStageDuration: number) {
        this.growthStageDuration = growthStageDuration;
        return this;
    }

    public setCurrentGrowthStageFrame(currentGrowthStageFrame: number) {
        this.currentGrowthStageFrame = currentGrowthStageFrame;
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
