import { Storable } from "../game/items/types";
import { ObjectId } from "../game/core/types";
import { InventoryItem } from "../game/items/InventoryItem";
import { useState, useEffect } from "react";
import { EventBus } from "../game/EventBus";
import "./Hotbar.css";


export type HotbarProps = {
    items: Array<Storable | null>;
    setActiveItem: (item: Storable) => void;
};

export function Hotbar(props: HotbarProps) {
    const [activeItemId, setActiveItemId] = useState<ObjectId>(ObjectId.None);

    useEffect(() => {
        EventBus.on("on-character-controller-esc-key", () => {
            deSelectItem();
        });

    }, []);

    useEffect(() => {
        console.log("change props");
        const activeItem = props.items.find((x) => x?.objectId === activeItemId);
        if (!activeItem) {
            deSelectItem();
        }
    }, [props.items]);

    const handleSelectItem = (item: Storable) => {
        if (activeItemId === item.objectId) {
            deSelectItem();
        } else {
            if (activeItemId) {
                deSelectItem();
            }
            setActiveItemId(item.objectId);
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
        setActiveItemId(ObjectId.None);
        props.setActiveItem({
            id: 0,
            objectId: ObjectId.None,
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
                                    activeItemId === item.objectId
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
