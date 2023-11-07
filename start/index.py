import sys
import json
import spacy
from character.character import *
from character.character_skill import CharacterSkill
from task.task import Task
from pprint import pprint

if __name__ == '__main__':

    # @@ vars @@
    time_scale = 20

    with open('tasks.json') as f:
        tasks_data = json.load(f)

    nlp = spacy.load("en_core_web_lg")

    # @@ Helper @@
    def print_obj(obj):
        attrs = vars(obj)
        print(', '.join("%s: %s" % item for item in attrs.items()))

    def get_gpt_tasks():
        return [
            {"task": "Hunt for game in the forest", "resolved_id": 0},
            {"task": "Fish in nearby rivers or streams", "resolved_id": 0},
            {"task": "Locate a clean water source (well, river, or spring)",
             "resolved_id": 0},
            {"task": "Fell trees for wood to use in building and crafting",
                "resolved_id": 0},
        ]

    def translate_to_local_task(ai_text: str):
        scores = []
        text = nlp(ai_text)
        text_no_stop_words = nlp(
            ' '.join([str(t) for t in text if not t.is_stop]))
        for i in tasks_data['tasks']:
            for x in i['patterns']:
                p = nlp(x)
                if (p and p.vector_norm):
                    scores.append({'id': i['id'], 'task': i['title'], 'pattern': x,
                                   'score': text_no_stop_words.similarity(nlp(x))})

        scores.sort(key=lambda x: x.get('score'), reverse=True)

        if scores[1]['score'] >= 0.7:
            return scores[1]['id']

        return 0

    def resolve_gpt_tasks(gpt_tasks):
        tasks: list[Task] = []
        unresolved_gpt_tasks = []
        for i in gpt_tasks:
            task_id = translate_to_local_task(i['task'])
            if task_id > 0:
                i['resolved_id'] = task_id
                tasks.append(Task.create([x for x in tasks_data['tasks']
                                          if x["id"] == task_id][0]))
            else:
                unresolved_gpt_tasks.append(i['task'])

        return {"tasks": tasks, "unresolved_gpt_tasks": unresolved_gpt_tasks}
        # print(tasks)
        # print(unresolved_gpt_tasks)

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

    res = resolve_gpt_tasks(get_gpt_tasks())
    ch.selectProperTask(res["tasks"])

    pprint(res["unresolved_gpt_tasks"])

    sys.exit(0)

    # https://github.com/sanjaybora04/CustomAiAssistant
    # https://github.com/shpetimhaxhiu/agi-taskgenius-gpt/blob/master/app.py
    # https://github.com/yoheinakajima/babyagi/tree/main
    # https://github.com/yoheinakajima/babyagi/blob/main/classic/BabyElfAGI/tasks/task_registry.py

    # tasks = [
    # { "task": "Fell trees for wood to use in building and crafting" },
    # { "task": "Gather food from the forest (foraging)" },
    # { "task": "Hunt for game in the forest" },
    # { "task": "Fish in nearby rivers or streams" },
    # { "task": "Collect berries, nuts, and edible plants" },
    # { "task": "Set up traps for small animals" },
    # { "task": "Build simple shelters or huts from available materials" },
    # { "task": "Locate a clean water source (well, river, or spring)" },
    # { "task": "Dig a well for a more reliable water supply" },
    # { "task": "Create basic tools and utensils (wooden, stone, or bone)" },
    # { "task": "Start a fire for cooking and warmth" },
    # { "task": "Explore the forest for useful plants and herbs" },
    # { "task": "Search for suitable land for farming" },
    # { "task": "Clear land for agriculture (cutting trees, removing rocks)" },
    # { "task": "Plant crops and tend to a small garden" },
    # { "task": "Hunt or gather materials for clothing and shelter (animal hides, leaves, etc.)" },
    # { "task": "Build storage facilities for food and supplies" },
    # { "task": "Establish a leadership structure for organization and decision-making" }
    # ]
