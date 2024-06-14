import { GridEngine } from "grid-engine";
import { Humanoid } from "./Humanoid";
import { ChatManager } from "../ChatManager";
export class Npc extends Humanoid {
    private gridEngine: GridEngine;
    private chatManager: ChatManager;
   
    constructor(
        scene: Phaser.Scene,
        texture: string,
        gridEngine: GridEngine,
        id: string,
        chatManager: ChatManager
    ) {
        super(scene, texture, id);
        this.gridEngine = gridEngine;
        this.chatManager = chatManager;
    }

    public init() {
        this.setInteractive({ cursor: "url(assets/cursors/axe.cur), pointer" });
        //this.disableInteractive();
        //.setInteractive( { useHandCursor: true  } );
        //https://codepen.io/NickHatBoecker/pen/zYdBoNb
        this.on("pointerup", () => {
            //TODO::set idle state and create options menu for interaction wuih npc
            this.initConversationWithPlayer();
            // setTimeout(() => {
            //     console.log("sadsad");
            //     this.disableInteractive();
            // }, 2000);
        });
    }

    public initConversationWithPlayer() {
        //TODO::check if npc can/want to talk to player
        const convGuid = this.chatManager.initConversation();
        this.chatManager.addPlayerParticipant(convGuid);
        this.chatManager.addParticipant(this, convGuid);
        this.chatManager.startConversation(convGuid);
    }

    public initConversationWithNpc() {}

    public startTalk() {
        console.log('ok talk npc')
        this.chatManager.generateNpcResponse(this.getId());
    }

    public toggleInteraction(doInteract: boolean) {
        doInteract
            ? this.resumeInteraction()
            : this.pauseInteraction();
    }

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
