from typing import List
from pprint import pprint
from character.character_skill import CharacterSkill
from task import *


class Character:
    def __init__(self, id: int, name: str, skills: List[CharacterSkill]):
        self._id = id
        self._name = name
        self._skills = skills
        self._state = "idle"
        self._assignedTasks = []
        # age
        # skills List of skill(class)
        # traits List of trait(class)

    @classmethod
    def create(cls, id: int, name: str, skills: List[CharacterSkill]):
        return cls(name, skills)

    @property
    def id(self):
        return self._id

    def selectProperTask(self, tasks: List[Task]) -> Task:
        tasks_rate = []
        for task in tasks:
            tasks_rate.insert(task.id, {"task": task, "rate": 1})
            for factor in task.factors:
                match factor["type"]:
                    case "skill":
                        if (self.hasSkill(factor["id"])):
                            tasks_rate[task.id]["rate"] = tasks_rate[task.id]["rate"] + \
                                factor["multiplier"]
        tasks_rate.sort(key=lambda x: x.get('rate'), reverse=True)
        return tasks_rate[0]["task"]

    def addTask(self, task_assignment: TaskAssignment):
        self._assignedTasks.append(task_assignment)

    def removeTask(self):
        pass

    def hasSkill(self, skillId):
        skill = [e if e.id == skillId else None for e in self._skills]
        return True if skill[0] else False
