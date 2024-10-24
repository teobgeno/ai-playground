import configparser
from datetime import datetime, timedelta
from typing import List
from schema.conversation import *
from core.db.json_db_manager import JsonDBManager
from game.llm import LLMProvider
from core.cache import Cache
from game.character.cognitive_modules.conversation import Conversation
from game.character.character_memory import CharacterMemory
from typing import cast, List
class ConversationManager:
    def __init__(self, parser, db: JsonDBManager, llm: LLMProvider, cache: Cache, params: ConversationApiTalkRequestDef | ConversationApiCreateRequestDef | ConversationApiDestroyRequestDef):
        self._parcer = parser
        self._db = db
        self._llm  = llm
        self._cache = cache
        self._participants: List[ParticipantDef] = []
        self._params = params
    
    def create_participants(self, character_ids: List[int])->None:
        for character_id in character_ids:
            char_data = cast(CharacterDef, self._db.get_record_by_id('characters', character_id))
        
            character_memory = CharacterMemory(self._llm, char_data['memory_path'])
            character = Character.create(char_data['id'], bool(char_data['is_npc']), char_data['name'], character_memory)

            self._participants.append(ParticipantDef({'character':character, 'is_talking': False}))
            
    def talk(self, conversation: Conversation)->str:
        utterance = ''
        self._params = cast(ConversationApiTalkRequestDef, self._params)
        talking_char: Character = [element for element in self._participants if element['is_talking'] == True][0]['character']
        if talking_char.is_npc:
            utterance = conversation.talk_npc(self._params['game_time'])
        else:
            utterance = conversation.talk_player(self._params['game_time'], self._params['message'], bool(self._params['end_conversation']))
        
        return utterance
    
    def create_conversation(self)->ConversationApiCreateResponseDef:
        conversation = Conversation(self._db, self._llm, self._cache, 0)
        if 'character_ids' in self._params:
            self.create_participants(self._params['character_ids'])

        conversation.set_participants(self._participants)
        
        conversation.set_start_date(self._params['game_time'])

        conversation_id = conversation.insert_conversation()
        return {'conversation_id': str(conversation_id)}

    def process_conversation(self)->ConversationApiTalkResponseDef:
        self._params = cast(ConversationApiTalkRequestDef, self._params)
        conversation = self.load_conversation()
        for participant in self._participants:
            if participant['character'].id == self._params['character_id_talk']:
                participant['is_talking'] = True

        conversation.set_participant_roles()

        utternace = self.talk(conversation)
        conversation.update_conversation()
        if conversation.status == ConversationStatus.COMPLETED:
            self.end_conversation(conversation)

        return {'conversation_id': str(conversation.id), 'message_reply' : utternace, 'end_conversation': True if conversation.status == ConversationStatus.COMPLETED else False}


    def load_conversation(self)->Conversation:
        if 'conversation_id' in self._params:
            conv = cast(ConversationDef, self._db.get_record_by_id('conversations', int(self._params['conversation_id'])))
            conversation = Conversation(self._db, self._llm, self._cache, int(self._params['conversation_id']))
            conversation.set_start_date(conv['start_date'])
            self.create_participants(conv['participants'])
            conversation.set_participants(self._participants)
            conversation.set_messages(conv['messages'])
            conversation.set_relationships(conv['relationships'])

        # ta = TypeAdapter(ConversationDef)
        # ta.validate_python(conv)
  
        return conversation
    
    def destroy_conversation(self)->bool:
        conversation = self.load_conversation()
        conversation.set_end_date(self._params['game_time'])
        conversation.update_conversation()
        if  len(conversation.messages):
            self.end_conversation(conversation)
        return True
        
    def end_conversation(self, conversation: Conversation):
        for participant in self._participants:
            if participant['character'].is_npc:
                target_person = [element for element in self._participants if element['character'].id != participant['character'].id][0]['character']
                
                messages_list: List[str] = []
                for message in conversation.messages:
                    messages_list.append([e['character'].name for e in self._participants if e['character'].id == message['character_id']][0] + ' :' + message['message'])


                summary = participant['character'].memory.create_conversation_summary(target_person.name, messages_list)
                summary_score = participant['character'].memory.calculate_conversation_poig_score(summary)
                summary_embed = self._llm.get_embed(summary)

                memo = participant['character'].memory.create_conversation_memory(target_person.name, messages_list)
                memo_score = participant['character'].memory.calculate_event_poig_score(memo)
                memo_embed = self._llm.get_embed(memo)

                plan = participant['character'].memory.create_conversation_planning_thought(target_person.name, messages_list)
                plan_score = participant['character'].memory.calculate_event_poig_score(plan)
                plan_embed = self._llm.get_embed(plan)

                props_summary = {
                    'type':'conversation',
                    'created' : self._params['game_time'],    # self._params['game_time']
                    'expires' : self._params['game_time'] + timedelta(days=30),
                    'subject' : participant['character'].name,
                    'predicate' : 'chat with',
                    'object' : target_person.name,
                    'description' : summary,
                    'keywords' : [participant['character'].name, target_person.name],
                    'poignancy' : summary_score,
                    'embedding_pair' :  (summary, summary_embed),
                    'filling': [{'conversation_id': conversation.id}]
                }
                chat_node = participant['character'].memory.insert_to_memory(props_summary)

                props_summary['type'] = 'event'
                props_summary['filling'] = [{'node_num_id': chat_node.node_num_id}]
                participant['character'].memory.insert_to_memory(props_summary)

                props_memo = {
                    'type':'thought',
                    'created' : self._params['game_time'],
                    'expires' : self._params['game_time'] + timedelta(days=30),
                    'subject' : '',
                    'predicate' : '',
                    'object' : '',
                    'description' : memo,
                    'keywords' : [],
                    'poignancy' : memo_score,
                    'embedding_pair' :  (memo, memo_embed),
                    'filling': [{'node_num_id': chat_node.node_num_id, 'conversation_id': conversation.id}]
                }
                participant['character'].memory.insert_to_memory(props_memo)

                props_plan = {
                    'type':'thought',
                    'created' : self._params['game_time'],
                    'expires' : self._params['game_time'] + timedelta(days=30),
                    'subject' : '',
                    'predicate' : '',
                    'object' : '',
                    'description' : f"For {participant['character'].name}'s planning: {plan}",
                    'keywords' : [],
                    'poignancy' : plan_score,
                    'embedding_pair' :  (plan, plan_embed),
                    'filling': [{'node_num_id': chat_node.node_num_id, 'conversation_id': conversation.id}]
                }
                participant['character'].memory.insert_to_memory(props_plan)
          
                participant['character'].memory.update_reflect_trigger(summary_score)
                participant['character'].memory.save_associative()
                participant['character'].memory.save_scratch()