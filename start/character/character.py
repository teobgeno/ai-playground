from typing import List
from character.character_skill import CharacterSkill


class Character:
    def __init__(self, name: str, skills: List[CharacterSkill]):
        self._name = name
        self._skills = skills
        # age
        # skills List of skill(class)
        # traits List of trait(class)

    @classmethod
    def create(cls, name: str, skills: List[CharacterSkill]):
        return cls(name, skills)
