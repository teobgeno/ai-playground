import { InventoryItem } from "../game/characters/types";
import "./Hotbar.css";

export type HotbarProps = {
    items: Array<InventoryItem>;
    characterName: string;
    content: string;
};

export function Hotbar() {
    
    const pickTool = (tool: number) => {
        // if (phaserRef.current) {
        //     const scene = phaserRef.current.scene as Game;

        //     if (scene) {
        //         scene.setActiveTool(tool);
        //     }
        // }
    };

    return (
      <>
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
      </>
    );
}
