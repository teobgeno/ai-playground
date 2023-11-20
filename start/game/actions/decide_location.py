from typing import List
from game.llm import DecideLocationPrompt


class DecideLocationAction:
    def __init__(self, props):
        self._decide_location_prompt: DecideLocationPrompt = props["decide_location_prompt"]
        self._sections = [{'id': 1, 'parent_id': 0, 'keyword': 'forest', 'title': 'Forest 1'},
                          {'id': 2, 'parent_id': 0, 'keyword': 'lake'},
                          {'id': 3, 'parent_id': 0, 'keyword': 'village'},
                          {'id': 4, 'parent_id': 1, 'keyword': 'house'},
                          {'id': 5, 'parent_id': 0,
                              'keyword': 'forest', 'title': 'Forest 2'}
                          ]

        self._keywords = set([e["keyword"] for e in self._sections])

        self._game_objects = [
            {'id': 1, 'section_id': 1, 'parent_id': 0, 'keyword': 'tree'}]

    @classmethod
    def create(cls, props):
        return cls(props)

    def execute(self):
        # TODO:: query llm
        # map.getSectors()
        # selected_sections = self.chooseSector(map.getSectors(depth = 0), action: str)
        # selected_game_objects = map.getGameObjects(selected_sections[0].id)
        # foreach sector get game objects
        # output [
        #   {sector: 'forest', game_objects : ['tree', 'herbs']}
        #   sections can be nested e.x forest -> house
        #   game_object can be nested e.x cupboard -> book
        ret_obj = []
        selected_sections = self.get_selected_sections()
        if len(selected_sections) > 0:
            for section in selected_sections:
                selected_game_objects = self.get_selected_game_objects(
                    [e for e in self._game_objects if e["section_id"] == section["id"]])
                ret_obj.append(
                    {"section": section["id"], "game_objects": [e for e in selected_game_objects]})

        return ret_obj

    def get_selected_sections(self, parent_ids=[0], selected_sections=[]):
        child_sections = set([
            e["keyword"] for e in self._sections if parent_ids.count(e["parent_id"])])
        chosen_sections = self._decide_location_prompt.choose_sections(
            child_sections)
        if len(chosen_sections) > 0:
            selected_sections = [
                e for e in self._sections if parent_ids.count(e["parent_id"]) and chosen_sections.count(e["keyword"])]
            current_parent_ids = [e["id"] for e in selected_sections]
            self.get_selected_sections(current_parent_ids, selected_sections)

        return selected_sections

    def get_selected_game_objects(self, selected_game_objects):
        return self._decide_location_prompt.choose_game_objects(selected_game_objects)
