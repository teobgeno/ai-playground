import { EventBus } from "../EventBus";
import { InventoryItem, InventoryAction } from "./types";

export class CharacterInventory {
    private items: Array<InventoryItem> = [];
    private inventorySize = 24;
    private hotbarSize = 4;
    constructor() {}

    public addItem(item: InventoryItem) {
        if (!this.getItem(item.id) || (item && !item.isStackable)) {
            //find next available slot
            for (let i = 0; i < this.inventorySize; i++) {
                if (
                    typeof this.items[i] === "undefined" ||
                    (this.items[i] && this.items[i] === null)
                ) {
                    this.items[i] = item;
                    break;
                }
            }
        } else {
            this.updateItem(item, InventoryAction.Add);
        }
        EventBus.emit("on-character-inventory-update", {});
    }

    public removeItem(item: InventoryItem) {
        this.updateItem(item, InventoryAction.Remove);
    }

    public removeItemById(itemId: number, amount:number) {
        const remItem = this.getItem(itemId);
        if(remItem) {
            remItem.amount = remItem.amount - amount;
        }
        EventBus.emit("on-character-inventory-update", {});
    }

    private updateItem(item: InventoryItem, action: InventoryAction) {
        const updItem = this.getItem(item.id);
        if (updItem && action === InventoryAction.Add) {
            updItem.amount += item.amount;
        }
        if (updItem && action === InventoryAction.Remove) {
            updItem.amount -= item.amount;
        }
    }

    private getItem(itemId: number) {
        return this.items.find((x) => x.id === itemId);
    }
    public getHotbarItems() {
        const ret: Array<InventoryItem> = [];
        for (let i = 0; i < this.hotbarSize; i++) {
            ret.push(this.items[i]);
        }
        return ret;
    }

    //id
    //isStackable
    //amount
    //cursorType
}
