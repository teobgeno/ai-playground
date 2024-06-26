import { BaseItem } from "../items/BaseItem";
import { InventoryItem } from "../items/InventoryItem";
import { Storable } from "../items/types";

export class GenericItem extends BaseItem implements Storable {
    public inventory: InventoryItem;

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
