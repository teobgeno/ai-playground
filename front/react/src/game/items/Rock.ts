import { BaseItem } from "./BaseItem";
import { InventoryItem } from "./InventoryItem";
import { DestructItem } from "./DestructItem";
import { SpriteItem } from "./SpriteItem";
import { GenericItem } from "./GenericItem";
import { CoordsData } from "../core/types";

export class Rock extends BaseItem {
    private scene: Phaser.Scene;
    public destruct: DestructItem;
    public sprite: SpriteItem;

    constructor(
        id: number,
        title: string,
        scene: Phaser.Scene,
        coords: CoordsData
    ) {
        super(id, title);
        this.sprite = new SpriteItem(
            scene,
            { texture: "Land", frame: 19 },
            coords.x,
            coords.y,
            coords.pixelX,
            coords.pixelY
        );
        this.destruct = new DestructItem();
        this.destruct.addResource(
            new GenericItem(10, "stone", new InventoryItem())
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
