import { MapManager } from "../MapManager";
import { BaseItem } from "./BaseItem";
import { SpriteItem } from "./SpriteItem";
import { InteractiveItem } from "./InteractiveItem";
import {
    CoordsData,
    MapObject,
    MapObjectInteractable,
    ObjectId,
} from "../core/types";
import { Utils } from "../core/Utils";

export class Lake extends BaseItem implements MapObject, MapObjectInteractable {
    private mapManager: MapManager;
    public sprites: Array<SpriteItem> = [];
    private interactive: InteractiveItem;
  
    constructor(
        scene: Phaser.Scene,
        mapManager: MapManager,
        coords: CoordsData
    ) {
        super(Utils.generateId(), ObjectId.Lake, "Lake");
        this.mapManager = mapManager;
        this.sprites.push(
            new SpriteItem(
                scene,
                { texture: "map", frame: "lake" },
                {
                    x: coords.x,
                    y: coords.y,
                    pixelX: coords.pixelX,
                    pixelY: coords.pixelY,
                },
                16,
                16
            )
        );
        this.sprites[0].setDepth(1);

        this.toggleCollisions(true);
        this.addMapObject();

        this.interactive = new InteractiveItem();
        this.interactive.setSprites(this.sprites);
        this.interactive.setInteractiveObjectIds([ObjectId.WaterCan]);
        this.interactive.setInteractionResult(()=>{console.log('water')});
        this.interactive.startInteraction();
    }

    private toggleCollisions(collide: boolean) {

        this.mapManager.setTileCollition(
            this.sprites[0].getX(),
            this.sprites[0].getY(),
            collide
        );
        this.mapManager.setTileCollition(
            this.sprites[0].getX() - 1,
            this.sprites[0].getY(),
            collide
        );
        this.mapManager.setTileCollition(
            this.sprites[0].getX() + 1,
            this.sprites[0].getY(),
            collide
        );
        this.mapManager.setTileCollition(
            this.sprites[0].getX(),
            this.sprites[0].getY() - 1,
            collide
        );
    }

    private addMapObject() {

        this.mapManager.setPlotLandCoords(this.sprites[0].getX(), this.sprites[0].getY() - 1, this);
        this.mapManager.setPlotLandCoords(this.sprites[0].getX() - 1, this.sprites[0].getY()-1, this);
        this.mapManager.setPlotLandCoords(this.sprites[0].getX() + 1, this.sprites[0].getY()-1, this);

        this.mapManager.setPlotLandCoords(this.sprites[0].getX(), this.sprites[0].getY(), this);
        this.mapManager.setPlotLandCoords(this.sprites[0].getX() - 1, this.sprites[0].getY(), this);
        this.mapManager.setPlotLandCoords(this.sprites[0].getX() + 1, this.sprites[0].getY(), this);

        this.mapManager.setPlotLandCoords(this.sprites[0].getX(), this.sprites[0].getY() + 1, this);
        this.mapManager.setPlotLandCoords(this.sprites[0].getX() - 1, this.sprites[0].getY() + 1, this);
        this.mapManager.setPlotLandCoords(this.sprites[0].getX() + 1, this.sprites[0].getY() + 1, this);
    }

    public getInteractive() {
        return this.interactive;
    }

}
