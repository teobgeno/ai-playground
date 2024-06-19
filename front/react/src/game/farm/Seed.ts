import { InventoryItem } from "../characters/types";
import { CursorType } from "../cursors/types";

export class Seed implements InventoryItem {
    public id: number;
    public title: string;

    public isStackable: boolean;
    public amount: number;
    public icon: string;

    public growthStageDuration: number;
    public currentGrowthStageFrame: number;
    public maxGrowthStageFrame: number;
    public cursorType: CursorType = CursorType.CROP;

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

    public execute() {}

    public getCrop() {
        //🌽
    }
}
