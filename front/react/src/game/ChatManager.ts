import { EventBus } from "./EventBus";
import { Humanoid } from "./characters/Humanoid";

type message = {
    characterId: string;
    message: string;
};

type conversation = {
    id: string;
    participants: Map<string, Humanoid>;
    messages: Array<message>;
};
export class ChatManager {
    private player: Humanoid;
    private conversations: Map<string, conversation> = new Map();

    constructor(player: Humanoid) {
        this.player = player;
    }

    public initConversation() {
        const convGuid = self.crypto.randomUUID();
        this.conversations.set(convGuid, {
            id: convGuid,
            participants: new Map(),
            messages: [],
        });
        return convGuid;
    }

    public addMessage(characterId: string, message: string, guid: string) {
        const conversation = this.conversations.get(guid);
        const character = conversation?.participants.get(characterId);
        EventBus.emit("on-talk-message-send", {
            isPlayer: character?.isNpc,
            characterName: "skordopoutsoglou",
            content: message,
        });

        conversation?.messages.push({
            characterId: characterId,
            message: message,
        });
    }

    public addParticipants(character: Humanoid, guid: string) {
        const conversation = this.conversations.get(guid);
        conversation?.participants.set(character.getId(), character);
    }
    public addPlayerParticipant(guid: string) {
        const conversation = this.conversations.get(guid);
        conversation?.participants.set(this.player.getId(), this.player);
        console.log(this.conversations)
    }
}
