import { GridEngine } from "grid-engine";
import { Character } from "../characters/types";

import { MoveTask } from "../actions/MoveTask";
import { TillageTask } from "../actions/TillageTask";
import { LockTillageTask } from "../actions/LockTillageTask";
import { BaseOrder } from "../actions/BaseOrder";

import { Hoe } from "../items/Hoe";
import { InventoryItem } from "../items/InventoryItem"
import { CursorType } from "../cursors/types";

export class OrderFactory {

    public static createTillageOrder(gridEngine: GridEngine, character: Character, scene: Phaser.Scene, posX: number, posY: number) {

        const hoe = new Hoe(
            new InventoryItem()
            .setIcon('https://assets.codepen.io/7237686/iridium_hoe.svg?format=auto')
            .setIsStackable(false)
            .setAmount(1)
            .setCursorType(CursorType.HOE)
        )

        const lockTillageTask = new LockTillageTask(gridEngine, character, scene, posX, posY);
        const moveTask = new MoveTask(gridEngine, character, posX, posY);
        const tillageTask = new TillageTask(gridEngine, character, hoe, posX, posY);

        const order = new BaseOrder();
        order.addTask(lockTillageTask);
        order.addTask(moveTask);
        order.addTask(tillageTask);
 
        character.addOrder(order);
       
    }

}