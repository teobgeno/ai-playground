from typing import List
from game.llm import DecideResourcePrompt


class DecideResourceAction:
    def __init__(self, props):
        self._decide_resource_prompt: DecideResourcePrompt = props["decide_resource_prompt"]
        self._action_descr: str = props["action_descr"]
        self._selected_game_object: str = props["selected_game_object"]

    @classmethod
    def create(cls, props):
        return cls(props)

    def execute(self):
        selected_resources: List[str] = self.get_selected_resources()

        return selected_resources

    def get_selected_resources(self) -> List[str]:
        return self._decide_resource_prompt.execute(self._action_descr, self._selected_game_object)
