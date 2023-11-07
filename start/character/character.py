from typing import List
from character.character_skill import CharacterSkill
from task.task import Task


class Character:
    def __init__(self, name: str, skills: List[CharacterSkill]):
        self._name = name
        self._skills = skills
        self._state = "idle"
        # age
        # skills List of skill(class)
        # traits List of trait(class)

    @classmethod
    def create(cls, name: str, skills: List[CharacterSkill]):
        return cls(name, skills)

    def selectProperTask(self, tasks: List[Task]):
        for i in tasks:
            for factor in i.factors:
                match factor["type"]:
                    case "skill":
                        self.hasSkill(factor["id"])

    def hasSkill(self, skillId):
        pass
