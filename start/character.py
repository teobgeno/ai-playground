from typing import List
from schema import Skill
class Character:
    def __init__(self, name:str, skills:List[Skill]):
        self.name = name
        self.skills = skills
        #age
        #skills List of skill(class)
        #traits List of trait(class)
    @classmethod
    def create(cls, name:str, skills: List[Skill]):
        character = cls(name, skills)
        pass