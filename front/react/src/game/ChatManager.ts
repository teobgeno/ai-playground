import { Game } from "./scenes/Game";
import { httpProvider } from "./core/httpProvider";
import { ServiceLocator } from "./core/serviceLocator";
import { TimeManager } from "./TimeManager";
import { Humanoid } from "./characters/Humanoid";
import { CharacterState } from "./characters/types";


export type Message = {
    characterId: string;
    message: string;
};

type ApiCreateResponse = {
    conversation_id: string;
};

type ApiTalkResponse = {
    conversation_id: number;
    message_reply: string;
    end_conversation: boolean;
};

type conversation = {
    id: string;
    participants: Array<Humanoid>;
    currentParticipantTalkIndex:number
    messages: Array<Message>;
    hasFinished:boolean;
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
        const convId = this.participantsToConv.get(data.characterId);
        if(convId) {
            this.finishConversation(convId);
        }
        this.exitConversation();
    }

    public async initConversation(participants: Array<Humanoid>) {
        const timeManager = ServiceLocator.getInstance<TimeManager>('timeManager');
        timeManager?.setTimeFlowReal();
        const req = { character_ids: participants.map(x => x.getId()), game_time: timeManager?.getCurrentDateTimeToString()};

        const resp: ApiCreateResponse = await httpProvider
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
        //const convId = "1";
        this.conversations.set(convId, {
            id: convId,
            participants: [],
            currentParticipantTalkIndex: -1,
            messages: [],
            hasFinished: false
        });

        for (const participant of participants) {
            participant.setCharState(CharacterState.TALK);
            participant.isNpc ? this.addParticipant(participant, convId): this.addPlayerParticipant(convId);
        }   

        return convId;
    }

    public addParticipant(character: Humanoid, convId: string) {
        const conversation = this.conversations.get(convId)!;
        conversation.participants.push(character);
        this.participantsToConv.set(character.getIdTag(),convId);
    }

    public addPlayerParticipant(convId: string) {
        const player = this.charactersMap.get('hero');
        if(player) {
            this.addParticipant(player, convId);
        }
    }

    public startConversation(convId: string) {
        let hasPlayer = false;
        const conversation = this.conversations.get(convId)!;
        for (const participant of conversation.participants) {
            if(!participant.isNpc){
                hasPlayer = true;
            }
        }

        if(hasPlayer) {
            (this.scene as Game).emitEvent("on-chat-start-conversation", {})
        } else {
            this.setConversationSide(convId);
        }
    }

    public setConversationSide(convId: string) {
        const conversation = this.conversations.get(convId)!;
        conversation.currentParticipantTalkIndex = typeof conversation.participants[conversation.currentParticipantTalkIndex + 1] === 'undefined' ? 0 : conversation.currentParticipantTalkIndex + 1;
        const character = conversation.participants[conversation.currentParticipantTalkIndex];
        if(character.isNpc) {
            this.generateNpcResponse(character?.getIdTag());
        }
    }

    public async getMessage(characterIdTag: string, message = '', endConversation = false) {
        const timeManager = ServiceLocator.getInstance<TimeManager>('timeManager');
        const convId = this.participantsToConv.get(characterIdTag);
        const character = this.charactersMap.get(characterIdTag)
        const req = { conversation_id: convId, character_id_talk: character?.getId(), message: message, end_conversation: endConversation, game_time: timeManager?.getCurrentDateTimeToString()};
        
        const resp: ApiTalkResponse = await httpProvider
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

            this.addMessage(characterIdTag, resp)
            //this.addMessage(characterIdTag, {conversation_id:1, message_reply:message, end_conversation: false})
    }

    public addMessage(characterIdTag: string, data: ApiTalkResponse) {
        const convId = this.participantsToConv.get(characterIdTag);
        if(convId) {
            const conversation = this.conversations.get(convId);
            const character = this.charactersMap.get(characterIdTag);
            (this.scene as Game).emitEvent("on-chat-add-message", {
                isNpc: character?.isNpc,
                characterName: character?.getName(),
                content: data.message_reply,
            })
            
            conversation?.messages.push({
                characterId: characterIdTag,
                message: data.message_reply,
            });

            if(data.end_conversation) {
                this.finishConversation(convId);
            } else {
                this.setConversationSide(convId)
                
            }
        }
    }

    
    public async finishConversation(convId: string, finishByPlayer = false) {
        const timeManager = ServiceLocator.getInstance<TimeManager>('timeManager');
        const conversation = this.conversations.get(convId);
        if(conversation && !conversation.hasFinished) {
            conversation.hasFinished = true;

            if(finishByPlayer) {
                const req = { conversation_id: convId, game_time: timeManager?.getCurrentDateTimeToString()};
        
                await httpProvider
                    .request(import.meta.env.VITE_APP_URL + 'conversation/destroy', {
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
            }

            for(const participant of ( conversation?.participants || [])){
                this.participantsToConv.delete(participant.getIdTag())
                participant.setCharState(CharacterState.IDLE);
                this.conversations.delete(convId);
            }

            (this.scene as Game).emitEvent("on-chat-end-conversation", {});

            timeManager?.setTimeFlowGame();
        }
        
    }

    public exitConversation() {
        (this.scene as Game).emitEvent("on-chat-close", {})

        const timeManager = ServiceLocator.getInstance<TimeManager>('timeManager');
        timeManager?.setTimeFlowGame();
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
        //     this.addMessage(characterIdTag,{conversation_id:1, message_reply:fake[Math.floor(Math.random()*fake.length)], end_conversation: true});
        // }, 500);
    }
}
