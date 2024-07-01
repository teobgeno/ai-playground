import { BaseItem } from "./BaseItem";
import { InventoryItem } from "./InventoryItem";
import { DestructItem } from "./DestructItem";
import { SpriteItem } from "./SpriteItem";
import { GenericItem } from "./GenericItem";
import {
    CoordsData,
    MapObject,
    ObjectId,
    TextureData,
} from "../core/types";
import { Utils } from "../core/Utils";
export class Fence extends BaseItem implements MapObject {
    public objectId: ObjectId = ObjectId.Fence;
    public destruct: DestructItem;
    public sprites: Array<SpriteItem> = [];

    constructor(
        scene: Phaser.Scene,
        coords: CoordsData,
        texture: TextureData,
        padX: number,
        padY: number
    ) {
        super(Utils.generateId(), "Fence Part");
        this.sprites.push(new SpriteItem(
            scene,
            { texture: texture.texture, frame: texture.frame },
            {
                x: coords.x,
                y: coords.y,
                pixelX: coords.pixelX,
                pixelY: coords.pixelY,
            },
            padX,
            padY
        ));
        this.sprites[0].setDepth(2);
        this.destruct = new DestructItem();
        this.destruct.addResource(
            new GenericItem(ObjectId.Wood, "wood", new InventoryItem())
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
        return this.sprites[0];
    }
}
