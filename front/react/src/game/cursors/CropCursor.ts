
import { Tilemaps } from "phaser";
import { GridEngine } from "grid-engine";
import { Land } from "../farm/Land";

import { SeedTask } from "../actions/SeedTask";

import {Humanoid} from "../characters/Humanoid";
import { Cursor } from "./types";
import {LandEntity} from "../farm/types";

export class CropCursor implements Cursor {
    private scene: Phaser.Scene;
    private map: Tilemaps.Tilemap;
    private gridEngine: GridEngine;
    private character: Humanoid;
    private landsMap: Array<Land> = [];
    private farmLandMap: Map<string, LandEntity>;
    private marker: Phaser.GameObjects.Rectangle;

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
        this.farmLandMap = farmLandMap;
        this.landsMap = landsMap;
        this.marker = marker;
    }

    public onPointerMove(pointerTileX: number, pointerTileY: number) {
        this.marker.x = (this.map.tileToWorldX(pointerTileX) || 0) + 16;
        this.marker.y = (this.map.tileToWorldY(pointerTileY) || 0) + 16;
        this.marker.setAlpha(1);

        if (
            this.farmLandMap.get(pointerTileX + "-" + pointerTileY)?.hasCrop
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
            this.farmLandMap.get(pointerTileX + "-" + pointerTileY)?.hasCrop
        ) {
            const tileGround = this.map.getTileAt(
                pointerTileX,
                pointerTileY,
                false,
                "Ground"
            );

            if (tileGround) {
                const land = this.landsMap.find(
                    (x) =>
                        x.getPosX() === tileGround.pixelX &&
                        x.getPosY() === tileGround.pixelY
                );
                land?.plantCrop(2);

                // const w = new SeedTask(
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
