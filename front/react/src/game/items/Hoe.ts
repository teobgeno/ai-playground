
import { BaseItem } from "../items/BaseItem";
import { InventoryItem } from "../items/InventoryItem";
import { Storable } from "../items/types";
import { ObjectId } from "../core/types";

export class Hoe extends BaseItem implements Storable {
    public inventory: InventoryItem;
    public weedSpeed:number

    constructor(inventory: InventoryItem) {
        super(ObjectId.Hoe, 'Hoe');
        this.inventory = inventory;
        this.weedSpeed = 1000;
    }

    public getInventory() {
        return this.inventory;
    }

}
