import { useRef, useState, useEffect } from "react";
import { IRefPhaserGame, PhaserGame } from "./game/PhaserGame";
import { MainMenu } from "./game/scenes/MainMenu";
import { Game } from "./game/scenes/Game";
import { EventBus } from "./game/EventBus";
import "./App.css";

export type Message = {
    isPlayer: boolean;
    characterName: string;
    content: string;
};

function App() {
    // The sprite can only be moved in the MainMenu Scene
    const [canMoveSprite, setCanMoveSprite] = useState(true);
    const [isChatModalVisible, setIsChatModalVisible] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);

    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef<IRefPhaserGame | null>(null);
    const [spritePosition, setSpritePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        EventBus.on("on-talk-message-send", (message: Message) => {
            setMessages((messages) => [
                ...messages,
                {
                    isPlayer: message.isPlayer,
                    characterName: message.characterName,
                    content: message.content,
                },
            ]);
        });
        return () => {
            EventBus.removeListener("on-talk-message-send");
        };
    }, []);

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
            <div style={{ position: "relative" }}>
                <PhaserGame ref={phaserRef} currentActiveScene={currentScene} />

                <ul className="toolbar cf">
                    <li>
                        <a
                            href="#"
                            onClick={() => pickTool(1)}
                            style={{ paddingLeft: "10px" }}
                        >
                            <i className="icon-home">⛏️</i>
                        </a>
                    </li>
                    <li>
                        <a
                            href="#"
                            onClick={() => pickTool(2)}
                            style={{ paddingLeft: "10px" }}
                        >
                            <i className="icon-comments-alt">🌿</i>
                        </a>
                    </li>
                    <li>
                        <a
                            href="#"
                            onClick={() => pickTool(3)}
                            style={{ paddingLeft: "10px" }}
                        >
                            <i className="icon-heart-empty">🌊</i>
                        </a>
                    </li>
                    <li>
                        <a href="#" style={{ paddingLeft: "10px" }}>
                            <i className="icon-cloud"></i>
                        </a>
                    </li>
                </ul>
            </div>
            {isChatModalVisible && (
                <div id="container">
                    <div className="container-inner">
                        <div className="content">
                            <p>Do you want to Continue?</p>
                            <textarea></textarea>
                        </div>
                        <div className="buttons">
                            <button type="button" className="confirm">
                                Confirm
                            </button>
                            <button type="button" className="cancel">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/*chat*/}
            <section className="avenue-messenger">
                <div className="menu">
                    <div className="items">
                        <span>
                            <a href="#" title="Minimize">
                                —
                            </a>
                            <br />

                            <a href="#" title="End Chat">
                                ✕
                            </a>
                        </span>
                    </div>
                    <div className="button">...</div>
                </div>
                <div className="agent-face">
                    <div className="half">
                        <img
                            className="agent circle"
                            src="https://www.avatarsinpixels.com/Public/images/previews/minipix2.png"
                            alt="Jesse Tino"
                        />
                    </div>
                </div>
                <div className="chat">
                    <div className="chat-title">
                        <h1>Jesse Tino</h1>
                        <h2>RE/MAX</h2>
                    </div>
                    <div className="messages">
                        <div className="messages-content" />

                        {messages.map((message, index) => (
                            <span key={index}>
                                {message.isPlayer ? (
                                    <div className="message message-personal new">
                                        {message.content}
                                        <div className="timestamp">13:4</div>
                                        <div className="checkmark-sent-delivered">
                                            ✓
                                        </div>
                                        <div className="checkmark-read">✓</div>
                                    </div>
                                ) : (
                                    <div className="message new">
                                        <figure className="avatar">
                                            <img src="https://www.avatarsinpixels.com/Public/images/previews/minipix2.png" />
                                        </figure>
                                        {message.content}
                                        <div className="timestamp">13:20</div>
                                        <div className="checkmark-sent-delivered">
                                            ✓
                                        </div>
                                        <div className="checkmark-read">✓</div>
                                    </div>
                                )}
                            </span>
                        ))}
                    </div>
                    <div className="message-box">
                        <textarea
                            className="message-input"
                            placeholder="Type message..."
                            defaultValue={""}
                        />
                        <button type="submit" className="message-submit">
                            Add
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default App;
