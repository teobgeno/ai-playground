
import { Tilemaps } from "phaser";
import { MapManager } from "../MapManager";
import { GridEngine } from "grid-engine";

import { Seed } from "../farm/Seed";
import { SeedTask } from "../actions/SeedTask";

import { Storable } from "../items/types";
import {Humanoid} from "../characters/Humanoid";
import { Cursor } from "./types";


export class CropCursor implements Cursor {

    private scene: Phaser.Scene;
    private map: Tilemaps.Tilemap;
    private mapManager: MapManager;
    private gridEngine: GridEngine;
    private character: Humanoid;
    private marker: Phaser.GameObjects.Rectangle;
    private canExecute: boolean = false;
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

    public hidePointer() {
        this.marker.x = -1000;
        this.marker.y = -1000;
        this.marker.setAlpha(0);
    }

    public onPointerMove(pointerTileX: number, pointerTileY: number) {
        this.marker.x = (this.map.tileToWorldX(pointerTileX) || 0) + 16;
        this.marker.y = (this.map.tileToWorldY(pointerTileY) || 0) + 16;
        this.marker.setAlpha(1);
       
        if (
            this.mapManager.isTilePlotExist(pointerTileX, pointerTileY) &&
            this.mapManager.getPlotLandCoords().get(pointerTileX + "-" + pointerTileY)?.isWeeded &&
            !this.mapManager.getPlotLandCoords().get(pointerTileX + "-" + pointerTileY)?.hasCrop &&
            this.seed.getInventory().amount > 0 &&
            !this.gridEngine.isBlocked(
                { x: pointerTileX, y: pointerTileY },
                "CharLayer"
            )
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

    public setItem(seed: Storable) {
        this.seed = seed as Seed;
    }

    public onPointerUp(pointerTileX: number, pointerTileY: number) {
        if (this.canExecute) {
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
                    cloneSeed.getInventory().amount = 1;

                    landEntity.createCrop(cloneSeed);
                    this.character.getInventory().removeItemById(cloneSeed.id, 1);
                    console.log(cloneSeed)
          
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
