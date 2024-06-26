
import { BaseItem } from "../items/BaseItem";
import { InventoryItem } from "../items/InventoryItem";
import { Storable } from "../items/types";

export class Hoe extends BaseItem implements Storable {
    public inventory: InventoryItem;
    public weedSpeed:number

    constructor(id: number, title: string, inventory: InventoryItem) {
        super(id, title);
        this.inventory = inventory;
        this.weedSpeed = 1000;
    }

    public getInventory() {
        return this.inventory;
    }

}
