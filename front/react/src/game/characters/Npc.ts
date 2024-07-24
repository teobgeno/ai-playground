import { Game } from "../scenes/Game";
import { GridEngine } from "grid-engine";
import { Humanoid } from "./Humanoid";
import { InteractiveItem } from "../items/InteractiveItem";
import { SpriteItem } from "../items/SpriteItem";
import {
    MapObjectInteractable,
} from "../core/types";
export class Npc extends Humanoid implements MapObjectInteractable {
    private gridEngine: GridEngine;
    private interactive: InteractiveItem;
    public sprites: Array<SpriteItem> = [];

    constructor(
        scene: Phaser.Scene,
        texture: string,
        gridEngine: GridEngine,
        id: string,
    ) {
        super(scene, texture, id);
        this.gridEngine = gridEngine;

        this.sprites.push(
            new SpriteItem(
                scene,
                { texture: texture, frame: id },
                {
                    x: this.x,
                    y: this.y,
                    pixelX: 0,
                    pixelY: 0,
                },
                16,
                16,
                true
            )
        );
        this.sprites[0].addExisting(this);
    }

    public init() {
        
        this.interactive = new InteractiveItem();
        this.interactive.setSprites(this.sprites[0]);
        this.interactive.setSelfInteraction(true);
        this.interactive.setScene(this.scene);
        this.interactive.setInteractiveObjectIds([]);
        this.interactive.setInteractionResult(() => {
            this.interactWithItem();
        });
        this.interactive.startInteraction();
        this.interactive.setSelfInteractionCursor('assets/cursors/axe.cur')
    }

    public getInteractive() {
        return this.interactive;
    }

    public interactWithItem() {
       (this.scene as Game).addPlayerTask("conversation", this);
    }

    public initConversationWithPlayer() {
        //TODO::check if npc can/want to talk to player
        // const convGuid = this.chatManager.initConversation();
        // this.chatManager.addPlayerParticipant(convGuid);
        // this.chatManager.addParticipant(this, convGuid);
        // this.chatManager.startConversation(convGuid);
    }


    // public startTalk() {
    //     console.log('ok talk npc')
    //     this.chatManager.generateNpcResponse(this.getId());
    // }

    // public toggleInteraction(doInteract: boolean) {
    //     doInteract
    //         ? this.resumeInteraction()
    //         : this.pauseInteraction();
    // }

    public pauseInteraction() {
        if (this.input && this.input.enabled) {
            this.disableInteractive();
        }
    }

    public resumeInteraction() {
        if (this.input && !this.input.enabled) {
            this.setInteractive();
        }
    }
}
