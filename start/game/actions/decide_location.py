from typing import List
from game.llm import DecideLocationPrompt


class DecideLocationAction:
    def __init__(self, props):
        self._decide_location_prompt: DecideLocationPrompt = props["decide_location_prompt"]
        self._sections = [{'id': 1, 'parent_id': 0, 'type': 'forest'},
                          {'id': 2, 'parent_id': 0, 'type': 'lake'},
                          {'id': 3, 'parent_id': 0, 'type': 'village'},
                          {'id': 4, 'parent_id': 1, 'type': 'house'}]

        self._game_objects = [
            {'id': 1, 'section_id': 1, 'parent_id': 0, 'type': 'tree'}]

    @classmethod
    def create(cls, props):
        return cls(props)

    def execute(self):
        # TODO:: query llm
        # map.getSectors()
        # selected_sectors = self.chooseSector(map.getSectors(depth = 0), action: str)
        # selected_game_objects = map.getGameObjects(selected_sectors[0].id)
        # foreach sector get game objects
        # output [
        #   {sector: 'forest', game_objects : ['tree', 'herbs']}
        #   sectors can be nested e.x forest -> house
        #   game_object can be nested e.x cupboard -> book
        selected_sectors = self.getSelectedSectors([])
        selected_game_objects = self.getGameObjects([])
        return [{"sector": selected_sectors[0], "game_object": selected_game_objects[0]}]

    def getSelectedObjects(self, parent_id=0, obj=[]):

        pass

    def getSelectedSectors(self, map_sectors: List[str]):
        return self._decide_location_prompt.chooseSectors()

    def getGameObjects(self, map_game_objects: List[str]):
        return self._decide_location_prompt.chooseGameObjects()
