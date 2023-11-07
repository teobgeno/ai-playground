from typing import List


class CharacterSkill:
    def __init__(self, props):
        self._title = props['title']
        self._current_level = props['current_level']
        self._max_level = props['max_level']
        self._level_descr = props['level_descr']
        self._current_xp = props['current_xp']
        self._next_xp = props['next_xp']

    @classmethod
    def create(cls, props):
        return cls(props)
