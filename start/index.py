import sys
import json
import spacy
from character.character import *
from character.character_skill import CharacterSkill

if __name__ == '__main__':

    def print_obj(obj):
        attrs = vars(obj)
        print(', '.join("%s: %s" % item for item in attrs.items()))

    # @@@ character @@@
    skills = []
    skill_woodcutter = CharacterSkill.create({'title': 'Wood cutter',
                                              'current_level': 5,
                                              'max_level': 20,
                                              'level_descr': 'Significant Familiarity',
                                              'current_xp': 15000,
                                              'next_xp':  21000})
    skills.append(skill_woodcutter)
    ch = Character.create('Alex', skills)

    print_obj(ch)
    sys.exit(0)
    # @@@ actions pool @@@
    actions_pool = [
        {"action": "Hunt for game in the forest"},
        {"action": "Fish in nearby rivers or streams"},
        {"action": "Locate a clean water source (well, river, or spring)"},
        {"action": "Fell trees for wood to use in building and crafting"},
    ]

    # https://github.com/sanjaybora04/CustomAiAssistant
    # https://github.com/shpetimhaxhiu/agi-taskgenius-gpt/blob/master/app.py
    # https://github.com/yoheinakajima/babyagi/tree/main
    # https://github.com/yoheinakajima/babyagi/blob/main/classic/BabyElfAGI/tasks/task_registry.py

    nlp = spacy.load("en_core_web_lg")
    main = nlp("Search for suitable land for farming")
    main_no_stop_words = nlp(' '.join([str(t) for t in main if not t.is_stop]))

    with open('actions.json') as f:
        actions_data = json.load(f)

    scores = []

    for i in actions_data['actions']:
        print(i['patterns'])
        for x in i['patterns']:
            scores.append({'action': i['title'], 'pattern': x,
                          'score': main_no_stop_words.similarity(nlp(x))})
            # print(main_no_stop_words, "<->", x, main_no_stop_words.similarity(nlp(x)))

    scores.sort(key=lambda x: x.get('score'), reverse=True)

    for i in scores:
        print(i)

    # actions = [
    # { "action": "Fell trees for wood to use in building and crafting" },
    # { "action": "Gather food from the forest (foraging)" },
    # { "action": "Hunt for game in the forest" },
    # { "action": "Fish in nearby rivers or streams" },
    # { "action": "Collect berries, nuts, and edible plants" },
    # { "action": "Set up traps for small animals" },
    # { "action": "Build simple shelters or huts from available materials" },
    # { "action": "Locate a clean water source (well, river, or spring)" },
    # { "action": "Dig a well for a more reliable water supply" },
    # { "action": "Create basic tools and utensils (wooden, stone, or bone)" },
    # { "action": "Start a fire for cooking and warmth" },
    # { "action": "Explore the forest for useful plants and herbs" },
    # { "action": "Search for suitable land for farming" },
    # { "action": "Clear land for agriculture (cutting trees, removing rocks)" },
    # { "action": "Plant crops and tend to a small garden" },
    # { "action": "Hunt or gather materials for clothing and shelter (animal hides, leaves, etc.)" },
    # { "action": "Build storage facilities for food and supplies" },
    # { "action": "Establish a leadership structure for organization and decision-making" }
    # ]
