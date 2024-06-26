import { Tilemaps } from "phaser";
import { MapManager } from "../MapManager";
import { GridEngine } from "grid-engine";

// import { Land } from "../farm/Land";


import { Humanoid } from "../characters/Humanoid";
import { Cursor } from "./types";

export class WateringCanCursor implements Cursor{
    private scene: Phaser.Scene;
    private map: Tilemaps.Tilemap;
    private mapManager: MapManager;
    private gridEngine: GridEngine;
    private character: Humanoid;
    private marker: Phaser.GameObjects.Rectangle;

    constructor(
        scene: Phaser.Scene,
        map: Tilemaps.Tilemap,
        mapManager: MapManager,
        gridEngine: GridEngine,
        character: Humanoid,
        marker: Phaser.GameObjects.Rectangle

    ) {
        this.scene = scene;
        this.map = map;
        this.mapManager = mapManager;
        this.gridEngine = gridEngine;
        this.character = character;
        this.marker = marker;
    }

    public hidePointer() {
        this.marker.x = -1000;
        this.marker.y = -1000;
        this.marker.setAlpha(0);
    }

    public onPointerMove(pointerTileX: number, pointerTileY: number) {

        this.marker.x = (this.map.tileToWorldX(pointerTileX)|| 0) + 16;
        this.marker.y = (this.map.tileToWorldY(pointerTileY)|| 0) + 16;
        this.marker.setAlpha(1);

        if (this.mapManager.getPlotLandCoords().get(pointerTileX + '-' + pointerTileY)?.isWeeded) {
            this.marker.setStrokeStyle(2,Phaser.Display.Color.GetColor(0, 153, 0), 1);
        } else {
            this.marker.setStrokeStyle(2,Phaser.Display.Color.GetColor(204, 0, 0), 1);
        }
    }

    public onPointerUp(pointerTileX: number, pointerTileY: number) {
        if (
            this.mapManager.getPlotLandCoords().get(pointerTileX + "-" + pointerTileY)?.isWeeded
        ) {
            const tileGround = this.map.getTileAt(
                pointerTileX,
                pointerTileY,
                false,
                "Ground"
            );

            if (tileGround) {
               
                const landEntity = this.mapManager.getPlotLandEntities().find(
                    (x) =>
                        x.getX() === tileGround.pixelX &&
                        x.getY() === tileGround.pixelY
                );

                landEntity?.water();

                // const w = new WeedingTask(
                //     this.character,
                //     this.gridEngine,
                //     tileGround.x,
                //     tileGround.y,
                //     landTile
                // );
                // this.character.addTask(w);
            }
        }
    }
}
