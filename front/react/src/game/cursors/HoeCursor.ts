import { Tilemaps } from "phaser";
import { MapManager } from "../MapManager";
import { GridEngine } from "grid-engine";

import { Hoe } from "../items/Hoe";
import { BaseOrder } from "../actions/BaseOrder";
import { TillageTask } from "../actions/TillageTask";
import { FarmLand } from "../farm/FarmLand";
import { OrderFactory } from "../actions/OrderFactory";

import { Storable } from "../items/types";
import { Character } from "../characters/types";
import { Cursor } from "./types";

export class HoeCursor implements Cursor {
    private scene: Phaser.Scene;
    private map: Tilemaps.Tilemap;
    private mapManager: MapManager;
    private gridEngine: GridEngine;
    private character: Character;
    private marker: Phaser.GameObjects.Rectangle;
    private canExecute: boolean = false;
    private hoe: Hoe;

    constructor(
        scene: Phaser.Scene,
        map: Tilemaps.Tilemap,
        mapManager: MapManager,
        gridEngine: GridEngine,
        character: Character,
        marker: Phaser.GameObjects.Rectangle
    ) {
        this.scene = scene;
        this.map = map;
        this.mapManager = mapManager;
        this.gridEngine = gridEngine;
        this.character = character;
        this.marker = marker;
    }

    public setItem(hoe: Storable) {
        this.hoe = hoe as Hoe;
    }

    public getItem() {
        return this.hoe;
    }

    public hidePointer() {
        this.marker.x = -1000;
        this.marker.y = -1000;
        this.marker.setAlpha(0);
    }

    public onPointerMove(pointerTileX: number, pointerTileY: number) {
        this.marker.x = (this.map.tileToWorldX(pointerTileX) || 0) + 16;
        this.marker.y = (this.map.tileToWorldY(pointerTileY) || 0) + 16;
        this.marker.setAlpha(1);

        const mapObj = this.mapManager.getPlotLandCoord(pointerTileX, pointerTileY);

        if (
            this.mapManager.isTilePlotExist(pointerTileX, pointerTileY) &&
            mapObj === null &&
            !this.gridEngine.isBlocked({ x: pointerTileX, y: pointerTileY },"CharLayer")
        ) {
            this.canExecute = true;
            this.marker.setStrokeStyle(
                2,
                Phaser.Display.Color.GetColor(0, 153, 0),
                1
            );
        } else {
            this.canExecute = false;
            this.marker.setStrokeStyle(
                2,
                Phaser.Display.Color.GetColor(204, 0, 0),
                1
            );
        }
    }

    public onPointerUp(pointerTileX: number, pointerTileY: number) {
        if (this.canExecute) {
            // const tillage = new TillageTask(
            //     this.gridEngine,
            //     this.character,
            //     this.scene,
            //     this.mapManager,
            //     this.hoe,
            //     pointerTileX,
            //     pointerTileY
            // );

            OrderFactory.createTillageOrder(this.gridEngine, this.character, this.scene, pointerTileX, pointerTileY);

            // const order = new BaseOrder();
            // order.addTask(tillage)

            // this.character.addTask(tillage);



            // const tileGround = this.map.getTileAt(
            //     pointerTileX,
            //     pointerTileY,
            //     false,
            //     "Ground"
            // );
            
            // if (tileGround) {

            //     const landEntity = new FarmLand(
            //         this.scene,
            //         {x: tileGround.x, y: tileGround.y, pixelX: tileGround.pixelX, pixelY: tileGround.pixelY}
            //     );
                

            //     this.mapManager.setPlotLandCoords( tileGround.x,  tileGround.y, landEntity);

            // }
        }
    }
}
