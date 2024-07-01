
import { BaseItem } from "../items/BaseItem";
import { InventoryItem } from "../items/InventoryItem";
import { Storable } from "../items/types";
import { ObjectId, ObjectType  } from "../core/types";

export class PickAxe extends BaseItem implements Storable {
    public inventory: InventoryItem;
    public objectType: ObjectType = ObjectType.Tool;
    public weedSpeed:number

    constructor(inventory: InventoryItem) {
        super(ObjectId.PickAxe, 'PickAxe');
        this.inventory = inventory;
        this.weedSpeed = 1000;
    }

    public getInventory() {
        return this.inventory;
    }

}
