import { EventBus } from "./EventBus";
import { Humanoid } from "./characters/Humanoid";
import { httpProvider } from "./core/httpProvider";
import {Hero} from "./characters/Hero";
import {Npc} from "./characters/Npc";

type Message = {
    characterId: string;
    message: string;
};

type conversation = {
    id: string;
    participants: Array<Humanoid>;
    currentParticipantTalkIndex:number
    messages: Array<Message>;
};
export class ChatManager {
    private charactersMap:  Map<string, Humanoid>;
    private conversations: Map<string, conversation> = new Map();
    private participantsToConv: Map<string, string> = new Map();

    constructor(charactersMap:  Map<string, Humanoid>) {
        this.charactersMap = charactersMap;

        EventBus.on("on-chat-character-player-message", (data: Message) => {
           this.addMessage(data.characterId, data.message)
        });
        EventBus.on("on-chat-character-player-close-conversation", (data: Message) => {
            this.closeConversation(data.characterId)
         });
    }

    public initConversation() {
        //httpProvider.request()
        const convGuid = self.crypto.randomUUID();
        this.conversations.set(convGuid, {
            id: convGuid,
            participants: [],
            currentParticipantTalkIndex: -1,
            messages: [],
        });
        return convGuid;
    }

    public addMessage(characterId: string, message: string) {
        const guid = this.participantsToConv.get(characterId);
        if(guid) {
            const conversation = this.conversations.get(guid);
            const character = this.charactersMap.get(characterId);
            EventBus.emit("on-chat-add-message", {
                isPlayer: character?.isNpc,
                characterName: "skordopoutsoglou",
                content: message,
            });
    
            conversation?.messages.push({
                characterId: characterId,
                message: message,
            });
            this.setConversationSide(guid)
        }
        
    }

    public addParticipant(character: Humanoid, guid: string) {
        const conversation = this.conversations.get(guid);
        conversation?.participants.push(character);
        this.participantsToConv.set(character.getId(), guid);
        character.setConvGuid(guid);
    }

    public addPlayerParticipant(guid: string) {
        const player = this.charactersMap.get('hero');
        if(player) {
            this.addParticipant(player, guid);
        }
    }

    public startConversation(guid: string) {
        //TODO::if in participants is hero emit event to open chatbox
        const player = this.charactersMap.get('hero');
        if(player) {
            player.setCharState('talk')
            EventBus.emit("on-chat-start-conversation", {characterId: player.getId(), guid: guid});
        }
        this.setConversationSide(guid);
    }

    public setConversationSide(guid: string) {
        const conversation = this.conversations.get(guid);
        if(conversation) {
            conversation.currentParticipantTalkIndex =typeof conversation.participants[conversation.currentParticipantTalkIndex + 1] === 'undefined' ? 0 : conversation.currentParticipantTalkIndex + 1;
            const character = conversation.participants[conversation.currentParticipantTalkIndex];
            if(character?.isNpc) {
                this.generateNpcResponse(character?.id);
            }
            //!character?.isNpc?(character as Hero)?.startTalk():
        }
    }

    public closeConversation(characterId: string) {
        const guid = this.participantsToConv.get(characterId);
        let hasPlayerInConv = false;
        if(guid) {
            const conversation = this.conversations.get(guid);
            //TODO::log dialogue to db, character that closed the conversation
            for(const participant of ( conversation?.participants || [])){
                this.participantsToConv.delete(participant.getId())
                participant.setCharState('idle');
                if(!participant.isNpc) {hasPlayerInConv = true;}
            }
            this.conversations.delete(guid);
            if(hasPlayerInConv) {
                EventBus.emit("on-chat-end-conversation", {});
            }
        }
    }

    public generateNpcResponse(characterId: string) {
        const fake = [
            'Hi there, I\'m Jesse and you?',
            'Nice to meet you',
            'How are you?',
            'Not too bad, thanks',
            'What do you do?',
            'That\'s awesome',
            'Codepen is a nice place to stay',
            'I think you\'re a nice person',
            'Why do you think that?',
            'Can you explain?',
            'Anyway I\'ve gotta go now',
            'It was a pleasure chat with you',
            'Time to make a new codepen',
            'Bye',
            ':)'
        ]
        setTimeout(() => {
            this.addMessage(characterId,fake[Math.floor(Math.random()*fake.length)]);
        }, 1000);
    }
}
