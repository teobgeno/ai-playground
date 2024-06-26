import { Storable } from "../game/items/types";
import { InventoryItem } from "../game/items/InventoryItem";
import { useState, useEffect } from "react";
import { EventBus } from "../game/EventBus";
import "./Hotbar.css";


export type HotbarProps = {
    items: Array<Storable | null>;
    setActiveItem: (item: Storable) => void;
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

    useEffect(() => {
        console.log("change props");
        const activeItem = props.items.find((x) => x?.id === activeItemId);
        if (!activeItem) {
            deSelectItem();
        }
    }, [props.items]);

    const handleSelectItem = (item: Storable) => {
        if (activeItemId === item.id) {
            deSelectItem();
        } else {
            if (activeItemId) {
                deSelectItem();
            }
            setActiveItemId(item.id);
            props.setActiveItem(item);
        }

        // if (activeItemId === item.id) {
        //     deSelectItem();
        // } else {
        //     setActiveItemId(item.id);
        //     props.setActiveItem(item);
        // }
    };

    const deSelectItem = () => {
        setActiveItemId(0);
        props.setActiveItem({
            id: 0,
            getInventory() {
                return new InventoryItem()
            },
        });
    };

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
                                    activeItemId === item.id
                                        ? "active_item"
                                        : ""
                                }
                            >
                                <a
                                    href="#"
                                    onClick={() => handleSelectItem(item)}
                                >
                                    <i className="icon-home">{item.getInventory().icon}</i>

                                    {item.getInventory().isStackable && (
                                        <>
                                            <div style={{ fontSize: "16px" }}>
                                                {item.getInventory().amount}
                                            </div>
                                        </>
                                    )}
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
            </ul>
        </>
    );
}
