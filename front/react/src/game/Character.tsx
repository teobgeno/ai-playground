import Phaser, { Tilemaps } from "phaser";
import { GridEngine, Position } from "grid-engine";

class Character extends Phaser.GameObjects.Sprite {
    constructor(
        scene: Phaser.Scene,
        texture: string,
        gridEngine: GridEngine,
        map: Tilemaps.Tilemap
    ) {
        super(scene, 0, 0, texture);
    }

    public doAction() {
        console.log("character ok");
    }
}
export default Character;
