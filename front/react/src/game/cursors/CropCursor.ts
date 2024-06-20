
import { Tilemaps } from "phaser";
import { MapManager } from "../MapManager";
import { GridEngine } from "grid-engine";

import { Seed } from "../farm/Seed";
import { SeedTask } from "../actions/SeedTask";

import { InventoryItem } from "../characters/types";
import {Humanoid} from "../characters/Humanoid";
import { Cursor } from "./types";


export class CropCursor implements Cursor {

    private scene: Phaser.Scene;
    private map: Tilemaps.Tilemap;
    private mapManager: MapManager;
    private gridEngine: GridEngine;
    private character: Humanoid;
    private marker: Phaser.GameObjects.Rectangle;
    private seed: Seed;

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

    public onPointerMove(pointerTileX: number, pointerTileY: number) {
        this.marker.x = (this.map.tileToWorldX(pointerTileX) || 0) + 16;
        this.marker.y = (this.map.tileToWorldY(pointerTileY) || 0) + 16;
        this.marker.setAlpha(1);
       
        if (
            this.mapManager.getPlotLandCoords().get(pointerTileX + "-" + pointerTileY)?.isWeeded &&
            !this.mapManager.getPlotLandCoords().get(pointerTileX + "-" + pointerTileY)?.hasCrop &&
            this.seed.amount > 0 &&
            !this.gridEngine.isBlocked(
                { x: pointerTileX, y: pointerTileY },
                "CharLayer"
            )
        ) {
            this.marker.setStrokeStyle(
                2,
                Phaser.Display.Color.GetColor(0, 153, 0),
                1
            );
        } else {
            this.marker.setStrokeStyle(
                2,
                Phaser.Display.Color.GetColor(204, 0, 0),
                1
            );
        }
    }

    public setItem(seed: InventoryItem) {
        this.seed = seed as Seed;
    }

    public onPointerUp(pointerTileX: number, pointerTileY: number) {
        if (
            this.mapManager.getPlotLandCoords().get(pointerTileX + "-" + pointerTileY)?.isWeeded &&
            !this.mapManager.getPlotLandCoords().get(pointerTileX + "-" + pointerTileY)?.hasCrop &&
            this.seed.amount > 0 &&
            !this.gridEngine.isBlocked(
                { x: pointerTileX, y: pointerTileY },
                "CharLayer"
            )
            
        ) {
            const tileGround = this.map.getTileAt(
                pointerTileX,
                pointerTileY,
                false,
                "Ground"
            );

            if (tileGround) {

                this.mapManager.updatePlotLandCoords(tileGround.x + "-" + tileGround.y, { isWeeded: true, hasCrop: true });

                const landEntity = this.mapManager.getPlotLandEntities().find(
                    (x) =>
                        x.getX() === tileGround.x &&
                        x.getY() === tileGround.y
                );

                if(landEntity) {

                    const cloneSeed = Seed.clone(this.seed);
                    cloneSeed.amount = 1;

                    landEntity.createCrop(cloneSeed);
                    this.character.getInventory().removeItemById(cloneSeed.id, 1);
          
                    const s = new SeedTask(
                        this.mapManager,
                        this.gridEngine,
                        this.character,
                        landEntity,
                        cloneSeed
    
                    );
                    this.character.addTask(s);
                }
            }
        }
    }
}
