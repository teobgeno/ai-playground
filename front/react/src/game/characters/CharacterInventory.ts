import { EventBus } from "../EventBus";
import { InventoryAction } from "./types";
import { Storable } from "../items/types";
import { ObjectId } from "../core/types";
import { StorageSubSections } from "../../components/types";

export class CharacterInventory {
    private items: Array<Storable | null> = [];
    private craftIngridients: Array<Storable | null> = Array(9);
    private inventorySize = 24;
    private hotbarSize = 5;
    constructor() {}

    public addItem(item: Storable) {
        if (!this.getItem(item.objectId) || (item && !item.getInventory().isStackable)) {
            //find next available slot
            for (let i = 0; i < this.inventorySize; i++) {
                //console.log(this.items[i])
                if (
                    typeof this.items[i] === "undefined" || 
                    this.items[i] === null
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

    public removeItem(item: Storable) {
        this.updateItem(item, InventoryAction.Remove);
    }

    public removeItemByObjectId(itemObjectId: ObjectId, amount: number) {
        const remItem = this.getItem(itemObjectId);
        if (remItem) {
            remItem.getInventory().amount = remItem.getInventory().amount - amount;
            if (remItem.getInventory().amount === 0) {
                const itemIndex = this.items.findIndex((x) => x?.objectId === itemObjectId);
                if (itemIndex > -1) {
                    this.items[itemIndex] = null;
                }
            }
        }
        EventBus.emit("on-character-inventory-update", {});
    }

    private updateItem(item: Storable, action: InventoryAction) {
        const updItem = this.getItem(item.objectId);
        if (updItem && action === InventoryAction.Add) {
            updItem.getInventory().amount += item.getInventory().amount;
        }
        if (updItem && action === InventoryAction.Remove) {
            updItem.getInventory().amount -= item.getInventory().amount;
        }
    }

    public moveItemInternal(sourceSubSection: StorageSubSections, targetSubSection: StorageSubSections, sourceItemId: number, targetKey: number) {
        const itemIndex = this[sourceSubSection].findIndex((x) => x?.id === sourceItemId);
        this[targetSubSection][targetKey] = this[sourceSubSection][itemIndex];
        this[sourceSubSection][itemIndex] = null;
        EventBus.emit("on-character-inventory-update", {});
    }

    private getItem(itemObjectId: ObjectId) {
        return this.items.find((x) => x?.objectId === itemObjectId);
    }
  
    public getAllItems() {
        return this.items;
    }

    public getHotbarItems() {
        const ret: Array<Storable | null> = [];
        for (let i = 0; i < this.hotbarSize; i++) {
            ret.push(this.items[i]);
        }
        return ret;
    }

    public getRestItems() {
        const ret: Array<Storable | null> = [];
        for (let i =  this.hotbarSize; i < this.inventorySize; i++) {
            ret.push(this.items[i]);
        }
        return ret;
    }

    public getCraftIngridients() {
        const ret: Array<Storable | null> = [];
        for (let i =  0; i < this.craftIngridients.length; i++) {
            ret.push(this.craftIngridients[i]);
        }
        return ret;
    }

    

    //id
    //isStackable
    //amount
    //cursorType
}
