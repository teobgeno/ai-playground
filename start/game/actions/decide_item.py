from typing import List
from game.llm import DecideItemPrompt
from game.map import GameObjects


class DecideItemAction:
    def __init__(self, props):
        self._selected_sections = props["selected_sections"]
        self._game_objects: List[GameObjects] = props["game_objects"]
        self._action_descr: str = props["action_descr"]
        self._decide_item_prompt: DecideItemPrompt = props["decide_item_prompt"]

    @classmethod
    def create(cls, props):
        return cls(props)

    def execute(self):
        selected_game_objects = self.get_selected_game_objects(
            self._selected_sections)

        ret = []
        for gm in selected_game_objects:
            ret.append({"id": gm["id"], "section_id": gm["section_id"]})

        return ret

    def get_selected_game_objects(self, section_ids):
        selected_game_objects = []
        game_objects = set([
            e["keyword"] for e in self._game_objects if section_ids.count(e["section_id"])])
        chosen_game_objects = self._decide_item_prompt.choose_game_objects(
            self._action_descr, game_objects)
        if len(chosen_game_objects) > 0:
            selected_game_objects = [
                e for e in self._game_objects if section_ids.count(e["section_id"]) and chosen_game_objects.count(e["keyword"])]

        return selected_game_objects
