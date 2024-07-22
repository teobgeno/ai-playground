import hashlib
import random
import string
import time
import json
from typing import TypedDict
from core.db.json_db_manager import JsonDBManager
from game.llm import LLMProvider
from core.cache import Cache
from game.character.character import *


class Message(TypedDict):
    character_id: int
    message: str
    added_at: float

class Participant(TypedDict):
    character: Character
    is_talking: bool
    
class Relationship(TypedDict):
    character_id: int
    descr: str

class Conversation:
    def __init__(self, db:JsonDBManager, llm: LLMProvider, cache: Cache, id: int = 0):
        self._id = id
        self._db = db
        self._llm  = llm
        self._cache = cache
        self._start_date = None
        self._participants: List[Participant] = []
        self._init_person: Character = None
        self._target_person: Character = None
        self._messages: List[Message] = []
        self._relationships: List[Relationship] = []
        
    @property
    def id(self):
        return self._id
    
    def set_start_date(self, date: datetime):
        self._start_date = date

    def set_participants(self, participants: List[Participant]):
        self._init_person: Character = [element for element in participants if element['is_talking'] == True][0]['character']
        self._target_person: Character = [element for element in participants if element['is_talking'] == True][0]['character']
        self._participants = participants
        
    def set_messages(self, messages: List[Message]):
        self._messages = messages
        
    def set_relationships(self, relationships: List[Relationship]):
        self._relationships = relationships
        
    def add_message(self, message: str):
        self._messages.append({'character_id': self._init_person.id, 'message': message, 'added_at': time.time()})
        
    def add_relatioship(self, relationship: str):
        self._relationships.append({'character_id': self._init_person.id, 'descr': relationship})
        
    def get_cached_relatioship(self):
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
            prompt = self.get_relation_prompt({'statements': retrieved_memories_str, 'init_person_name': self._init_person.name, 'target_person_name': self._target_person.name})
            messages=[{'role': 'user', 'content': prompt}]
            relationship = self._llm.completition({'max_tokens': 300, 'temperature': 0.5, 'top_p': 1, 'stream': False, 'frequency_penalty': 0, 'presence_penalty': 0, 'stop': None}, messages)
            self.add_relatioship(relationship)
        else:
            print('cached relationship')
 
        embed = self._cache.get_embed(relationship)
        focal_points=[{'text':relationship, 'embed':embed}]
        retrieved = self._init_person.memory.new_retrieve(focal_points, 15)
        
        return retrieved


    def talk_npc(self, current_date: datetime):
        utterance ='...'
        retrieved_relation_str = ''
        
        # if person curently talking has previous memories with the other participatn retrieve
        retrieved_person = self.get_memories_with_participant([self._target_person.name])
        if retrieved_person:
            retrieved_person_str = self.get_unique_memories_text(retrieved_person)
            relationship = self.get_cached_relatioship()
            retrieved_relation = self.get_relationship_memories_with_participant(retrieved_person_str, relationship)
            retrieved_relation_str = self.get_unique_memories_text(retrieved_relation)
            
        resp = self.generate_conversation_message(retrieved_relation_str, current_date)
        
        try:
            # Attempt to parse the JSON data
            json_dict = json.loads(resp)
            utterance = json_dict['utterance']
        except json.JSONDecodeError:
            print('parse error')
            print(resp)
            return None
        
        self.add_message(utterance)
            
        return utterance
   
    
    def talk_player(self, utterance: str):
        self.add_message(utterance)
        pass

    def generate_conversation_message(self, retrieved_memories: str, current_date: datetime):
        prompt = self.get_utterance_prompt({'target_person_name': self._target_person.name, 'init_person_name': self._init_person.name, 'init_person_iis': self._init_person.memory.scratch.get_str_iss(), 'start_date': self._start_date, 'current_date': current_date, 'messages': self._messages, 'init_person_retrieved_memories': retrieved_memories})
        messages=[{'role': 'user', 'content': prompt}]
        utternace = self._llm.completition({'max_tokens': 300, 'temperature': 0.5, 'top_p': 1, 'stream': False, 'frequency_penalty': 0, 'presence_penalty': 0, 'stop': None}, messages)
        return utternace
    
    def summarize_conversation(self):
        prompt = self.get_summary_prompt({'init_person_name': self._init_person.name, 'target_person_name': self._target_person.name})
        messages=[{'role': 'user', 'content': prompt}]
        summarize = self._llm.completition({'max_tokens': 300, 'temperature': 0.5, 'top_p': 1, 'stream': False, 'frequency_penalty': 0, 'presence_penalty': 0, 'stop': None}, messages)
        return summarize

    def get_summary_prompt(self, props):
        tpl = """
        Conversation: 
        """
        for i in self._messages:
            tpl += [e['character'].name for e in self._participants if e['character'].id == self._messages[i]['character_id']][0] + ' :' + self._messages[i]['message'] + '\n'

        tpl += """
You are {props[init_person_name]}, and you just finished a conversation with {props[target_person_name]}. I would
like you to summarize the conversation from {props[init_person_name]}'s perspective, using first-person pronouns like
"I," and add if you liked or disliked this interaction.
         """
        print(tpl.format(props=props))
        return tpl.format(props=props)
        
    def get_relation_prompt(self, props):
        tpl = """
[Statements]
{props[statements]}\n
What do you think about {props[target_person_name]}?
        """
        #  \nBased on the statements above, summarize {props[init_person_name]} and {props[target_person_name]}'s relationship. What do they feel or know about each other?
        print(tpl.format(props=props))
        return tpl.format(props=props)
    
    def get_utterance_prompt(self, props):
        query_fragments: List[str] = []
        tpl = """
Context for the task:\n
PART 1.\n
Here is a brief description of {props[init_person_name]}
{props[init_person_iis]}
Here is the memory that is in {props[init_person_name]}'s head:
{props[init_person_retrieved_memories]}
PART 2.\n
Current Location: {props[target_person_name]} Farm\n
Current Context:
You are {props[init_person_name]}, and you're currently in a conversation with {props[target_person_name]}.The conversation started at {props[start_date]}. It's now {props[current_date]}.\n
"""
        
        if  len(props["messages"]):
            tpl +="""
            Below is the current conversation history between you and {props[target_person_name]}.\n
            """
            for message in self._messages:
                tpl += [e['character'].name for e in self._participants if e['character'].id == message['character_id']][0] + ' :' + message['message'] + '\n'
        else:
            tpl +="""The conversation has not started yet -- start it!.\n"""

        tpl +="""
---
Task: Given the above, what should you say to {props[target_person_name]} next in the conversation? And did you end the conversation?
Output format: Output a json of the following format: 
{{
"utterance": "{props[init_person_name]}'s utterance>",
"Did the conversation end?": "<json Boolean>"
}}
"""

        query_fragments.append(tpl.format(props=props))

        print(tpl.format(props=props))
        return "\n".join(query_fragments)
    

    def insert_conversation(self, participants: List[Participant]):
        self._id = self._db.add_record('conversations', {'participants': [e['character'].id for e in participants], "messages":self._messages, "relationships":self._relationships, 'type': 'conversation'})

    def update_conversation(self):
        self._db.update_record_by_id('conversations', self._id, {'messages': self._messages, 'relationships': self._relationships})