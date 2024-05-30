import { Humanoid } from "./characters/Humanoid";

export class ChatManager {
    private participants: Map<string, Humanoid> = new Map();

    constructor() {}

    public addParticipants(character: Humanoid) {
        this.participants.set(character.getId(), character);
    }
}
