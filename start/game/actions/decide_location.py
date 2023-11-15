from typing import List
from game.llm import DecideLocationPrompt, OpenAIAPI


class DecideLocationAction:
    def __init__(self, props):
        self._id = props["id"]
        self._prompt: DecideLocationPrompt = props["decide_location_prompt"]
        self._llm: OpenAIAPI = props["llm"]

    @classmethod
    def create(cls, props):
        return cls(props)

    @property
    def id(self):
        return self._id

    def execute(self, action: str):
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

    def getSectors(map_sectors: List[str]):
        # TODO:: query llm
        return ["forest"]

    def getGameObjects(map_game_objects: List[str]):
        # TODO:: query llm
        return ["tree"]
