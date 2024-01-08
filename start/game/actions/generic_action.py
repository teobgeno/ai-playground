from typing import List, Any


class GenericAction:
    def __init__(self, props):
        self._action_descr: str = props["action_descr"]

    def get_verb(self):
        return "chop"

    def get_execution_duration(self):
        return 1000
