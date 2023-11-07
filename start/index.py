import sys
import json
import spacy
from character.character import *
from character.character_skill import CharacterSkill

if __name__ == '__main__':

    # @@ vars @@
    time_scale = 20

    with open('actions.json') as f:
        actions_data = json.load(f)

    nlp = spacy.load("en_core_web_lg")

    # @@ Helper @@
    def print_obj(obj):
        attrs = vars(obj)
        print(', '.join("%s: %s" % item for item in attrs.items()))

    def get_gpt_actions():
        return [
            {"action": "Hunt for game in the forest", "resolved_id": 0},
            {"action": "Fish in nearby rivers or streams", "resolved_id": 0},
            {"action": "Locate a clean water source (well, river, or spring)",
             "resolved_id": 0},
            {"action": "Fell trees for wood to use in building and crafting",
                "resolved_id": 0},
        ]

    def translate_to_local_action(ai_text: str):
        scores = []
        text = nlp(ai_text)
        text_no_stop_words = nlp(
            ' '.join([str(t) for t in text if not t.is_stop]))
        for i in actions_data['actions']:
            for x in i['patterns']:
                scores.append({'id': i['id'], 'action': i['title'], 'pattern': x,
                               'score': text_no_stop_words.similarity(nlp(x))})

        scores.sort(key=lambda x: x.get('score'), reverse=True)

        if scores[1]['score'] >= 0.7:
            return scores[1]['id']

        return 0

    def resolve_gpt_actions(gpt_actions):
        tasks = []
        unresolved_gpt_actions = []
        for i in gpt_actions:
            action_id = translate_to_local_action(i['action'])
            if action_id > 0:
                i['resolved_id'] = action_id
                tasks.append([x for x in actions_data['actions']
                              if x["id"] == action_id][0])
            else:
                unresolved_gpt_actions.append(i['action'])
        # print(tasks)
        # print(unresolved_gpt_actions)

    # @@ character @@
    skills = []
    skill_woodcutter = CharacterSkill.create({'id': 1,
                                              'title': 'Wood cutter',
                                              'current_level': 5,
                                              'max_level': 20,
                                              'level_descr': 'Significant Familiarity',
                                              'current_xp': 15000,
                                              'next_xp':  21000})
    skills.append(skill_woodcutter)
    ch = Character.create('Alex', skills)

    resolve_gpt_actions(get_gpt_actions())

    sys.exit(0)

    # https://github.com/sanjaybora04/CustomAiAssistant
    # https://github.com/shpetimhaxhiu/agi-taskgenius-gpt/blob/master/app.py
    # https://github.com/yoheinakajima/babyagi/tree/main
    # https://github.com/yoheinakajima/babyagi/blob/main/classic/BabyElfAGI/tasks/task_registry.py

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
