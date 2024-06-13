import { Tilemaps } from "phaser";
import { GridEngine } from "grid-engine";

import { Hoe } from "../tools/Hoe";
import WeedingTask from "../actions/WeedingTask";
import { Land } from "../farm/Land";

import { InventoryItem } from "../characters/types";
import { Humanoid } from "../characters/Humanoid";
import { Cursor } from "./types";
import {LandEntity} from "../farm/types";

export class HoeCursor implements Cursor {
    private scene: Phaser.Scene;
    private map: Tilemaps.Tilemap;
    private gridEngine: GridEngine;
    private character: Humanoid;
    private farmLandMap: Map<string, LandEntity>;
    private landsMap: Array<Land> = [];
    private marker: Phaser.GameObjects.Rectangle;
    private hoe: Hoe;

    constructor(
        scene: Phaser.Scene,
        map: Tilemaps.Tilemap,
        gridEngine: GridEngine,
        character: Humanoid,
        landsMap: Array<Land>,
        farmLandMap: Map<string, LandEntity>,
        marker: Phaser.GameObjects.Rectangle
    ) {
        this.scene = scene;
        this.map = map;
        this.gridEngine = gridEngine;
        this.character = character;
        this.landsMap = landsMap;
        this.farmLandMap = farmLandMap;
        this.marker = marker;
    }

    public setItem(hoe: InventoryItem) {
        this.hoe = hoe as Hoe;
    }

    public onPointerMove(pointerTileX: number, pointerTileY: number) {
        this.marker.x = (this.map.tileToWorldX(pointerTileX) || 0) + 16;
        this.marker.y = (this.map.tileToWorldY(pointerTileY) || 0) + 16;
        this.marker.setAlpha(1);

        if (
            !this.farmLandMap.get(pointerTileX + "-" + pointerTileY)?.isWeeded &&
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

    public onPointerUp(pointerTileX: number, pointerTileY: number) {
        if (
            !this.farmLandMap.get(pointerTileX + "-" + pointerTileY)?.isWeeded &&
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
                
                const landTile = new Land(
                    this.scene,
                    tileGround.pixelX,
                    tileGround.pixelY
                );
                const w = new WeedingTask(
                    this.gridEngine,
                    this.character,
                    pointerTileX,
                    pointerTileY,
                    tileGround,
                    this.landsMap,
                    this.farmLandMap,
                    landTile,
                    this.hoe
                );
                this.character.addTask(w);
            }
        }
    }
}
