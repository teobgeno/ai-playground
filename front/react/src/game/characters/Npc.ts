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
        this.id = id;
    }
}
