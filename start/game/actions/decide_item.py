from typing import List
from game.llm import DecideItemPrompt


class DecideItemAction:
    def __init__(self, props):
        self._decide_location_prompt: DecideItemPrompt = props["decide_location_prompt"]
        self._action_descr = props["action_descr"]
        self._game_objects = [
            {'id': 1, 'section_id': 1, 'parent_id': 0, 'keyword': 'tree'}]

    @classmethod
    def create(cls, props):
        return cls(props)

    def execute(self):
        pass
        # ret_obj = []
        # selected_sections = self.get_selected_sections()
        # if len(selected_sections) > 0:
        #     for section in selected_sections:
        #         selected_game_objects = self.get_selected_game_objects(
        #             [e for e in self._game_objects if e["section_id"] == section["id"]])
        #         ret_obj.append(
        #             {"section": section["id"], "game_objects": [e for e in selected_game_objects]})

        # return ret_obj

    def get_selected_game_objects(self, selected_game_objects):
        return self._decide_location_prompt.choose_game_objects(selected_game_objects)
