from game.llm import LLMProvider
from game.character.character import *
from game.character.cognitive_modules.retrieve import RetrieveAction
from game.llm import DecideItemPrompt


class Conversation:
    def __init__(self, llm: LLMProvider, participants: List[Character]):
        self._llm = llm
        self._paricipants = participants
        # age
        # skills List of skill(class)
        # traits List of trait(class)

    def get_relationship_with_participant(self, init_person: Character, target_person: Character):
        focal_points = [target_person.name]
        retrieve_action = RetrieveAction(self._llm)
        retrieved = retrieve_action.new_retrieve(init_person, focal_points, 50)
        all_embedding_keys = set()
        for key, val in retrieved.items():
            for i in val:
                all_embedding_keys.add(i.embedding_key)
        all_embedding_key_str = ""
        for i in all_embedding_keys:
            all_embedding_key_str += f"{i}\n"
    pass

    def add_conversation_message():
        pass
