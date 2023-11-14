from typing import List


class DecideLocationAction:
    def __init__(self, props):
        self._id = props["id"]

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
        #   {sector: 'forest', game_objects : ['tree', 'herbs']}
        #   ....
        # ]
        selected_sectors = self.chooseSector([])
        selected_game_objects = self.chooseGameObjects([])
        return {"sector": selected_sectors[0], "game_object": selected_game_objects[0]}

    def chooseSector(map_sectors: List[str]):
        # TODO:: query llm
        return ["forest"]

    def chooseGameObjects(map_game_objects: List[str]):
        # TODO:: query llm
        return ["tree"]
