import { GridEngine } from "grid-engine";
import { MapManager } from "../MapManager";
import { ServiceLocator } from "../core/serviceLocator";
import { Character } from "../characters/types";

import { MoveTask } from "../actions/MoveTask";
import { TillageTask } from "../actions/TillageTask";
import { LockTillageTask } from "../actions/LockTillageTask";
import { BaseOrder } from "../actions/BaseOrder";

import { Hoe } from "../items/Hoe";
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

}