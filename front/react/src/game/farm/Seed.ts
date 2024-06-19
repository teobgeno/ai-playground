import { Item } from "../items/item";
import { InventoryItem } from "../characters/types";
import { CursorType } from "../cursors/types";

export class Seed implements InventoryItem {
    public id: number;
    public title: string;

    public isStackable: boolean = true;
    public amount: number = 0;
    public icon: string = "";
    public cursorType: CursorType = CursorType.CROP;

    public growthStageDuration: number;
    public currentGrowthStageFrame: number;
    public maxGrowthStageFrame: number;
    public crop: Item;

    constructor(id: number, title: string) {
        this.id = id;
        this.title = title;
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

    public setCrop(crop: Item) {
        this.crop = crop;
        return this;
    }

    public getCropFromHarvest() {
        this.crop.amount = Math.floor(this.getRandomArbitrary(1, 4));
        return this.crop;
    }

    private getRandomArbitrary(min: number, max: number) {
        return Math.random() * (max - min) + min;
    }

    public execute() {}
}
