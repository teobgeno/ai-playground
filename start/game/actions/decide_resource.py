from typing import List
from game.llm import DecideResourcePrompt
from game.map import GameObjectsDef


class DecideResourceAction:
    def __init__(self, props):
        self._decide_resource_prompt: DecideResourcePrompt = props["decide_resource_prompt"]
        self._action_descr: str = props["action_descr"]
        self._selected_game_object: GameObjectsDef = props["selected_game_object"]

    @classmethod
    def create(cls, props):
        return cls(props)

    def execute(self):
        selected_resources: List[str] = self.get_selected_resources()
        return {'game_object_id': 1, 'resources': selected_resources}

    def get_selected_resources(self) -> List[str]:
        return self._decide_resource_prompt.execute(self._action_descr, self._selected_game_object["keyword"])
