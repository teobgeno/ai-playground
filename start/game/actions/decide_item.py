from typing import List, Set
from game.llm import DecideItemPrompt
from game.map import GameObjectsDef


class DecideItemAction:
    def __init__(self, props):
        self._selected_sections: List[int] = props["selected_sections"]
        self._game_objects: List[GameObjectsDef] = props["game_objects"]
        self._action_descr: str = props["action_descr"]
        self._decide_item_prompt: DecideItemPrompt = props["decide_item_prompt"]

    @classmethod
    def create(cls, props):
        return cls(props)

    def execute(self):
        selected_game_objects = self.get_selected_game_objects(
            self._selected_sections)

        return selected_game_objects

    def get_selected_game_objects(self, section_ids: List[int]):
        selected_game_objects = []
        game_objects: Set[str] = set([
            e["keyword"] for e in self._game_objects if section_ids.count(e["section_id"])])
        chosen_game_objects: List[str] = self._decide_item_prompt.execute(
            self._action_descr, game_objects)
        if len(chosen_game_objects) > 0:
            selected_game_objects = [
                e for e in self._game_objects if section_ids.count(e["section_id"]) and chosen_game_objects.count(e["keyword"])]

        return selected_game_objects
