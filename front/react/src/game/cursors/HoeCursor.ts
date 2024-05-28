import { Cursor } from "./types";
import { Tilemaps } from "phaser";
import { GridEngine } from "grid-engine";
import {Humanoid} from "../characters/Humanoid";
import { Land } from "../farm/Land";
import WeedingTask from "../actions/WeedingTask";

export class HoeCursor implements Cursor {
    private scene: Phaser.Scene;
    private map: Tilemaps.Tilemap;
    private gridEngine: GridEngine;
    private character: Humanoid;
    private farmLandMap: Map<string, string>;
    private landsMap: Array<Land> = [];
    private marker: Phaser.GameObjects.Rectangle;

    constructor(
        scene: Phaser.Scene,
        map: Tilemaps.Tilemap,
        gridEngine: GridEngine,
        character: Humanoid,
        farmLandMap: Map<string, string>,
        landsMap: Array<Land>,
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
            this.farmLandMap.get(pointerTileX + "-" + pointerTileY) ===
                "soil" &&
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
            this.farmLandMap.get(pointerTileX + "-" + pointerTileY) ===
                "soil" &&
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
                this.farmLandMap.set(pointerTileX + "-" + pointerTileY, "land");
                const landTile = new Land(
                    this.scene,
                    tileGround.pixelX,
                    tileGround.pixelY
                );
                this.landsMap.push(landTile);
                const w = new WeedingTask(
                    this.character,
                    this.gridEngine,
                    tileGround.x,
                    tileGround.y,
                    landTile
                );
                this.character.addTask(w);
            }
        }
    }
}
