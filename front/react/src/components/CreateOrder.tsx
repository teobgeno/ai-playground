import { useState } from "react";
import { MapObject } from "../game/core/types";
import "./CreateOrder.css";

export type CreateOrderProps = {
    items: Array<MapObject>;
};

export function CreateOrder(props: CreateOrderProps) {
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const handleOpenModal = () => {
        setModalIsOpen(true);
    };

    const handleCloseModal = () => {
        setModalIsOpen(false);
    };

    const data = [];
    for (const item of props.items) {
        data.push(<div key={item.id}>{item.id}</div>);
    }

    return (
        <>
            <button
                onClick={() => handleOpenModal()}
                disabled={props.items.length === 0}
            >
                Order
            </button>
            {modalIsOpen && (
                <div id="myModal" className="order-modal">
                    <div
                        className="order-modal-content"
                        onClick={() => handleCloseModal()}
                    >
                        <span className="order-modal-close">&times;</span>
                        {data}
                        {/* {props.items.map((item, i) => {
                            return (
                                <>
                                    <div key={i}>{item.id}</div>
                                </>
                            );
                        })} */}
                    </div>
                </div>
            )}
        </>
    );
}
