//import { Boot } from "./scenes/Boot";
//import { GameOver } from "./scenes/GameOver";
import { Game as MainGame } from "./scenes/Game";
//import { MainMenu } from "./scenes/MainMenu";
import { Game } from "phaser";
//import { Preloader } from "./scenes/Preloader";
import GridEngine from "grid-engine";

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig


// const CANVAS_WIDTH = 32;
// const CANVAS_HEIGHT = 18;
// const TILE_WIDTH = 32;
// const TILE_HEIGHT = 32;

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    parent: "game-container",
    backgroundColor: "#028af8",
    physics: {
        default: "arcade",
        arcade: {
            debug: true,
        },
    },
    render: {
        antialias: false,
        pixelArt: true,
      },
    plugins: {
        scene: [
            {
                key: "gridEngine",
                plugin: GridEngine,
                mapping: "gridEngine",
            },
        ],
    },
    // scale: {
    //     //mode: Phaser.Scale.FIT,
    //     width: CANVAS_WIDTH * TILE_WIDTH,
    //     height: CANVAS_HEIGHT * TILE_HEIGHT,
    //     autoCenter: Phaser.Scale.CENTER_BOTH,
    //   },
    //scene: [Boot, Preloader, MainMenu, MainGame, GameOver],
    scene: [MainGame],
};

const StartGame = (parent: string) => {
    return new Game({ ...config, parent });
};

export default StartGame;

