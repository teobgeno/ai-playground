import sys
import json
import spacy
from pprint import pprint
from game.character.character import *
from game.character.character_skill import CharacterSkill
from game.task import *
from game.llm import DecideLocationPrompt, DecideItemPrompt, LLMProvider
from game.actions import DecideLocationAction, DecideItemAction


# @@ vars @@
time_scale = 20

with open('game/tasks.json') as f:
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


def test_action():
    pass


def test_whatever():

    # @@ action compose @@

    # fell trees for wood to use in building and crafting
    a_loc = DecideLocationAction(
        {'action_descr': 'fell trees for wood to use in building and crafting',
         'decide_location_prompt': DecideLocationPrompt({'llm': LLMProvider()})}
    )
    retLoc = a_loc.execute()

    a_it = DecideItemAction(
        {'action_descr': 'fell trees for wood to use in building and crafting',
         'selected_sections': retLoc,
         'decide_item_prompt': DecideItemPrompt({'llm': LLMProvider()})}
    )

    itLoc = a_it.execute()

    # g = GatherResourcesTask({})
    # g.create()

    # @@ character @@
    # skills = []
    # skill_woodcutter = CharacterSkill.create({'id': 1,
    #                                           'title': 'Wood cutter',
    #                                           'current_level': 5,
    #                                           'max_level': 20,
    #                                           'level_descr': 'Significant Familiarity',
    #                                           'current_xp': 15000,
    #                                           'next_xp':  21000})
    # skills.append(skill_woodcutter)
    # ch = Character.create(1, 'Alex', skills)
    # print('ok')

    # resolved_tasks = resolve_gpt_tasks(get_gpt_tasks())
    # resolved_tasks = [Task.create(x) for x in tasks_data['tasks']]
    # https://www.programiz.com/python-programming/list-comprehension

    # resolved_tasks = list(map(lambda x: Task.create(x), tasks_data['tasks']))
    # selected_task = ch.selectProperTask(resolved_tasks)
    # ch.addTask(
    #     TaskAssignment.create({
    #         "id": 1,
    #         "task_id": selected_task.id,
    #         "character_id": ch.id,
    #         "duration": 60
    #     })
    # )

    # pprint(res["unresolved_gpt_tasks"])

    # Serialization
    # json_data = json.dumps(team, default=lambda o: o.__dict__, indent=4)
    # print(json_data)

    # # Deserialization
    # decoded_team = Team(**json.loads(json_data))
    # print(decoded_team)


# https://gamedev.stackexchange.com/questions/37680/pattern-for-performing-game-actions

# https://github.com/sanjaybora04/CustomAiAssistant
# https://github.com/shpetimhaxhiu/agi-taskgenius-gpt/blob/master/app.py
# https://github.com/yoheinakajima/babyagi/tree/main
# https://github.com/yoheinakajima/babyagi/blob/main/classic/BabyElfAGI/tasks/task_registry.py
# https://jsonpickle.github.io/

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
