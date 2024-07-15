from typing import List
from pprint import pprint
from game.character.character_skill import CharacterSkill
from game.task import *
from game.character.memory_structures.spatial_memory import MemoryTree
from game.character.memory_structures.associative_memory import AssociativeMemory
from game.character.memory_structures.scratch import Scratch


class Character:
    def __init__(self, id: int, name: str):
        self._id = id
        self._name = name
        self._state = "idle"
        self.spatial_memory = None
        self.associative_memory = None
        self.scratch_memory = None
        # age
        # skills List of skill(class)
        # traits List of trait(class)

    @classmethod
    def create(cls, id: int, name: str):
        return cls(id, name)

    @property
    def id(self):
        return self._id

    @property
    def name(self):
        return self._name

    def setSpatialMemory(self, data):
        self.spatial_memory = MemoryTree(data)

    def setAssociativeMemory(self, data):
        self.associative_memory = AssociativeMemory(data)

    def setScratchMemory(self, data):
        self.scratch_memory = Scratch(data)
