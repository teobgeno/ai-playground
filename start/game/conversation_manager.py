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
    def __init__(self, parser: configparser, db: JsonDBManager, llm: LLMProvider, cache: Cache, params: ConversationApiPropsDef):
        self._parcer = parser
        self._db = db
        self._llm  = llm
        self._cache = cache
        self._participants: List[ParticipantDef] = []
        self._params = ConversationApiPropsDef(params)
        self.create_participants()

            
    def create_participants(self):
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
    
    def process_conversation(self)->str:
        conversation = self.load_conversation()
        utternace = self.talk(conversation)
        conversation.update_conversation()
        if conversation.status == ConversationStatus.COMPLETED:
            self.end_conversation()

        return utternace


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
        
    def end_conversation():
        pass