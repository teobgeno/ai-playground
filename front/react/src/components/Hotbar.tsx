import { InventoryItem } from "../game/characters/types";
import "./Hotbar.css";

export type HotbarProps = {
    items: Array<InventoryItem>;
};

export function Hotbar(props: HotbarProps) {
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
                {/* {props.items.map((item) => {
                    // Your conditional logic here
                    if (item) {
                        return (
                            <li key={item.id} style={{ paddingLeft: "10px" }}>
                                <a
                                    href="#"
                                    onClick={() => pickTool(item.cursorType)}
                                >
                                    <i className="icon-home">{item.icon}</i>
                                </a>
                            </li>
                        );
                    } else {
                        return (
                            <li style={{ paddingLeft: "10px" }}>
                                <a href="#">
                                    <i className="icon-homer"></i>
                                </a>
                            </li>
                        );
                    }
                })} */}

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
