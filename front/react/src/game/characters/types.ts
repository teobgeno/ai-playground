
import { CharacterInventory } from "./CharacterInventory";
import { Task } from "../actions/types";

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


 export interface Character
{
    anims: Phaser.Animations.AnimationState
    getId: () => number;
    getIdTag: () => string;
    getName: () => string;
    setCharState:(state: string) => void;
    decreaseStamina:(staminaAmount: number) => void;
    getInventory:() => CharacterInventory
    addTask:(task: Task) => void
}
