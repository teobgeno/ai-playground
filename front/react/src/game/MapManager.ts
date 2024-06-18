import { Tilemaps } from "phaser";
import { LandEntity } from "./farm/types";
export class MapManager {
    private map: Tilemaps.Tilemap
    private farmLandMap: Map<string, LandEntity>;
    constructor(
        map: Tilemaps.Tilemap,
    ) {
        this.map = map;
    }

    public setOutDoorFarmLand() {
        for (let y = 0; y < this.map.height; y++) {
            for (let x = 0; x < this.map.width; x++) {
                const tileGround = this.map.getTileAt(x, y, false, "Ground");

                const tileTree = this.map.getTileAt(x, y, false, "Trees");

                if (tileGround && !tileTree) {
                    this.farmLandMap.set(x + "-" + y, {
                        isWeeded: false,
                        hasCrop: false,
                    });
                }
            }
        }
    }

    public getOutDoorFarmLand() {
        return this.farmLandMap;
    }
}