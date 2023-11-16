from typing import List
from game.llm import OpenAIAPI


class DecideLocationPrompt:
    def __init__(self, props):
        self._llm: OpenAIAPI = props["llm"]

    @classmethod
    def create(cls, props):
        return cls(props)

    def chooseSectors(map_sectors: List[str]):
        # TODO:: query llm
        return ["forest"]

    def chooseGameObjects(map_sectors: List[str]):
        # TODO:: query llm
        return ["tree"]
