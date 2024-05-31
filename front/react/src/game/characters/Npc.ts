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
        this.on("pointerup", () => {
            this.initConversationWithPlayer();
            // setTimeout(() => {
            //     console.log("sadsad");
            //     this.disableInteractive();
            // }, 2000);
        });
    }

    public initConversationWithPlayer() {
        const convGuid = this.chatManager.initConversation();
        this.chatManager.addParticipants(this, convGuid);
        this.chatManager.addPlayerParticipant(convGuid);
    }

    public initConversationWithNpc() {}
}
