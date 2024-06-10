import { InventoryItem } from "./types";

export default class CharacterInventory {
    private items: Array<InventoryItem> = [];
    constructor() {}

    private addItem(item: InventoryItem) {
        if(!this.getItem(item.id) || (item && !item.isStackable)) {
            this.items.push(item);
        } else {
            this.updateItem(item)
        }
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
    private display() {}

    //id
    //isStackable
    //amount
    //cursorType
}
