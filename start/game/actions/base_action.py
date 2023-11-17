from typing import List, Any


class BaseAction:
    def __init__(self, props):
        self._id: int = props["id"]
        self._category = props["category"]
        self._patterns: List[str] = props["patterns"]
        self._sections = props["sections"]
        self._results = props["resuts"]

    @classmethod
    def create(cls, props):
        return cls(props)

    @property
    def id(self):
        return self._id
