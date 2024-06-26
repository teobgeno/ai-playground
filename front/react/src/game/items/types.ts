import { InventoryItem } from "../items/InventoryItem";
export interface Storable{
    id: number;
    getInventory: () => InventoryItem;
}
export interface Tool
{
    execute: () => void;
}
