import hashlib
from game.llm import LLMProvider
from game.character.character import *
from game.character.cognitive_modules.retrieve import RetrieveAction
from game.llm import GetRelationshipPrompt
from core.db.json_db_manager import JsonDBManager



class Conversation:
    def __init__(self, db:JsonDBManager, llm: LLMProvider, participants: List[Character]):
        self._id = 0
        self._db = db
        self._llm = llm
        self._paricipants = participants
        self._retrieve_action = RetrieveAction(self._llm)
        self._relation_prompt = GetRelationshipPrompt({'llm': self._llm})

    def get_relationship_with_participant(self, init_person: Character, target_person: Character):
        focal_points = [target_person.name]
        
        embed = self._llm.get_embed(target_person.name)
        focal_points=[{'text':target_person.name, 'embed':embed}]
        
        retrieved = init_person.memory.new_retrieve(focal_points, 50)
        
        all_embedding_keys = set()
        for key, val in retrieved.items():
            for i in val:
                all_embedding_keys.add(i.embedding_key)
        all_embedding_key_str = ""
        for i in all_embedding_keys:
            all_embedding_key_str += f"{i}\n"

        prompt = self.get_relation_prompt({'statements': all_embedding_key_str, 'init_person_name': init_person.name, 'target_person_name': target_person.name})
        
        messages=[{"role": "user", "content": prompt}]
        
        relationship = self._llm.completition({"max_tokens": 300, "temperature": 0.5, "top_p": 1, "stream": False, "frequency_penalty": 0, "presence_penalty": 0, "stop": None}, messages)
        # relationship = "From Isabella Rodriguez's perspective, Maria Lopez is a close friend who is actively involved in preparing for the Valentine's Day party at Hobbs Cafe. Isabella values their friendship and appreciates Maria's willingness to help with setting up decorations and bringing snacks for the party. Isabella sees Maria as a reliable and supportive friend who shares her excitement for the event. Overall, Isabella has a positive view of Maria Lopez."
        
        embed = self._llm.get_embed(relationship)
        focal_points=[{'text':relationship, 'embed':embed}]
        retrieved = init_person.memory.new_retrieve(focal_points, 15)
        
        print('ok')

    pass

    def start_conversation(self):
        text = 'From Isabella Rodriguez perspective'
        result = hashlib.sha1(text.encode())
        print(result.hexdigest())
        # self._db.add_record({"text":"From Isabella Rodriguez's perspective, Maria Lopez is a close friend who is actively involved in preparing for the Valentine's Day party at Hobbs Cafe. Isabella values their friendship and appreciates Maria's willingness to help with setting up decorations and bringing snacks for the party. Isabella sees Maria as a reliable and supportive friend who shares her excitement for the event. Overall, Isabella has a positive view of Maria Lopez.","type":"GPT"})
        # create conversation generate id
        # self._db.get_gpt_response_by_text()
        pass

    def add_conversation_message(self):
        self.get_relationship_with_participant(self._paricipants[0], self._paricipants[1])
       
        
    def get_relation_prompt(self, props):
        tpl = """
        [Statements]
        \n
        {props[statements]}
        \nWhat do you think about {props[target_person_name]}?
        """
        #  \nBased on the statements above, summarize {props[init_person_name]} and {props[target_person_name]}'s relationship. What do they feel or know about each other?
        return tpl.format(props=props)
    