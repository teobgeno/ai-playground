import hashlib
import random
import string
import time
from typing import TypedDict
from game.llm import LLMProvider
from game.character.character import *
from core.db.json_db_manager import JsonDBManager


class Message(TypedDict):
    character_id: int
    message: str
    added_at: float

class Participant(TypedDict):
    character: Character
    is_talking: bool

class Conversation:
    def __init__(self, db:JsonDBManager, llm: LLMProvider):
        self._id = 0
        self._db = db
        self._llm = llm
        self._participants = None
        self._init_person = None
        self._target_person = None
        self._messages = []

    def create_conversation(self, participants: List[Participant]):
        self._id = self._db.add_record({"participants": [e['character'].id for e in participants], "messages":self._messages, "type":"conversation"})
        self.add_participants(participants)

    def load_conversation(conversation_id):
        pass

    def add_participants(self, participants: List[Participant]):
        self._init_person: Character = [element for element in participants if element['is_talking'] == True][0]['character']
        self._target_person: Character = [element for element in participants if element['is_talking'] == True][0]['character']
        self._participants = participants
        
    def add_messages(self, messages: List[Message]):
        self._messages = messages
        
    def get_unique_memories_text(self, retrieved: dict):
        all_embedding_keys = set()
        for key, val in retrieved.items():
            for i in val:
                all_embedding_keys.add(i.embedding_key)
        all_embedding_key_str = ""
        for i in all_embedding_keys:
            all_embedding_key_str += f"{i}\n"
            
        return all_embedding_key_str
            
    def get_memories_with_participant(self):
        # TODO:: pass focal points as parameter
        focal_points = [self._target_person.name]
        embed = self._llm.get_embed(self._target_person.name)
        focal_points=[{'text':self._target_person.name, 'embed':embed}]
        retrieved = self._init_person.memory.new_retrieve(focal_points, 50)
        
        return retrieved
        
        
    def get_relationship_with_participant(self, retrieved_memories_str: str, relationship: str = ''):
        
        if relationship == '' :
            prompt = self.get_relation_prompt({'statements': retrieved_memories_str, 'init_person_name': self._init_person.name, 'target_person_name': self._target_person.name})
            messages=[{"role": "user", "content": prompt}]
            relationship = self._llm.completition({"max_tokens": 300, "temperature": 0.5, "top_p": 1, "stream": False, "frequency_penalty": 0, "presence_penalty": 0, "stop": None}, messages)
 
        embed = self._llm.get_embed(relationship)
        focal_points=[{'text':relationship, 'embed':embed}]
        retrieved = self._init_person.memory.new_retrieve(focal_points, 15)
        
        return retrieved


    def start_conversation(self):
       
        
        # retrieved_person = self.get_memories_with_participant()
        # retrieved_person_str = self.get_unique_memories_text(retrieved_person)
        
        # retrieved_relation = self.get_relationship_with_participant(retrieved_person_str)
        # retrieved_relation_str = self.get_unique_memories_text(retrieved_relation)
        
        # utterance = self.add_conversation_message(retrieved_relation_str)
        utterance = ''.join(random.choices(string.ascii_uppercase + string.digits, k=10))
        self._messages.append({"character_id": self._init_person.id, "message": utterance, "added_at": time.time()})
        self._db.update_record_by_id(self._id, {"messages": self._messages})
        
        # text = 'From Isabella Rodriguez perspective'
        # result = hashlib.sha1(text.encode())
        # print(result.hexdigest())
        
       
        

    def add_conversation_message(self, retrieved_memories: str):
        prompt = self.get_utterance_prompt({'target_person_name': self._target_person.name, 'init_person_name': self._init_person.name, 'init_person_iis': self._init_person.memory.scratch.get_str_iss(), 'messages': [], 'init_person_retrieved_memories': retrieved_memories})
        messages=[{"role": "user", "content": prompt}]
        print(prompt)
        utternace = self._llm.completition({"max_tokens": 300, "temperature": 0.5, "top_p": 1, "stream": False, "frequency_penalty": 0, "presence_penalty": 0, "stop": None}, messages)
        return utternace

       
        
    def get_relation_prompt(self, props):
        tpl = """
[Statements]
{props[statements]}\n
What do you think about {props[target_person_name]}?
        """
        #  \nBased on the statements above, summarize {props[init_person_name]} and {props[target_person_name]}'s relationship. What do they feel or know about each other?
        return tpl.format(props=props)
    
    def get_utterance_prompt(self, props):
        query_fragments: List[str] = []
        tpl = """
Context for the task:\n
PART 1.\n
Here is Here is a brief description of {props[init_person_name]}
{props[init_person_iis]}
Here is the memory that is in {props[init_person_name]}'s head:
{props[init_person_retrieved_memories]}
PART 2.\n
Current Location: {props[target_person_name]} Farm\n
Current Context:
You are {props[init_person_name]}, and you're currently in a conversation with {props[target_person_name]}.The conversation started at HOUR. It's now HOUR.\n
"""
        
        if  len(props["messages"]):
            tpl +="""
            Below is the current conversation history between you and {props[target_person_name]}.\n
            {props[conversation_history]}\n\n
            """
            # for (const message of prevMessages) {
            # llmMessages.push({
            # role: 'user',
            # content: `${author.name} to ${recipient.name}: ${message.text}`,
            # });
            # }

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

        return "\n".join(query_fragments)
    