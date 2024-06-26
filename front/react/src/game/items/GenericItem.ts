import { BaseItem } from "../items/BaseItem";
import { InventoryItem } from "../items/InventoryItem";
import { Storable } from "../items/types";

export class GenericItem extends BaseItem implements Storable {
    public inventory: InventoryItem;
    public crop: BaseItem;
    public growthStageDuration: number;
    public currentGrowthStageFrame: number;
    public maxGrowthStageFrame: number;

    constructor(id: number, title: string, inventory: InventoryItem) {
        super(id, title);
        this.inventory = inventory;
        return this;
    }

    public static clone(orig: GenericItem) {
        return new GenericItem(
            orig.id,
            orig.title,
            InventoryItem.clone(orig.getInventory())
        )
    }

    public getInventory() {
        return this.inventory;
    }
}
