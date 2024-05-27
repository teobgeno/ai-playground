import { useRef, useState } from "react";
import { IRefPhaserGame, PhaserGame } from "./game/PhaserGame";
import { MainMenu } from "./game/scenes/MainMenu";
import { Game } from "./game/scenes/Game";
import "./App.css";

function App() {
    // The sprite can only be moved in the MainMenu Scene
    const [canMoveSprite, setCanMoveSprite] = useState(true);

    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef<IRefPhaserGame | null>(null);
    const [spritePosition, setSpritePosition] = useState({ x: 0, y: 0 });

    const moveSprite = () => {
        if (phaserRef.current) {
            const scene = phaserRef.current.scene as MainMenu;

            if (scene && scene.scene.key === "MainMenu") {
                // Get the update logo position
                scene.moveLogo(({ x, y }) => {
                    setSpritePosition({ x, y });
                });
            }
        }
    };

    const addSprite = () => {
        if (phaserRef.current) {
            const scene = phaserRef.current.scene;

            if (scene) {
                // Add more stars
                const x = Phaser.Math.Between(64, scene.scale.width - 64);
                const y = Phaser.Math.Between(64, scene.scale.height - 64);

                //  `add.sprite` is a Phaser GameObjectFactory method and it returns a Sprite Game Object instance
                const star = scene.add.sprite(x, y, "star");

                //  ... which you can then act upon. Here we create a Phaser Tween to fade the star sprite in and out.
                //  You could, of course, do this from within the Phaser Scene code, but this is just an example
                //  showing that Phaser objects and systems can be acted upon from outside of Phaser itself.
                scene.add.tween({
                    targets: star,
                    duration: 500 + Math.random() * 1000,
                    alpha: 0,
                    yoyo: true,
                    repeat: -1,
                });
            }
        }
    };

    // Event emitted from the PhaserGame component
    const currentScene = (scene: Phaser.Scene) => {
        setCanMoveSprite(scene.scene.key !== "MainMenu");
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
            <div style={{position:'relative'}}>
                <PhaserGame ref={phaserRef} currentActiveScene={currentScene} />
            
                <ul className="toolbar cf">
                    <li>
                        <a href="#" onClick={() => pickTool(1)} style={{paddingLeft:'10px'}}>
                            <i className="icon-home">⛏️</i>
                        </a>
                    </li>
                    <li>
                        <a href="#" style={{paddingLeft:'10px'}}>
                            <i className="icon-comments-alt">🌿</i>
                        </a>
                    </li>
                    <li>
                        <a href="#" onClick={() => pickTool(3)} style={{paddingLeft:'10px'}}>
                            <i className="icon-heart-empty">🌊</i>
                        </a>
                    </li>
                    <li>
                        <a href="#" style={{paddingLeft:'10px'}}>
                            <i className="icon-cloud"></i>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default App;
