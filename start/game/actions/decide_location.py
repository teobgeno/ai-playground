from typing import List
from game.llm import DecideLocationPrompt, OpenAIAPI


class DecideLocationAction:
    def __init__(self, props):
        self._decide_location_prompt: DecideLocationPrompt = props["decide_location_prompt"]

    @classmethod
    def create(cls, props):
        return cls(props)

    def execute(self):
        # TODO:: query llm
        # map.getSectors()
        # selected_sectors = self.chooseSector(map.getSectors(), action: str)
        # selected_game_objects = map.getGameObjects(selected_sectors[0].id)
        # foreach sector get game objects
        # output [
        #   {sector: 'forest', arena: '', game_objects : ['tree', 'herbs']}
        #   ....
        # ]
        selected_sectors = self.getSectors([])
        selected_game_objects = self.getGameObjects([])
        return {"sector": selected_sectors[0], "arena": '', "game_object": selected_game_objects[0]}

    def getSectors(self, map_sectors: List[str]):
        return self._decide_location_prompt.chooseSectors()

    def getGameObjects(self, map_game_objects: List[str]):
        return self._decide_location_prompt.chooseGameObjects()
