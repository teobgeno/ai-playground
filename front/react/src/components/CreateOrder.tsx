import { useEffect } from "react";
import "./CreateOrder.css";

export type CreateOrderProps = {
    stamina: number;
};

export function CreateOrder(props: CreateOrderProps) {

    const handleCreateOrder = () => {
        console.log('order')
    };

    return (
        <>
           <button onClick={() => handleCreateOrder()}>Order</button>
        </>
    );
}
