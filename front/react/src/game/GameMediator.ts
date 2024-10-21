import { EventBus } from "./EventBus";

export class GameMediator {

    private scene: Phaser.Scene;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    private initEventBusMessages() {

        EventBus.on("on-chat-character-player-message", (data: Message) => {
           
        });

       
    }

    async emitEvent<T extends object>(event: string, params : T) {
        EventBus.emit(event, params);
    }
}