import { Game } from "../scenes/Game";
import { SpriteItem } from "../items/SpriteItem";
import { InteractiveItem } from "../items/InteractiveItem";
import { Seed } from "./Seed";
import { Crop } from "./Crop";
import { LandState, LandElements } from "./types";
import { Storable } from "../items/types";
import {
    CoordsData,
    MapObject,
    MapObjectInteractable,
    ObjectId,
} from "../core/types";
import { Utils } from "../core/Utils";
export class FarmLand implements MapObject, MapObjectInteractable {
    public id: number;
    public objectId: ObjectId = ObjectId.FarmLand;
    private crop: Crop | null;
    private scene: Phaser.Scene;
    public sprites: Array<SpriteItem> = [];
    private interactive: InteractiveItem;
    private tooltip:Phaser.GameObjects.Container;
    private tooltipText: Phaser.GameObjects.Text;
    private landState: number;
    private elements: LandElements = {
        water: 0,
        fertilizer: 0,
    };
    public lastTimestamp: number;

    //status plowed, planted

    constructor(scene: Phaser.Scene, coords: CoordsData) {
        //https://github.com/Blockost/farming-rpg/blob/master/src/app/objects/crops/crop.ts
        //https://github.com/amcolash/farming-game/blob/master/src/farm/land.ts
        this.scene = scene;
        this.id = Utils.generateId();
        this.sprites.push(
            new SpriteItem(
                scene,
                { texture: "land", frame: 19 },
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
        this.sprites[0].setAlpha(0.4);

        this.interactive = new InteractiveItem();
        this.interactive.setScene(scene);
        this.interactive.setSprites(this.sprites[0]);
        this.interactive.setSelfInteraction(true);
        this.interactive.setInteractiveObjectIds([ObjectId.WaterCan, ObjectId.CornSeed]);
        this.interactive.setInteractionResult(
            (selectedObject: Storable | null) => {
                this.interactWithItem(selectedObject);
            }
        );
        this.interactive.setInteractionFactors(
            (selectedObject: Storable | null) => {
                return this.interactFactors(selectedObject);
            }
        );


        this.interactive.setInteractionOnHover(
            () => {
                if(this.crop) {
                    this.tooltip.setVisible(true);
                }
            }
        );

        this.interactive.setInteractionOnHoverOut(
            () => {this.tooltip.setVisible(false);}
        );

        
        this.interactive.startInteraction();

        const tooltipX = this.sprites[0].getSprite().x +32
        const tooltipY =  this.sprites[0].getSprite().y - 20
        const textPadding = 10
        this.tooltipText = this.scene.add.text(textPadding, textPadding, '', { color: '#000' })
        const background = this.scene.add.rectangle(0, 0, 100 + (textPadding * 2), 80 + (textPadding * 2), 0xffffff).setOrigin(0, 0);
        this.setTooltipText();
        
        // // Put both text and background in a cointainer to easily position them
        this.tooltip = this.scene.add.container(tooltipX, tooltipY)
        this.tooltip.add(background)
        this.tooltip.add(this.tooltipText)
        this.tooltip.setDepth(10)
        this.tooltip.setVisible(false);

        // this.sprite = scene.add.sprite(
        //     this.pixelX,
        //     this.pixelY,
        //     "fence",
        //     'sprite8'
        // );

        // const r = Math.floor(Math.random() * 10)
        // if(r > 5) {
        //   t.setTint(Phaser.Display.Color.GetColor(190, 190, 190));
        // }

        //this.sprite.setAlpha(0.4);

        // this.sprite = scene.add.sprite(x+16, y, "crops", 30);
        // this.sprite.setInteractive({ useHandCursor: true });
        // this.sprite.setDepth(2);

        // this.life = 90;
        // this.health = 0.002;
        // this.health = ((( this.health + 1) / 2) * 0.4) + 0.6;

        //this.sprite.setTint(Phaser.Display.Color.GetColor( this.health * 255,  this.health * 255,  this.health * 255));
        //this.sprite.setTint(0xff0000)
        //this.bar = scene.add.rectangle(x - 16, y - 16, 0, 2, 0x00ee00);
    }

    private interactWithItem = (selectedObject: Storable | Seed | null) => {
        if (selectedObject) {
            //console.log(selectedObject);
            switch (selectedObject.objectId) {
                case ObjectId.WaterCan:
                    this.elements.water = 100;
                    this.sprites[0].getSprite().setTint(Phaser.Display.Color.GetColor(190, 190, 190));
                    break;
                case ObjectId.CornSeed:{
                    const cloneSeed = Seed.clone((selectedObject as Seed));
                    cloneSeed.getInventory().amount = 1;
                    this.createCrop(cloneSeed);
                    this.plantCrop();
                    this.interactive.setCursorExecution(false);
                }
                break;
            }
        }
        if (!selectedObject && this.landState === LandState.READY) {
            (this.scene as Game).addPlayerTask("harvest", this);
            console.log("harvest");
        }
    };

    public interactFactors = (selectedObject: Storable | null) => {
        if (selectedObject) {
            switch (selectedObject.objectId) {
                case ObjectId.WaterCan:
                    return true;
                case ObjectId.CornSeed:
                    if(this.landState === LandState.PLOWED && selectedObject.getInventory().amount > 0) {
                        return true;
                    }
                    return false;
                default:
                    return true;
            }
        }
        return false;
    };

    public init() {
        this.landState = LandState.PLOWED;
        this.sprites[0].setAlpha(1);
    }

    public rollbackLand() {
        this.sprites[0].destroy();
    }

    public rollbackCrop() {
        this.destroyCrop();
    }

    public getState() {
        return this.landState;
    }

    private evaporateWater() {
        if (this.lastTimestamp) {
            const diff = (Utils.getTimeStamp() - this.lastTimestamp);
            const checkEvery = 5000;
            if((diff * 1000) >= checkEvery) {

                const waterSubstract = Math.floor((diff * 1000)/checkEvery);
                console.log('Wtr: ' + (diff * 1000)/checkEvery)
                this.elements.water = this.elements.water - waterSubstract >=0 ? this.elements.water - waterSubstract : 0;

                let tintPerc = Math.floor(Math.abs((65 * (this.elements.water/100)) - 65));
                tintPerc = tintPerc <= 65 ? tintPerc : 65;
                this.sprites[0].getSprite().setTint(Phaser.Display.Color.GetColor(190 + tintPerc, 190 + tintPerc, 190 + tintPerc));

                this.lastTimestamp = Utils.getTimeStamp();
            }
        } else {
            this.lastTimestamp = Utils.getTimeStamp();
        }  
    }

    public createCrop(seed: Seed) {
        if (this.landState === LandState.PLOWED) {
            this.crop = new Crop(
                this.scene,
                seed,
                {x: this.sprites[0].getX(), y: this.sprites[0].getY(), pixelX:  this.sprites[0].getPixelX(), pixelY:  this.sprites[0].getPixelY()}
            );
        }
    }

    public plantCrop() {
        if (this.crop && this.landState === LandState.PLOWED) {
            this.crop.init();
            this.landState = LandState.PLANTED;
        }
    }

    public executeHarvestCrop() {
        return this.crop?.executeHarvest();
    }

    public endCrop() {
        this.landState = LandState.PLOWED;
        this.destroyCrop();
    }

    public destroyCrop() {
        //this.removeInteractive();
        //this.interactive.setSelfInteraction(false);
        this.crop?.remove();
        this.crop = null;
        this.updateTile();
    }

    //TODO:: change cursor when crop ready
    //https://github.com/phaserjs/examples/blob/master/public/src/input/cursors/custom%20cursor.js
    //https://www.html5gamedevs.com/topic/38318-change-cursor-on-demand/
    //https://labs.phaser.io/edit.html?src=src/input/cursors/custom%20cursor.js
    public update(time: number) {
        
        if(this.crop) {
            this.setTooltipText();
        }

        if(this.elements.water > 0) {
            this.evaporateWater();
        }
       
        if (this.landState === LandState.PLANTED) {
            this.crop?.updateGrow(time, this.elements);
            if (this.crop?.isFullGrown()) {
                this.landState = LandState.READY;
                //this.interactive.setSelfInteraction(true);
            }
        }
        
    }

    updateTile() {
        let frame = 0;
        switch (this.landState) {
            case LandState.PLOWED:
                frame = 19;
                break;
            case LandState.PLANTED:
                frame = 19;
                break;
            case LandState.READY:
                break;
            default:
                frame = 18;
                break;
        }

        this.sprites[0].setFrame(frame);
    }

    public getSprite() {
        return this.sprites[0];
    }

    public getInteractive() {
        return this.interactive;
    }

    private setTooltipText() {
        const texts = [];
       
        if(this.crop) {
            texts.push( '💧: ' + Math.floor(this.elements.water) + '\n');
            texts.push( '✅: '+ this.crop?.getSeed().currentGrowthStagePercentage + '%\n');
            texts.push( '🌱: ' + (this.crop?.getSeed().currentFrame + 1) + '/'+ (this.crop?.getSeed().getCurrentFrames().length) );
        }

        this.tooltipText.setText(texts);
    }
}
