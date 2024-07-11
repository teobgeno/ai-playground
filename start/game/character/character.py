from typing import List
from pprint import pprint
from game.character.character_skill import CharacterSkill
from game.task import *
from game.character.memory_structures.scratch import Scratch


class Character:
    def __init__(self, id: int, name: str):
        self._id = id
        self._name = name
        self._state = "idle"
        self._assignedTasks = []
        self.scratch = Scratch("")
        # age
        # skills List of skill(class)
        # traits List of trait(class)

    @classmethod
    def create(cls, id: int, name: str):
        return cls(id, name)

    @property
    def id(self):
        return self._id

    def testFunc(self):
        print('My name is' + self._name)
