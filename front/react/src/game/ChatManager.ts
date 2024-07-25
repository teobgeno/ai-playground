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
    id: number;
    participants: Array<Humanoid>;
    currentParticipantTalkIndex:number
    messages: Array<Message>;
};
export class ChatManager {
    private charactersMap:  Map<string, Humanoid>;
    private conversations: Map<number, conversation> = new Map();
    private participantsToConv: Map<string, number> = new Map();

    constructor(charactersMap:  Map<string, Humanoid>) {
        this.charactersMap = charactersMap;

        EventBus.on("on-chat-character-player-message", (data: Message) => {
            this.getMessage(data.characterId, data.message);
            //this.addMessage(data.characterId, data.message)
        });
        EventBus.on("on-chat-character-player-close-conversation", (data: Message) => {
            this.closeConversation(data.characterId)
         });
    }

    public async initConversation(participants: Array<Humanoid>) {
        const req = { character_ids: participants.map(x => x.getId())};

        const resp = await httpProvider
            .request(import.meta.env.VITE_APP_URL + 'conversation/create', {
                method: 'POST',
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Cache-Control': 'private, no-cache, no-store, must-revalidate',
                    Expires: '-1',
                    Pragma: 'no-cache',
                },
                body: JSON.stringify(req),
            })
            .execute();

            for (const participant of participants) {
                participant.isNpc ? this.addParticipant(participant, resp.conversation_id): this.addPlayerParticipant(resp.conversation_id);
            }   

        // const convGuid = self.crypto.randomUUID();
        this.conversations.set(resp.conversation_id, {
            id: resp.conversation_id,
            participants: [],
            currentParticipantTalkIndex: -1,
            messages: [],
        });
        return resp.conversation_id;
    }

    public async getMessage(characterIdTag: string, message = '', endConversation = false) {
        const convId = this.participantsToConv.get(characterIdTag);
        const character = this.charactersMap.get(characterIdTag)
        const req = { conversation_id: convId, character_ids: [1, 2], character_id_talk: character?.getId(), message: message, end_conversation: endConversation};
        
        const resp = await httpProvider
            .request(import.meta.env.VITE_APP_URL + 'conversation/talk', {
                method: 'POST',
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Cache-Control': 'private, no-cache, no-store, must-revalidate',
                    Expires: '-1',
                    Pragma: 'no-cache',
                },
                body: JSON.stringify(req),
            })
            .execute();

            this.addMessage(characterIdTag, resp.message_reply)
    }

    public addMessage(characterIdTag: string, message: string) {
        const convId = this.participantsToConv.get(characterIdTag);
        if(convId) {
            const conversation = this.conversations.get(convId);
            const character = this.charactersMap.get(characterIdTag);
            EventBus.emit("on-chat-add-message", {
                isPlayer: character?.isNpc,
                characterName: "skordopoutsoglou",
                content: message,
            });
    
            conversation?.messages.push({
                characterId: characterIdTag,
                message: message,
            });
            this.setConversationSide(convId)
        }
        
    }

    public addParticipant(character: Humanoid, convId: number) {
        const conversation = this.conversations.get(convId);
        conversation?.participants.push(character);
        this.participantsToConv.set(character.getIdTag(), convId);
        character.setConvId(convId);
    }

    public addPlayerParticipant(convId: number) {
        const player = this.charactersMap.get('hero');
        if(player) {
            this.addParticipant(player, convId);
        }
    }

    public startConversation(convId: number) {
        //TODO::if in participants is hero emit event to open chatbox
        const player = this.charactersMap.get('hero');
        if(player) {
            player.setCharState('talk')
            EventBus.emit("on-chat-start-conversation", {});
            //EventBus.emit("on-chat-start-conversation", {characterId: player.getId(), convId: convId});
        }
        this.setConversationSide(convId);
    }

    public setConversationSide(convId: number) {
        const conversation = this.conversations.get(convId);
        if(conversation) {
            conversation.currentParticipantTalkIndex =typeof conversation.participants[conversation.currentParticipantTalkIndex + 1] === 'undefined' ? 0 : conversation.currentParticipantTalkIndex + 1;
            const character = conversation.participants[conversation.currentParticipantTalkIndex];
            if(character?.isNpc) {
                this.generateNpcResponse(character?.getIdTag());
            }
            //!character?.isNpc?(character as Hero)?.startTalk():
        }
    }

    public closeConversation(characterIdTag: string) {
        const convId = this.participantsToConv.get(characterIdTag);
        let hasPlayerInConv = false;
        if(convId) {
            const conversation = this.conversations.get(convId);
            //TODO::log dialogue to db, character that closed the conversation
            for(const participant of ( conversation?.participants || [])){
                this.participantsToConv.delete(participant.getIdTag())
                participant.setCharState('idle');
                if(!participant.isNpc) {hasPlayerInConv = true;}
            }
            this.conversations.delete(convId);
            if(hasPlayerInConv) {
                EventBus.emit("on-chat-end-conversation", {});
            }
        }
    }

    public generateNpcResponse(characterIdTag: string) {
        this.getMessage(characterIdTag, '');
        // const fake = [
        //     'Hi there, I\'m Jesse and you?',
        //     'Nice to meet you',
        //     'How are you?',
        //     'Not too bad, thanks',
        //     'What do you do?',
        //     'That\'s awesome',
        //     'Codepen is a nice place to stay',
        //     'I think you\'re a nice person',
        //     'Why do you think that?',
        //     'Can you explain?',
        //     'Anyway I\'ve gotta go now',
        //     'It was a pleasure chat with you',
        //     'Time to make a new codepen',
        //     'Bye',
        //     ':)'
        // ]
        // setTimeout(() => {
        //     this.addMessage(characterIdTag,fake[Math.floor(Math.random()*fake.length)]);
        // }, 1000);
    }
}
