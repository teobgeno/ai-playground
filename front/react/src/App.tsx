import { Storable } from "./game/items/types";
import { EventBus } from "./game/EventBus";
import { useRef, useState, useEffect } from "react";
import { IRefPhaserGame, PhaserGame } from "./game/PhaserGame";
import { Game } from "./game/scenes/Game";
import { ChatWidget } from "./components/ChatWidget";
import { Hotbar } from "./components/Hotbar";
import { Inventory } from "./components/Inventory";
import "./App.css";

export type Message = {
    isPlayer: boolean;
    characterName: string;
    content: string;
};

function App() {
    const [inventoryHotbarItems, setInventoryHotbarItems] = useState<Array<Storable | null>>([]);
    const [inventoryRestItems, setInventoryRestItems] = useState<Array<Storable | null>>([]);

    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef<IRefPhaserGame | null>(null);

    // Event emitted from the PhaserGame component
    const currentScene = (scene: Phaser.Scene) => {
        setInventoryHotbarItems((scene as Game).getInventoryItems(true));
        setInventoryRestItems((scene as Game).getInventoryItems(false));
    };

 

    const setActiveItem = (item: Storable) => {
        if (phaserRef.current) {
            const scene = phaserRef.current.scene as Game;
            if (scene) {
                scene.setActiveItem(item);
            }
        }
    };

    useEffect(() => {
        EventBus.on("on-character-inventory-update", () => {
            const scene = phaserRef?.current?.scene as Game;
            if(scene) {
                setInventoryHotbarItems((scene as Game).getInventoryItems(true));
                setInventoryRestItems((scene as Game).getInventoryItems(false));
            }
        });

        return () => {
            EventBus.removeListener("on-character-inventory-update");
            EventBus.removeListener("on-character-controller-i-key");
            EventBus.removeListener("on-chat-start-conversation");
            EventBus.removeListener("on-chat-add-message");
            EventBus.removeListener("on-chat-end-conversation");
        };
    }, []);

    //TODO::add toolbar
    //https://codepen.io/cameronbaney/pen/nPpEqw
    //http://cssstars.com/mac-os-dock-menu-css3/
    //https://codepen.io/ZaynAlaoudi/pen/EorLMm
    return (
        <div id="app">
            <div style={{ position: "relative" }}>
                <PhaserGame ref={phaserRef} currentActiveScene={currentScene} />
                <Hotbar items={inventoryHotbarItems} setActiveItem={setActiveItem} />
            </div>
            <ChatWidget />
            <Inventory hotbarItems={inventoryHotbarItems} restItems={inventoryRestItems}/>
        </div>
    );
}

export default App;
