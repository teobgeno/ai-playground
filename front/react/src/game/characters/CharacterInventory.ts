import { InventoryItem } from "./types";

export class CharacterInventory {
    private items: Array<InventoryItem> = [];
    private inventorySize  = 24;
    private hotbarSize  = 4;
    constructor() {}

    public addItem(item: InventoryItem) {
        if(!this.getItem(item.id) || (item && !item.isStackable)) {
            //find next available slot
            for (let i = 0; i < this.inventorySize; i++) {
                if (typeof this.items[i] === 'undefined' || ( this.items[i] &&  this.items[i] === null)) {
                    this.items[i] = item;
                    break;
                }
            }

        } else {
            this.updateItem(item)
        }
        console.log(this.items)
    }
    private updateItem(item: InventoryItem) {
        const updItem = this.getItem(item.id);
        if(updItem) {
            updItem.amount += item.amount;
        }
    }
    private removeItem() {}

    private getItem(itemId: number) {
        return this.items.find(x=>x.id === itemId);
    }
    public getHotbarItems() {
        const ret: Array<InventoryItem> = [];
        for (let i = 0; i < this.hotbarSize; i++) {
            ret.push(this.items[i])
        }
        return ret;
    }

    //id
    //isStackable
    //amount
    //cursorType
}
