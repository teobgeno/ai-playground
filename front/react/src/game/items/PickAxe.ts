
import { BaseItem } from "../items/BaseItem";
import { InventoryItem } from "../items/InventoryItem";
import { Storable } from "../items/types";
import { ObjectId  } from "../core/types";

export class PickAxe extends BaseItem implements Storable {
    private inventory: InventoryItem;
    private baseBreakSpeed:number

    constructor(inventory: InventoryItem) {
        super(ObjectId.PickAxe, ObjectId.PickAxe, 'PickAxe');
        this.inventory = inventory;
        this.baseBreakSpeed = 1000;
    }

    public getInventory() {
        return this.inventory;
    }

    public getBreakSpeed() {
        return this.baseBreakSpeed;
    }

}
