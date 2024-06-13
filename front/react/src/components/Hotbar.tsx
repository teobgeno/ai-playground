import { InventoryItem } from "../game/characters/types";
import { useState, useEffect } from "react";
import { EventBus } from "../game/EventBus";
import "./Hotbar.css";
import { CursorType } from "../game/cursors/types";

export type HotbarProps = {
    items: Array<InventoryItem>;
    setActiveItem: (item: InventoryItem) => void;
};

export function Hotbar(props: HotbarProps) {
    const [activeItemId, setActiveItemId] = useState(0);

    useEffect(() => {
        EventBus.on("on-character-controller-esc-key", () => {
            deSelectItem();
        });

        return () => {
            EventBus.removeListener("on-character-controller-esc-key");
        };
    }, []);

    const handleSelectItem = (item: InventoryItem) => {
        if(activeItemId === item.id) {
            deSelectItem();
        } else{
            setActiveItemId(item.id);
            props.setActiveItem(item);
        }
    };

    const deSelectItem = () => {
        setActiveItemId(0);
        props.setActiveItem({
            id: 0,
            isStackable: false,
            amount: 0,
            icon: "",
            cursorType: CursorType.NONE,
        });
    }

    return (
        <>
            <ul className="toolbar cf">
                {props.items.map((item, i) => {
                    // Your conditional logic here
                    if (item) {
                        return (
                            <li
                                key={i}
                                className={
                                    activeItemId === item.id ? "active_item" : ""
                                }
                            >
                                <a href="#" onClick={() => handleSelectItem(item)}>
                                    <i className="icon-home">{item.icon}</i>
                                    {item.amount}
                                </a>
                            </li>
                        );
                    } else {
                        return (
                            <li key={i}>
                                <a href="#">
                                    <i className="icon-homer"></i>
                                </a>
                            </li>
                        );
                    }
                })}

                {/* <li>
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
                </li> */}
            </ul>
        </>
    );
}
