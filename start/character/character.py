from typing import List
from pprint import pprint
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
        tasks_rate = []
        for task in tasks:
            tasks_rate.insert(task._id, {"task_id": task._id, "rate": 1})
            for factor in task.factors:
                match factor["type"]:
                    case "skill":
                        if (self.hasSkill(factor["id"])):
                            tasks_rate[task._id]["rate"] = tasks_rate[task._id]["rate"] + \
                                factor["multiplier"]
        tasks_rate.sort(key=lambda x: x.get('rate'), reverse=True)
        pprint(tasks_rate)

    def hasSkill(self, skillId):
        skill = [e if e.id == skillId else None for e in self._skills]
        return True if skill[0] else False
