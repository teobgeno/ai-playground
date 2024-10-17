
import { CharacterInventory } from "./CharacterInventory";
import { Task, Order } from "../actions/types";
import { Humanoid } from "./Humanoid";

export enum InventoryAction {
    Remove = -1,
    Add = 1,
}

export enum CharacterState {
    IDLE = "idle",
    WALK = "walk",
    AUTOWALK = "autowalk",
    TALK = "talk",
    TILL = "till",
}


 export interface Character extends Humanoid
{
    anims: Phaser.Animations.AnimationState
    getId: () => number;
    getIdTag: () => string;
    getName: () => string;
    setCharState:(state: string) => void;
    decreaseStamina:(staminaAmount: number) => void;
    getInventory:() => CharacterInventory
    addTask:(task: Task) => void
    addOrder:(order: Order) => void
}
