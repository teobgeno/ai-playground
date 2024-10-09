import { useState } from "react";
import "./CreateOrder.css";

export type CreateOrderProps = {
    stamina: number;
};

export function CreateOrder(props: CreateOrderProps) {

    const [modalIsOpen, setModalIsOpen] = useState(false);
    
    const handleOpenModal = () => {
        setModalIsOpen(true)
    };

    const handleCloseModal = () => {
        setModalIsOpen(false)
    };

    return (
        <>
            <button onClick={() => handleOpenModal()}>Order</button>
            {modalIsOpen && (
            <div id="myModal" className="order-modal">
                <div className="order-modal-content" onClick={() => handleCloseModal()}>
                    <span className="order-modal-close">&times;</span>
                    <p>Some text in the Modal..</p>
                </div>
            </div>
            )}
        </>
    );
}
