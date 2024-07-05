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

export class Tree extends BaseItem implements MapObject, MapObjectDestructable, MapObjectInteractable {
    private mapManager: MapManager;
    public sprites: Array<SpriteItem> = [];
    private destruct: DestructItem;
    private interactive: InteractiveItem;

    constructor(
        scene: Phaser.Scene,
        mapManager: MapManager,
        coords: CoordsData
    ) {
        //TODO:: generate id ????
        super(Utils.generateId(), ObjectId.Tree, "Tree");
        this.mapManager = mapManager;
        this.sprites.push(
            new SpriteItem(
                scene,
                { texture: "map", frame: "tree_branch" },
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

        this.sprites.push(
            new SpriteItem(
                scene,
                { texture: "map", frame: "tree_top" },
                {
                    x: coords.x,
                    y: coords.y,
                    pixelX: coords.pixelX,
                    pixelY: coords.pixelY - 77,
                },
                16,
                16
            )
        );
        this.sprites[1].setDepth(3);


        this.sprites.push(
            new SpriteItem(
                scene,
                { texture: "map", frame: "tree_cut" },
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
        this.sprites[2].setDepth(1);
        this.sprites[2].setAlpha(0);

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

    public getSprite() {
        //return this.sprite;
    }

    public getDestruct() {
        return this.destruct;
    }

    public destructItem(resources: Array<GenericItem>) {
        for (const resource of resources) {
            const rand =  Math.floor(Math.random() * (6 - 1) + 1);
            resource.getInventory().setAmount(rand);
        }
        return resources;
    }

    public getInteractive() {
        return this.interactive;
    }

    public interactWithItem() {
        console.log("destruct tree");
        this.sprites[0].setAlpha(0);
        this.sprites[1].setAlpha(0);
        this.sprites[2].setAlpha(1);
    }
}
