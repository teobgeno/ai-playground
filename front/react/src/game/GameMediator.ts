import { EventBus } from "./EventBus";

import { Character } from "./characters/types";
import { OrderStatus, Order, Task, TaskStatus } from "./actions/types";

interface BaseOrderCompleteData{
    characterIdTag: string,
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

        EventBus.on("on-order-change-status", (data: BaseOrderCompleteData) => {
            const character = this.charactersMap.get(data.characterIdTag)!;
            character.updateOrdersQueue();
        });

        EventBus.on("on-order-task-change-status", (data: BaseOrderCompleteData) => {
            const character = this.charactersMap.get(data.characterIdTag)!;
            character.updateOrdersQueue();
        });
       
    }

    async emitEvent<T extends object>(event: string, params : T) {
        EventBus.emit(event, params);
    }
}