
import { Tilemaps } from "phaser";
import { GridEngine } from "grid-engine";
import { Land } from "../farm/Land";

import { Seed } from "../farm/Seed";
import { SeedTask } from "../actions/SeedTask";

import { InventoryItem } from "../characters/types";
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
    private seed: Seed;

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
            this.farmLandMap.get(pointerTileX + "-" + pointerTileY)?.isWeeded &&
            !this.farmLandMap.get(pointerTileX + "-" + pointerTileY)?.hasCrop &&
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
            this.farmLandMap.get(pointerTileX + "-" + pointerTileY)?.isWeeded &&
            !this.farmLandMap.get(pointerTileX + "-" + pointerTileY)?.hasCrop &&
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
            console.log(this.seed.amount + ' seed amount')
            if (tileGround) {

                this.farmLandMap.set(pointerTileX + "-" + pointerTileY, {
                    isWeeded: true,
                    hasCrop: true,
                });

                const landTile = this.landsMap.find(
                    (x) =>
                        x.getPosX() === tileGround.pixelX &&
                        x.getPosY() === tileGround.pixelY
                );

                landTile?.createCrop({...this.seed} as Seed);
                this.character.getInventory().removeItemById(this.seed.id, 1);
      
                const s = new SeedTask(
                    this.gridEngine,
                    this.character,
                    pointerTileX,
                    pointerTileY,
                    tileGround,
                    this.landsMap,
                    this.farmLandMap,
                    landTile as Land,
                    this.seed,
                );
                this.character.addTask(s);
            }
        }
    }
}
