import { EventBus } from "./EventBus";
import { Humanoid } from "./characters/Humanoid";

export class ChatManager {
    private participants: Map<string, Humanoid> = new Map();
    private messages: Map<string, string> = new Map();

    constructor() {}

    public startConversation() {
        //this.participants.set(character.getId(), character);
    }

    public addMessage(characterId: string, message: string) {
        //this.participants.set(character.getId(), character);
        const character = this.participants.get(characterId);
        EventBus.emit("on-talk-message-send", {
            isPlayer: character?.isNpc,
            characterName: "skordopoutsoglou",
            content: message,
        });
        this.messages.set(characterId, message)
    }
    public addParticipants(character: Humanoid) {
        this.participants.set(character.getId(), character);
    }
}
