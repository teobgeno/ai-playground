import { Tilemaps } from "phaser";
import { MapObject } from "./core/types";

export class MapManager {
    private map: Tilemaps.Tilemap;
    private mapObjects: Array<MapObject> = [];
    private plotLandCoords: Map<string, MapObject | null> = new Map();
    // private plotLandCoords: Map<string, LandProperties> = new Map();
    // private plotLandEntities: Array<FarmLand> = [];
    constructor(map: Tilemaps.Tilemap) {
        this.map = map;
    }

    public createPlotLandCoords() {
        for (let y = 0; y < this.map.height; y++) {
            for (let x = 0; x < this.map.width; x++) {
                const tileGround = this.map.getTileAt(x, y, false, "Ground");

                const tileTree = this.map.getTileAt(x, y, false, "Trees");

                if (tileGround && !tileTree) {
                    this.plotLandCoords.set(x + "-" + y, null);
                }
            }
        }
    }

    public getPlotLandCoords() {
        return this.plotLandCoords;
    }

    public setPlotLandCoords(x: number, y: number, obj: MapObject | null) {
        if(obj === null) {
            this.deleteMapObject(this.getPlotLandCoord(x, y) as MapObject);
        } else {
            this.addMapObject(obj);
        }
        this.plotLandCoords.set(x + "-" + y, obj);
    }

    public getPlotLandCoord(x: number, y: number) {
        return this.plotLandCoords.get(x + "-" + y);
    }

    public isTilePlotExist(x: number, y: number) {
        return this.plotLandCoords.has(x + "-" + y);
    }

    public setTileCollition(x: number, y: number, collide: boolean) {
        const tile = this.map.getTileAt(x, y, false, "Ground");
        if (tile) {
            tile.properties = { ge_collide: collide };
        }
    }


    public  getMapObjects() {
        return this.mapObjects;
    }

    private addMapObject(obj: MapObject ) {
        if(!this.mapObjects.find(x=> x.id === obj.id)) {
            this.mapObjects.push(obj)
        }
    }

    private deleteMapObject(obj: MapObject) {
        this.mapObjects = this.mapObjects.filter(x=> x.id !== obj.id);
    }

    // public updatePlotLandCoords(key:string, entity: LandProperties) {
    //     const current = this.plotLandCoords.get(key);
    //     //this.plotLandCoords.set(key, {...current, ...entity});
    // }

    // public getPlotLandEntities() {
    //     return this.plotLandEntities;
    // }

    // public addPlotLandEntity(entity: FarmLand) {
    //     this.plotLandEntities.push(entity);
    // }

    // public deletePlotLandEntityByCoords(x:number, y:number) {
    //     const landIndex = this.plotLandEntities.findIndex(e=> e.getPixelX() === x && e.getPixelY() === y);
    //     this.plotLandEntities.splice(landIndex, 1);
    // }

    // public hasTilePlotConstruction(x: number, y: number) {
    //     const land = this.plotLandCoords.get(x + "-" + y);
    //     return land?.hasFence
    // }

    // public isTilePlotOccupied(x: number, y: number) {
    //     const land = this.plotLandCoords.get(x + "-" + y);
    //     return land?.hasFence || land?.isWeeded;
    // }
}
