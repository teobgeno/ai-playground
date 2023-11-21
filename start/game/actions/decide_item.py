from typing import List
from game.llm import DecideItemPrompt


class DecideItemAction:
    def __init__(self, props):
        self._decide_item_prompt: DecideItemPrompt = props["decide_item_prompt"]
        self._action_descr = props["action_descr"]
        self._selected_sections = props["selected_sections"]
        self._game_objects = [
            {'id': 1, 'section_id': 1, 'parent_id': 0, 'keyword': 'tree'}]

    @classmethod
    def create(cls, props):
        return cls(props)

    def execute(self):
        selected_game_objects = self.get_selected_game_objects(
            self._selected_sections)

        return [e["id"] for e in selected_game_objects]
        # ret_obj = []
        # selected_sections = self.get_selected_sections()
        # if len(selected_sections) > 0:
        #     for section in selected_sections:
        #         selected_game_objects = self.get_selected_game_objects(
        #             [e for e in self._game_objects if e["section_id"] == section["id"]])
        #         ret_obj.append(
        #             {"section": section["id"], "game_objects": [e for e in selected_game_objects]})

        # return ret_obj

    def get_selected_game_objects(self, section_ids):
        selected_game_objects = []
        game_objects = set([
            e["keyword"] for e in self._game_objects if section_ids.count(e["section_id"])])
        chosen_game_objects = self._decide_item_prompt.choose_game_objects(
            self._action_descr, game_objects)
        if len(chosen_game_objects["existing_objects"]) > 0:
            selected_game_objects = [
                e for e in self._game_objects if section_ids.count(e["section_id"]) and chosen_game_objects["existing_objects"].count(e["keyword"])]

        return selected_game_objects

        # return self._decide_item_prompt.choose_game_objects(selected_game_objects)
