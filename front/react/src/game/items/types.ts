import { InventoryItem } from "../items/InventoryItem";
import { ObjectId } from "../core/types";
export interface Storable{
    id: number;
    title: string;
    objectId: ObjectId;
    getInventory: () => InventoryItem;
}
export interface Tool
{
    execute: () => void;
}
