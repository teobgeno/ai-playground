import { GridEngine } from "grid-engine";
import { Humanoid } from "./Humanoid";
export class Npc extends Humanoid {
    private gridEngine: GridEngine;
    constructor(
        scene: Phaser.Scene,
        texture: string,
        gridEngine: GridEngine,
        id: string
    ) {
        super(scene, texture, id);
        this.gridEngine = gridEngine;
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

    public initConversationWithPlayer(){

    }

    public initConversationWithNpc(){

    }
}
