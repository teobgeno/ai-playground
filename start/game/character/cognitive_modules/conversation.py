from game.llm import LLMProvider
from game.character.character import *
from game.character.cognitive_modules.retrieve import RetrieveAction
from game.llm import GetRelationshipPrompt


class Conversation:
    def __init__(self, llm: LLMProvider, participants: List[Character]):
        self._llm = llm
        self._paricipants = participants
        self._retrieve_action = RetrieveAction(self._llm)
        self._relation_prompt = GetRelationshipPrompt({'llm': self._llm})

    def get_relationship_with_participant(self, init_person: Character, target_person: Character):
        focal_points = [target_person.name]
        retrieved = self._retrieve_action.new_retrieve(init_person, focal_points, 50)
        all_embedding_keys = set()
        for key, val in retrieved.items():
            for i in val:
                all_embedding_keys.add(i.embedding_key)
        all_embedding_key_str = ""
        for i in all_embedding_keys:
            all_embedding_key_str += f"{i}\n"

        self._relation_prompt.execute(all_embedding_key_str, init_person.name, target_person.name)
    pass

    def add_conversation_message():
        pass
