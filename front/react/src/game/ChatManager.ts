import { Game } from "./scenes/Game";
import { Humanoid } from "./characters/Humanoid";
import { httpProvider } from "./core/httpProvider";
import { CharacterState } from "./characters/types";

export type Message = {
    characterId: string;
    message: string;
};

type ApiTalkReply = {
    conversation_id: number;
    message_reply: string;
    end_conversation: boolean;
};

type conversation = {
    id: string;
    participants: Array<Humanoid>;
    currentParticipantTalkIndex:number
    messages: Array<Message>;
};
export class ChatManager {
    private scene: Phaser.Scene;
    private charactersMap:  Map<string, Humanoid>;
    private conversations: Map<string, conversation> = new Map();
    private participantsToConv: Map<string, string> = new Map();

    constructor(scene: Phaser.Scene, charactersMap:  Map<string, Humanoid>) {
        this.scene = scene;
        this.charactersMap = charactersMap;
    }

    public onChatCharacterPlayerMessage(data: Message) {
        this.getMessage(data.characterId, data.message);
    }
    public onChatCharacterPlayerCloseConversation(data: Message) {
        this.closeConversation(data.characterId)
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


        const convId = resp.conversation_id;

        this.conversations.set(convId, {
            id: convId,
            participants: [],
            currentParticipantTalkIndex: -1,
            messages: [],
        });

        for (const participant of participants) {
            participant.setCharState(CharacterState.TALK);
            participant.isNpc ? this.addParticipant(participant, convId): this.addPlayerParticipant(convId);
        }   

        return convId;
    }

    public async getMessage(characterIdTag: string, message = '', endConversation = false) {
        const convId = this.participantsToConv.get(characterIdTag);
        const character = this.charactersMap.get(characterIdTag)
        const req = { conversation_id: convId, character_id_talk: character?.getId(), message: message, end_conversation: endConversation};
        
        const resp: ApiTalkReply = await httpProvider
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
            (this.scene as Game).emitEvent("on-chat-add-message", {
                isPlayer: character?.isNpc,
                characterName: character?.getName(),
                content: message,
            })
            
            conversation?.messages.push({
                characterId: characterIdTag,
                message: message,
            });
            this.setConversationSide(convId)
        }
        
    }

    public addParticipant(character: Humanoid, convId: string) {
        const conversation = this.conversations.get(convId);
        conversation?.participants.push(character);
        this.participantsToConv.set(character.getIdTag(),convId);
    }

    public addPlayerParticipant(convId: string) {
        const player = this.charactersMap.get('hero');
        if(player) {
            this.addParticipant(player, convId);
        }
    }

    public startConversation(convId: string) {
        //TODO::if in participants is hero emit event to open chatbox
        const player = this.charactersMap.get('hero');
        if(player) {
            (this.scene as Game).emitEvent("on-chat-start-conversation", {})
        } else {
            this.setConversationSide(convId);
        }
    }

    public setConversationSide(convId: string) {
        const conversation = this.conversations.get(convId);
        if(conversation) {
            conversation.currentParticipantTalkIndex =typeof conversation.participants[conversation.currentParticipantTalkIndex + 1] === 'undefined' ? 0 : conversation.currentParticipantTalkIndex + 1;
            const character = conversation.participants[conversation.currentParticipantTalkIndex];
            if(character?.isNpc) {
                this.generateNpcResponse(character?.getIdTag());
            }
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
                participant.setCharState(CharacterState.IDLE);
                if(!participant.isNpc) {hasPlayerInConv = true;}
            }
            this.conversations.delete(convId);
            if(hasPlayerInConv) {
                (this.scene as Game).emitEvent("on-chat-end-conversation", {})
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
