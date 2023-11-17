from typing import List, Any
from game.llm import OpenAIAPI


class DecideLocationPrompt:
    def __init__(self, props):
        self._llm: OpenAIAPI = props["llm"]

    @classmethod
    def create(cls, props):
        return cls(props)

    def choose_sections(self, sections: List[Any]):
        # TODO:: query llm
        if sections[0]["keyword"] == "house":
            return []
        else:
            return [{'id': 1, 'parent_id': 0, 'keyword': 'forest'}]

    def choose_game_objects(self, map_sections: List[Any]):
        # TODO:: query llm
        # llm will return comma seperated strings like rabbit, deer
        return [{'id': 1, 'section_id': 1, 'parent_id': 0, 'keyword': 'tree'}]
