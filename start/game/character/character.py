from typing import List
from pprint import pprint
from game.character.character_memory import CharacterMemory
from game.task import *
from game.character.memory_structures.spatial_memory import MemoryTree
from game.character.memory_structures.associative_memory import AssociativeMemory
from game.character.memory_structures.scratch import Scratch


class Character:
    def __init__(self, id: int, is_npc: bool, name: str, memory: CharacterMemory):
        self._id = id
        self._is_npc = is_npc
        self._name = name
        self._memory = memory
        # self._state = "idle"
        # self.spatial_memory = None
        # self.associative_memory = None
        # self.scratch_memory = None
        # age
        # skills List of skill(class)
        # traits List of trait(class)

    @classmethod
    def create(cls, id: int, is_npc:bool, name: str, memory: CharacterMemory):
        return cls(id, is_npc, name, memory)

    @property
    def id(self):
        return self._id
    
    @property
    def is_npc(self):
        return self._is_npc

    @property
    def name(self):
        return self._name

    @property
    def memory(self):
        return self._memory

    # def setSpatialMemory(self, data):
    #     self.spatial_memory = MemoryTree(data)

    # def setAssociativeMemory(self, data):
    #     self.associative_memory = AssociativeMemory(data)

    # def setScratchMemory(self, data):
    #     self.scratch_memory = Scratch(data)

    # def setBlankMemory(self):
    #     self.spatial_memory = MemoryTree('')
    #     self.spatial_memory = AssociativeMemory('')
    #     self.spatial_memory = Scratch('')
