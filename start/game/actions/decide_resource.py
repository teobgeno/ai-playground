from typing import List
from game.llm import DecideResourcePrompt


class DecideResourceAction:
    def __init__(self, props):
        self._decide_resource_prompt: DecideResourcePrompt = props["decide_resource_prompt"]
        self._action_descr = props["action_descr"]
        self._selected_game_object = props["_selected_game_object"]

    @classmethod
    def create(cls, props):
        return cls(props)

    def execute(self):
        selected_resources = self.get_selected_resources(
            self._selected_sections)

        return selected_resources

    def get_selected_resources(self, section_ids):
        selected_resources = []
        return self._decide_resource_prompt.choose_resources(self._action_descr, self._selected_game_object)
