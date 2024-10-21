import { EventBus } from "./EventBus";

import { Character } from "./characters/types";
import { OrderStatus, Order, Task, TaskStatus } from "./actions/types";

interface BaseOrderCompleteData{
    characterIdTag: string,
    status: OrderStatus
}

interface BaseOrderTaskCompleteData{
    orderId: number,
    characterIdTag: string,
    status: OrderStatus
}

export class GameMediator {

    private scene: Phaser.Scene;
    private charactersMap: Map<string, Character>;

    constructor(
        scene: Phaser.Scene, 
        charactersMap: Map<string, Character>

    ) {
        this.scene = scene;
        this.charactersMap = charactersMap;
        this.initEventBusMessages();
    }

    private initEventBusMessages() {

        EventBus.on("on-base-order-complete", (data: BaseOrderCompleteData) => {
            const character = this.charactersMap.get(data.characterIdTag)!;
            character.updateOrdersQueue();
        });

        EventBus.on("on-base-order-task-complete", (data: BaseOrderCompleteData) => {
            const character = this.charactersMap.get(data.characterIdTag)!;
            character.updateOrdersQueue();
        });
       
    }

    async emitEvent<T extends object>(event: string, params : T) {
        EventBus.emit(event, params);
    }
}