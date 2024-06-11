import { useRef, useState, useEffect } from "react";
import { IRefPhaserGame, PhaserGame } from "./game/PhaserGame";
import { Game } from "./game/scenes/Game";
import { ChatWidget } from "./components/ChatWidget";
import { Hotbar } from "./components/Hotbar";
import "./App.css";

export type Message = {
    isPlayer: boolean;
    characterName: string;
    content: string;
};

function App() {

    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef<IRefPhaserGame | null>(null);

    // Event emitted from the PhaserGame component
    const currentScene = (scene: Phaser.Scene) => {
        // console.log(scene.scene.key)
        // setCanMoveSprite(scene.scene.key !== "MainMenu");
        console.log((scene as Game).getHotbarItems());
        
    };

    const pickTool = (tool: number) => {
        if (phaserRef.current) {
            const scene = phaserRef.current.scene as Game;

            if (scene) {
                scene.setActiveTool(tool);
            }
        }
    };

    //TODO::add toolbar
    //https://codepen.io/cameronbaney/pen/nPpEqw
    //http://cssstars.com/mac-os-dock-menu-css3/
    //https://codepen.io/ZaynAlaoudi/pen/EorLMm
    return (
        <div id="app">
            <div style={{ position: "relative" }}>
                <PhaserGame ref={phaserRef} currentActiveScene={currentScene} />
                <Hotbar />
            </div>
            <ChatWidget />
           
        </div>
    );
}

export default App;
