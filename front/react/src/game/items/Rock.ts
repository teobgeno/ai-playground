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
import { Cursor } from "../cursors/types";

export class Rock extends BaseItem implements MapObject {
    public objectType: MapObjectType = MapObjectType.Rock;
    public destruct: DestructItem;
    public sprite: SpriteItem;
    public activeCursor: Cursor | null;

    constructor(scene: Phaser.Scene, coords: CoordsData) {
        //TODO:: generate id ????
        super(ObjectItems.Rock, "Rock");
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

        this.sprite.getSprite().setInteractive({
            cursor: "cursor",
        });
        this.sprite.getSprite().on("pointerover", () => this.toggleCursorExecution(true));
        this.sprite.getSprite().on("pointerout",  () => this.toggleCursorExecution(false));
    }

    // public static clone(orig: GenericItem) {
    //     return new GenericItem(
    //         orig.id,
    //         orig.title,
    //         InventoryItem.clone(orig.getInventory())
    //     )
    // }
    public setExternalActiveCursor(cursor: Cursor | null) {
        this.activeCursor = cursor;
    }

    private toggleCursorExecution = (canExecute: boolean) => {
        if(this.activeCursor && typeof this.activeCursor?.getItem !== "undefined" && this.activeCursor?.getItem().id === ObjectItems.PickAxe) {
           if(typeof this.activeCursor?.setCanExecute !== "undefined") {
            this.activeCursor?.setCanExecute(canExecute);
           }
        }
    };

    public interactWithItem() {
        //item (axe), character -> addInventory
        console.log('destruct stone')
    }

    public getDestruct() {
        return this.destruct;
    }

    public getSprite() {
        return this.sprite;
    }
}
