import configparser
from core.db.json_db_manager import JsonDBManager
from game.llm import LLMProvider
from core.cache import Cache
from typing import List
from schema.conversation import *
from game.character.cognitive_modules.conversation import Conversation
from pydantic import ConfigDict, TypeAdapter, ValidationError
from game.character.character_memory import CharacterMemory

class ConversationManager:
    def __init__(self, parser: configparser, db: JsonDBManager, llm: LLMProvider, cache: Cache, params: ConversationApiRequestDef):
        self._parcer = parser
        self._db = db
        self._llm  = llm
        self._cache = cache
        self._participants: List[ParticipantDef] = []
        self._params = ConversationApiRequestDef(params)
        self.create_participants()

    def create_participants(self)->None:
        for character_id in self._params['character_ids']:
            char_data = CharacterDef(self._db.get_record_by_id('characters', character_id))
            
            character_memory = CharacterMemory(self._llm, char_data['memory_path'])
            character = Character.create(char_data['id'], bool(char_data['is_npc']), char_data['name'], character_memory)

            self._participants.append(ParticipantDef({'character':character, 'is_talking': True if self._params['character_id_talk'] == character_id else False}))
            
    def talk(self, conversation: Conversation)->str:
        utterance = ''
        talking_char: Character = [element for element in self._participants if element['is_talking'] == True][0]['character']
        if talking_char.is_npc:
            utterance = conversation.talk_npc(self._params['game_time'])
        else:
            utterance = conversation.talk_player(self._params['game_time'], self._params['message'], bool(self._params['end_conversation']))
        
        return utterance
    
    def process_conversation(self)->ConversationApiOut:
        conversation = self.load_conversation()
        utternace = self.talk(conversation)
        conversation.update_conversation()
        if conversation.status == ConversationStatus.COMPLETED:
            self.end_conversation(conversation)

        return {'conversation_id': conversation.id, 'message_reply' : utternace, 'end_conversation': True if conversation.status == ConversationStatus.COMPLETED else False}


    def load_conversation(self)->Conversation:
        
        conversation = Conversation(self._db, self._llm, self._cache, self._params['conversation_id'])
        conversation.set_participants(self._participants)
        if self._params['conversation_id']:
            conv = ConversationDef(self._db.get_record_by_id('conversations', self._params['conversation_id']))
            # ta = TypeAdapter(ConversationDef)
            # ta.validate_python(conv)
            conversation.set_messages(conv['messages'])
            conversation.set_relationships(conv['relationships'])
        else:
            conversation.set_start_date(self._params['game_time'])
            conversation.insert_conversation()
            
        return conversation
        
    def end_conversation(self, conversation: Conversation):
        return
        for participant in self._participants:
            if participant['character'].is_npc:
                target_person = [element for element in self._participants if element['character'].id != participant['character'].id][0]['character']
                
                summary = participant['character'].memory.create_conversation_summary(target_person.name, conversation.messages, conversation.participants)
                score = participant['character'].memory.calculate_conversation_poig_score(summary)
                summary_embed = self._llm.get_embed(summary)

                # summary = 'From my perspective, I was excited about the Valentine\'s Day party at Hobbs Cafe and wanted to discuss decorations with Maria. However, it seemed like Maria was upset because she felt like I left all the preparations to her. I apologized for the misunderstanding and tried to work things out, but Maria made it clear that she did not want to participate anymore. I respected her decision and will handle the preparations for the party on my own. Overall, I disliked this interaction because I had hoped to collaborate with Maria on the party planning'
                # score = 8
                # summary_embed = '123456'
            
                props = {
                    'date' : self._params['game_time'],
                    'subject' : participant['character'].name,
                    'predicate' : 'chat with',
                    'object' : target_person.name,
                    'summary' : summary,
                    'keywords' : [participant['character'].name, target_person.name],
                    'poignancy' : score,
                    'embedding_pair' :  (summary, summary_embed),
                    'filling': [{'conversation_id': conversation.id}]
                }

                chat_node = participant['character'].memory.add_coversation_memory(props)

                props['filling'] = [{'node_id': chat_node.node_id}]
                props['description'] = summary
                
                participant['character'].memory.add_event_memory(props)

                participant['character'].memory.save_associative()
                participant['character'].memory.save_scratch()