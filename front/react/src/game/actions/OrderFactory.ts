import { GridEngine } from "grid-engine";
import { MapManager } from "../MapManager";
import { ServiceLocator } from "../core/serviceLocator";
import { Character } from "../characters/types";

import { MoveTask } from "../actions/MoveTask";
import { TillageTask } from "../actions/TillageTask";
import { LockTillageTask } from "../actions/LockTillageTask";
import { BreakStoneTask } from "./BreakStoneTask";
import { SeekFindTask } from "../actions/SeekFindTask";
import { BaseOrder } from "../actions/BaseOrder";

import { Hoe } from "../items/Hoe";
import { PickAxe } from "../items/PickAxe";
import { WaterCan } from "../items/WaterCan";
import { FarmLand } from "../farm/FarmLand";
import { InventoryItem } from "../items/InventoryItem"
import { CursorType } from "../cursors/types";
import { MapObject, ObjectId } from "../core/types";

export class OrderFactory {

    public static createTillageOrder(gridEngine: GridEngine, character: Character, scene: Phaser.Scene, posX: number, posY: number, highlight = true) {

        const hoe = new Hoe(
            new InventoryItem()
            .setIcon('https://assets.codepen.io/7237686/iridium_hoe.svg?format=auto')
            .setIsStackable(false)
            .setAmount(1)
            .setCursorType(CursorType.HOE)
        )

        const moveTask = OrderFactory.createMoveTask(gridEngine, character, posX, posY, [1, 1]);
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

        const moveTask = OrderFactory.createMoveTask(gridEngine, character, posX-1, posY, [1, 1]);
        //const interactWithItemTask = new BaseInteractWithItemTask(gridEngine, character, pickAxe, posX, posY);
        const order = new BaseOrder();

        order.addTask(moveTask);
        //order.addTask(interactWithItemTask);
 
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

        const moveTask = OrderFactory.createMoveTask(gridEngine, character, posX, posY, [1, 1]);
        //const interactWithItemTask = new BaseInteractWithItemTask(gridEngine, character, waterCan, posX, posY);
        const order = 
            new BaseOrder()
            .setIsRecurring(true)
            .setStartTime('10:00:00')
            .setEndTime('13:00:00')
            .setInterval(60)

        order.addTask(moveTask);
        //order.addTask(interactWithItemTask);
 
        character.addOrder(order);
    }

    public static createBreakRockOrder(gridEngine: GridEngine, character: Character, scene: Phaser.Scene, posX: number, posY: number) {
        
       
        const moveTask = OrderFactory.createMoveTask(gridEngine, character, posX, posY, [1, 1]);
        const breakStoneTask = OrderFactory.createBreakRockTask(gridEngine, character, posX, posY);
        const order = new BaseOrder();

        order.addTask(moveTask);
        order.addTask(breakStoneTask);
 
        character.addOrder(order);
    }

    public static createSeekAndFindOrder(gridEngine: GridEngine, character: Character) {
        
        const areaToScan = [
            [10, 15], [11, 15], [12, 15], [13, 15], [14, 15],
            [10, 16], [11, 16], [12, 16], [13, 16], [14, 16],
            [10, 17], [11, 17], [12, 17], [13, 17], [14, 17]
        ]

        const seekAndFindTask = OrderFactory.createSeekAndFindTask(gridEngine, character, areaToScan, ObjectId.Stone);
        const moveTask = OrderFactory.createMoveTask(gridEngine, character, -1, -1, [1, 1]);
        const breakRockTask = OrderFactory.createBreakRockTask(gridEngine, character, -1, -1);
        seekAndFindTask.setOutputDataTaskIds({moveCoords: [moveTask.getId()], itemCoords: [breakRockTask.getId()]});
    }


    public static createMoveTask(gridEngine: GridEngine, character: Character, posX: number, posY: number, distanceFromTarget: Array<number>) {
        
        return new MoveTask(gridEngine, character, posX, posY, distanceFromTarget);
    }

    public static createSeekAndFindTask(gridEngine: GridEngine, character: Character, areaToScan: Array<Array<number>>, objectId: ObjectId) {
        
        return new SeekFindTask(
            gridEngine, 
            character, 
            areaToScan,
            {groupId: objectId}
        );
    }

    public static createBreakRockTask(gridEngine: GridEngine, character: Character, posX: number, posY: number) {
        const pickAxe = new PickAxe(
            new InventoryItem()
            .setIcon('https://assets.codepen.io/7237686/iridium_pickaxe.svg?format=auto')
            .setIsStackable(false)
            .setAmount(1)
            .setCursorType(CursorType.EXTERNAL_INTERACTION)
        )

        return new BreakStoneTask(gridEngine, character, pickAxe, posX, posY);
    }


}