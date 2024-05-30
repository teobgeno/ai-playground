import { Humanoid } from "./characters/Humanoid";

export class ChatManager {
    private participants: Map<string, Humanoid> = new Map();

    constructor() {}

    public startConversation() {
        //this.participants.set(character.getId(), character);
    }

    public addMessage() {
        //this.participants.set(character.getId(), character);
    }
    public addParticipants(character: Humanoid) {
        this.participants.set(character.getId(), character);
    }
}
