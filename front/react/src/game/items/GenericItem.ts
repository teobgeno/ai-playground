import { BaseItem } from "../items/BaseItem";
import { InventoryItem } from "../items/InventoryItem";
import { Storable } from "../items/types";
import {
    ObjectId,
} from "../core/types";
import { Utils } from "../core/Utils";

export class GenericItem extends BaseItem implements Storable {
    public inventory: InventoryItem;

    constructor(objectId: ObjectId, title: string, inventory: InventoryItem) {
        super(Utils.generateId(), objectId, title);
        this.objectId = objectId;
        this.inventory = inventory;
        return this;
    }

    public static clone(orig: GenericItem) {
        return new GenericItem(
            orig.objectId,
            orig.title,
            InventoryItem.clone(orig.getInventory())
        )
    }

    public getInventory() {
        return this.inventory;
    }
}
