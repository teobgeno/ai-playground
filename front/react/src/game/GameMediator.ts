import { EventBus } from "./EventBus";

import { ChatManager, Message } from "./ChatManager";

import { Character } from "./characters/types";
import { OrderStatus, Order, Task, TaskStatus } from "./actions/types";

interface BaseOrderCompleteData{
    characterIdTag: string,
}

export class GameMediator {

    private scene: Phaser.Scene;
    private charactersMap: Map<string, Character>;
    private chatManager: ChatManager;

    constructor(
        scene: Phaser.Scene, 
        charactersMap: Map<string, Character>,
        chatManager: ChatManager

    ) {
        this.scene = scene;
        this.charactersMap = charactersMap;
        this.chatManager = chatManager;
        this.initEventBusMessages();
    }

    private initEventBusMessages() {


        EventBus.on("on-character-controller-esc-key", () => {
            const hero = this.charactersMap.get("hero")!;
            for (const order of hero.getOrders()) {
              order.setStatus(OrderStatus.Canceled);
              order.cancel();
            }
            hero.startOrdersQueue();
        });

        EventBus.on("on-chat-character-player-message", (data: Message) => {
            this.chatManager.onChatCharacterPlayerMessage(data);
        });

        EventBus.on("on-chat-character-player-close-conversation", (data: Message) => {
            this.chatManager.onChatCharacterPlayerCloseConversation(data)
        });

        EventBus.on("on-order-change-status", (data: BaseOrderCompleteData) => {
            const character = this.charactersMap.get(data.characterIdTag)!;
            character.updateOrdersQueue();
        });

        EventBus.on("on-order-task-change-status", (data: BaseOrderCompleteData) => {
            const character = this.charactersMap.get(data.characterIdTag)!;
            character.updateOrdersQueue();
        });

        EventBus.on("on-order-next-reccur", (data: BaseOrderCompleteData) => {
            const character = this.charactersMap.get(data.characterIdTag)!;
            character.startOrdersQueue();
        });

    }

    async emitEvent<T extends object>(event: string, params : T) {
        EventBus.emit(event, params);
    }
}