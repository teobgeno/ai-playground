import json
from game.character.character import *
from game.character.character_skill import CharacterSkill


def create_character():
    skills = []
    skill_woodcutter = CharacterSkill.create({'id': 1,
                                              'title': 'Wood cutter',
                                              'current_level': 5,
                                              'max_level': 20,
                                              'level_descr': 'Significant Familiarity',
                                              'current_xp': 15000,
                                              'next_xp':  21000})
    skills.append(skill_woodcutter)
    ch = Character.create(1, 'Alex', skills)
    return json.dumps(ch.__dict__)
