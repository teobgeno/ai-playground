import { GridEngine } from "grid-engine";
import { MapManager } from "../MapManager";
import { ServiceLocator } from "../core/serviceLocator";
import { Character } from "../characters/types";

import { MoveTask } from "../actions/MoveTask";
import { TillageTask } from "../actions/TillageTask";
import { LockTillageTask } from "../actions/LockTillageTask";
import { InteractWithItemTask } from "../actions/InteractWithItemTask";
import { BaseOrder } from "../actions/BaseOrder";

import { Hoe } from "../items/Hoe";
import { PickAxe } from "../items/PickAxe";
import { WaterCan } from "../items/WaterCan";
import { FarmLand } from "../farm/FarmLand";
import { InventoryItem } from "../items/InventoryItem"
import { CursorType } from "../cursors/types";

export class OrderFactory {

    public static createTillageOrder(gridEngine: GridEngine, character: Character, scene: Phaser.Scene, posX: number, posY: number, highlight = true) {

        const hoe = new Hoe(
            new InventoryItem()
            .setIcon('https://assets.codepen.io/7237686/iridium_hoe.svg?format=auto')
            .setIsStackable(false)
            .setAmount(1)
            .setCursorType(CursorType.HOE)
        )

        const moveTask = new MoveTask(gridEngine, character, posX, posY);
        const tillageTask = new TillageTask(gridEngine, character, hoe, posX, posY);
        const order = new BaseOrder();
       

        if(highlight) {
            const mapManager = ServiceLocator.getInstance<MapManager>('mapManager')!;
            const landEntity = new FarmLand(
                scene,
                {x: posX, y: posY, pixelX: mapManager.tileToWorldX(posX) || 0, pixelY: mapManager.tileToWorldY(posY) || 0}
            );
            mapManager.setPlotLandCoords( posX, posY, landEntity);

        } else {
            const lockTillageTask = new LockTillageTask(gridEngine, character, scene, posX, posY);
            order.addTask(lockTillageTask);
        }

        order.addTask(moveTask);
        order.addTask(tillageTask);
 
        character.addOrder(order);
       
    }

    public static createInteractWithItemOrder(gridEngine: GridEngine, character: Character, scene: Phaser.Scene, posX: number, posY: number) {
        const pickAxe = new PickAxe(
            new InventoryItem()
            .setIcon('https://assets.codepen.io/7237686/iridium_pickaxe.svg?format=auto')
            .setIsStackable(false)
            .setAmount(1)
            .setCursorType(CursorType.EXTERNAL_INTERACTION)
        )

        const moveTask = new MoveTask(gridEngine, character, posX-1, posY);
        const interactWithItemTask = new InteractWithItemTask(gridEngine, character, pickAxe, posX, posY);
        const order = new BaseOrder();

        order.addTask(moveTask);
        order.addTask(interactWithItemTask);
 
        character.addOrder(order);
    }

    public static createWaterPlantsOrder(gridEngine: GridEngine, character: Character, scene: Phaser.Scene, posX: number, posY: number) {
        
        const waterCan = new WaterCan(
            new InventoryItem()
            .setIcon('https://assets.codepen.io/7237686/iridium_pickaxe.svg?format=auto')
            .setIsStackable(false)
            .setAmount(1)
            .setCursorType(CursorType.EXTERNAL_INTERACTION)
        )

        const moveTask = new MoveTask(gridEngine, character, posX-1, posY);
        const interactWithItemTask = new InteractWithItemTask(gridEngine, character, waterCan, posX, posY);
        const order = 
            new BaseOrder()
            .setIsRecurring(true)
            .setStartTime('10:00:00')
            .setEndTime('13:00:00')
            .setInterval('0 * * * *')

        order.addTask(moveTask);
        order.addTask(interactWithItemTask);
 
        character.addOrder(order);
    }

}