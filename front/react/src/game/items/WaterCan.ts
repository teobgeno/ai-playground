
import { BaseItem } from "../items/BaseItem";
import { InventoryItem } from "../items/InventoryItem";
import { Storable } from "../items/types";
import { ObjectId } from "../core/types";

export class WaterCan extends BaseItem implements Storable {
    public inventory: InventoryItem;
    public capacity: number

    constructor(inventory: InventoryItem) {
        super(ObjectId.WaterCan, ObjectId.WaterCan, 'Water Can');
        this.inventory = inventory;
        this.capacity = 100;
    }

    public getInventory() {
        return this.inventory;
    }

}
