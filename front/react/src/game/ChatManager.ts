import { EventBus } from "./EventBus";
import { Humanoid } from "./characters/Humanoid";
import {Hero} from "./characters/Hero";
import {Npc} from "./characters/Npc";

type message = {
    characterId: string;
    message: string;
};

type conversation = {
    id: string;
    participants: Array<Humanoid>;
    currentParticipantTalkIndex:number
    messages: Array<message>;
};
export class ChatManager {
    private player: Humanoid;
    private conversations: Map<string, conversation> = new Map();
    private participantsToConv: Map<string, string> = new Map();

    constructor(player: Humanoid) {
        this.player = player;
    }

    public initConversation() {
        const convGuid = self.crypto.randomUUID();
        this.conversations.set(convGuid, {
            id: convGuid,
            participants: [],
            currentParticipantTalkIndex: 0,
            messages: [],
        });
        return convGuid;
    }

    public addMessage(characterId: string, message: string, guid: string) {
        // const conversation = this.conversations.get(guid);
        // const character = conversation?.participants.get(characterId);
        // EventBus.emit("on-talk-message-send", {
        //     isPlayer: character?.isNpc,
        //     characterName: "skordopoutsoglou",
        //     content: message,
        // });

        // conversation?.messages.push({
        //     characterId: characterId,
        //     message: message,
        // });
    }

    public addParticipant(character: Humanoid, guid: string) {
        const conversation = this.conversations.get(guid);
        conversation?.participants.push(character);
        this.participantsToConv.set(character.getId(), guid);
        character.setConvGuid(guid);
    }

    public addPlayerParticipant(guid: string) {
        this.addParticipant(this.player, guid);
    }

    public startConversation(guid: string) {
        const conversation = this.conversations.get(guid);
        const character = conversation?.participants[conversation?.currentParticipantTalkIndex];
        !character?.isNpc?(character as Hero)?.startTalk():(character as Npc)?.startTalk();
        //this.addParticipant(this.player, guid);
    }
}
