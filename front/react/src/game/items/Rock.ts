import { MapManager } from "../MapManager";
import { BaseItem } from "./BaseItem";
import { SpriteItem } from "./SpriteItem";
import { DestructItem } from "./DestructItem";
import { InteractiveItem } from "./InteractiveItem";
import { GenericItem } from "./GenericItem";
import {
    CoordsData,
    MapObject,
    MapObjectInteractable,
    MapObjectDestructable,
    ObjectId,
} from "../core/types";
import { Utils } from "../core/Utils";

export class Rock
    extends BaseItem
    implements MapObject, MapObjectDestructable, MapObjectInteractable
{
    private mapManager: MapManager;
    public sprites: Array<SpriteItem> = [];
    private destruct: DestructItem;
    private interactive: InteractiveItem;

    constructor(
        scene: Phaser.Scene,
        mapManager: MapManager,
        coords: CoordsData
    ) {
        super(Utils.generateId(), ObjectId.Rock, "Rock");
        this.mapManager = mapManager;
        this.sprites.push(
            new SpriteItem(
                scene,
                { texture: "map", frame: "rock" },
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

        this.destruct = new DestructItem();
        this.destruct.setDestructionResult((resources) => {
            return this.destructItem(resources);
        });

        this.interactive = new InteractiveItem();
        this.interactive.setSprites(this.sprites);
        this.interactive.setInteractiveObjectIds([ObjectId.PickAxe]);
        this.interactive.setInteractionResult(() => {
            this.interactWithItem();
        });
        this.interactive.startInteraction();
    }

    public setResource(resource: GenericItem) {
        this.destruct.addResource(resource);
    }

    private toggleCollisions(collide: boolean) {
        this.mapManager.setTileCollition(
            this.sprites[0].getX(),
            this.sprites[0].getY(),
            collide
        );
    }

    private addMapObject() {
        this.mapManager.setPlotLandCoords(
            this.sprites[0].getX(),
            this.sprites[0].getY(),
            this
        );
    }

    private removeMapObject() {
        this.mapManager.setPlotLandCoords(
            this.sprites[0].getX(),
            this.sprites[0].getY(),
            null
        );
    }

    public getSprite() {
        return this.sprites[0];
    }

    public getDestruct() {
        return this.destruct;
    }

    public destructItem(resources: Array<GenericItem>) {
        for (const resource of resources) {
            const rand = Math.floor(Math.random() * (6 - 1) + 1);
            resource.getInventory().setAmount(rand);
        }
        return resources;
    }

    public getInteractive() {
        return this.interactive;
    }

    public interactWithItem() {
        //item (axe), character -> addInventory
        this.sprites[0].setAlpha(0);
        this.toggleCollisions(false);
        this.removeMapObject();
        this.sprites[0].destroy();
    }
}
