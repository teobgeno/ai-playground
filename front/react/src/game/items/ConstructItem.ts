import { BaseItem } from "../items/BaseItem";
import { InventoryItem } from "../items/InventoryItem";
import { Storable } from "../items/types";

export class ConstuctItem extends BaseItem implements Storable {

    public inventory: InventoryItem;
    public materials: string; // Materials created this item.item ids and amount. Can or cannot  be extracted if this item destroyed by player.
    // decay item or not.
    // collision on/off or toggle (e.x door)
    // sprite, animations
    constructor(id: number, title: string, inventory: InventoryItem) {
        super(id, title);
        this.inventory = inventory;
        return this;
    }

    public static clone(orig: ConstuctItem) {
        return new ConstuctItem(
            orig.id,
            orig.title,
            InventoryItem.clone(orig.getInventory())
        )
    }

    public getInventory() {
        return this.inventory;
    }
}
