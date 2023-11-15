from typing import List


class DecideLocationPrompt:
    def __init__(self, props):
        self._id = props["id"]

    @classmethod
    def create(cls, props):
        return cls(props)

    def chooseSectors(map_sectors: List[str]):
        # TODO:: query llm
        return ["forest"]

    def chooseGameObjects(map_sectors: List[str]):
        # TODO:: query llm
        return ["forest"]
