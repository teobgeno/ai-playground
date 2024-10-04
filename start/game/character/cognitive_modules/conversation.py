import hashlib
import random
import string
from datetime import datetime
import time
import json
from enum import Enum
from typing import TypedDict
from typing import List
from core.db.json_db_manager import JsonDBManager
from core.prompt_generator import get_relation_prompt,get_utterance_prompt
from game.llm import LLMProvider
from core.cache import Cache
from schema.conversation import *
from schema.memory import FocalPointDef

class Conversation:
    def __init__(self, db:JsonDBManager, llm: LLMProvider, cache: Cache, id: int = 0):
        self._id = id
        self._db = db
        self._llm  = llm
        self._cache = cache
        self._status = ConversationStatus.RUNNING
        self._start_date: datetime
        self._end_date: datetime
        self._participants: List[ParticipantDef] = []
        self._init_person: Character
        self._target_person: Character
        self._messages: List[MessageDef] = []
        self._relationships: List[RelationshipDef] = []
        
    @property
    def id(self):
        return self._id
    
    @property
    def status(self):
        return self._status
    
    @property
    def participants(self):
        return self._participants
    
    @property
    def messages(self):
        return self._messages
    
    def set_start_date(self, date: datetime)->None:
        self._start_date = date
        
    def set_end_date(self, date: datetime)->None:
        self._end_date = date

    def set_participants(self, participants: List[ParticipantDef])->None:
        self._participants = participants

    def set_participant_roles(self)->None:
        self._init_person: Character = [element for element in self._participants if element['is_talking'] == True][0]['character']
        self._target_person: Character = [element for element in self._participants if element['is_talking'] == False][0]['character']
        
    def set_messages(self, messages: List[MessageDef])->None:
        self._messages = messages
        
    def set_relationships(self, relationships: List[RelationshipDef])->None:
        self._relationships = relationships
        
    def add_message(self, message: str)->None:
        self._messages.append({'character_id': self._init_person.id, 'message': message, 'added_at': time.time()})
        
    def add_relatioship(self, relationship: str)->None:
        self._relationships.append(RelationshipDef({'character_id': self._init_person.id, 'descr': relationship}))
        
    def get_cached_relationship(self):
        relations = [e['descr'] for e in self._relationships if e['character_id'] == self._init_person.id]
        if relations:
            return relations[0]
        return ''

    def get_unique_memories_text(self, retrieved: dict):
        all_embedding_keys = set()
        for key, val in retrieved.items():
            for i in val:
                all_embedding_keys.add(i.embedding_key)
        all_embedding_key_str = ""
        for i in all_embedding_keys:
            all_embedding_key_str += f"{i}\n"
            
        return all_embedding_key_str
            
    def get_memories_with_participant(self, focal_points):

        focal_points_embeds = []
        for i in focal_points:
            embed = self._cache.get_embed(self._target_person.name)
            focal_points_embeds.append({'text':self._target_person.name, 'embed':embed})

        retrieved = self._init_person.memory.new_retrieve(focal_points_embeds, 50)

        return retrieved
        
        
    def get_relationship_memories_with_participant(self, retrieved_memories_str: str, relationship: str = ''):
        
        if relationship == '' :
            messages = get_relation_prompt({'statements': retrieved_memories_str, 'init_person_name': self._init_person.name, 'target_person_name': self._target_person.name})
            # messages=[{'role': 'user', 'content': prompt}]
            relationship = self._llm.completition({'max_tokens': 300, 'temperature': 0.5, 'top_p': 1, 'stream': False, 'frequency_penalty': 0, 'presence_penalty': 0, 'stop': None}, messages)
            self.add_relatioship(relationship)
        else:
            print('cached relationship')
 
        embed = self._cache.get_embed(relationship)
        focal_point: FocalPointDef = {'text':relationship, 'embed':embed}
        focal_points =[focal_point]
        retrieved = self._init_person.memory.new_retrieve(focal_points, 15)
        
        return retrieved


    def talk_npc(self, current_date: datetime)-> str:
        utterance ='...'
        retrieved_relation_str = ''
        conversation_end = False
        
        # if person curently talking has previous memories with the other participatn retrieve
        retrieved_person = self.get_memories_with_participant([self._target_person.name])
        if retrieved_person:
            retrieved_person_str = self.get_unique_memories_text(retrieved_person)
            relationship = self.get_cached_relationship()
            retrieved_relation = self.get_relationship_memories_with_participant(retrieved_person_str, relationship)
            retrieved_relation_str = self.get_unique_memories_text(retrieved_relation)
            
        resp = self.generate_conversation_message(retrieved_relation_str, current_date)
        
        try:
            json_dict = json.loads(resp)
            utterance = json_dict['utterance']
            conversation_end: bool = bool(json_dict['Did the conversation end?'])
            
            if conversation_end: 
                  self._status = ConversationStatus.COMPLETED
                  self._end_date = current_date
                  
            self.add_message(utterance)

        except json.JSONDecodeError:
            print('parse error')
            print(resp)

        return utterance
   
    
    def talk_player(self, current_date: datetime, utterance: str, end_conversation: bool):
        if utterance != '':
            self.add_message(utterance)
            
        if end_conversation:
            self._status = ConversationStatus.COMPLETED
            self._end_date = current_date
            
        return utterance

    def generate_conversation_message(self, retrieved_memories: str, current_date: datetime):

        messages_list: List[str] = []
        for message in self._messages:
            messages_list.append([e['character'].name for e in self._participants if e['character'].id == message['character_id']][0] + ' :' + message['message'])

        messages = get_utterance_prompt({'target_person_name': self._target_person.name, 'init_person_name': self._init_person.name, 'init_person_iis': self._init_person.memory.scratch.get_str_iss(), 'start_date': self._start_date, 'current_date': current_date, 'messages': messages_list, 'init_person_retrieved_memories': retrieved_memories})
        #messages=[{'role': 'user', 'content': prompt}]
        utternace = self._llm.completition({'max_tokens': 300, 'temperature': 0.5, 'top_p': 1, 'stream': False, 'frequency_penalty': 0, 'presence_penalty': 0, 'stop': None}, messages)
        return utternace
    

    def insert_conversation(self):
        self._id = self._db.add_record('conversations', {'status': self.status.value, 
                                                         'start_date': self._start_date.strftime('%Y-%m-%d %H:%M:%S'), 
                                                         'end_date': '',  
                                                         'participants': [e['character'].id for e in self._participants], 
                                                         'messages':self._messages, 
                                                         'relationships':self._relationships, 
                                                         'type': 'conversation'}
                                       )
        return self._id

    def update_conversation(self):
        self._db.update_record_by_id('conversations', self._id, {'status': self.status.value, 
                                                                 'end_date': self._end_date.strftime('%Y-%m-%d %H:%M:%S') if isinstance(self._end_date, datetime) else '', 
                                                                 'messages': self._messages, 
                                                                 'relationships': self._relationships})