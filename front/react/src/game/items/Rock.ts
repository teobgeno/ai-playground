import { BaseItem } from "./BaseItem";
import { InventoryItem } from "./InventoryItem";
import { DestructItem } from "./DestructItem";
import { SpriteItem } from "./SpriteItem";
import { GenericItem } from "./GenericItem";
import {
    CoordsData,
    MapObject,
    MapObjectType,
    ObjectItems,
} from "../core/types";

export class Rock extends BaseItem implements MapObject {
    public objectType: MapObjectType = MapObjectType.Rock;
    public destruct: DestructItem;
    public sprite: SpriteItem;

    constructor(
        scene: Phaser.Scene,
        coords: CoordsData
    ) {
         //TODO:: generate id ????
        super(1, 'Rock');
        this.sprite = new SpriteItem(
            scene,
            { texture: "landTiles", frame: 4 },
            {
                x: coords.x,
                y: coords.y,
                pixelX: coords.pixelX,
                pixelY: coords.pixelY,
            },
            16,
            16
        );
        this.sprite.setDepth(1);
        this.destruct = new DestructItem();
        this.destruct.addResource(
            new GenericItem(ObjectItems.Stone, "stone", new InventoryItem())
        );
    }

    // public static clone(orig: GenericItem) {
    //     return new GenericItem(
    //         orig.id,
    //         orig.title,
    //         InventoryItem.clone(orig.getInventory())
    //     )
    // }
    public getDestruct() {
        return this.destruct;
    }

    public getSprite() {
        return this.sprite;
    }
}
