import sys
import json
import spacy
import configparser
from pprint import pprint
from game.character.character import *
from game.character.character_skill import CharacterSkill
from game.character.cognitive_modules.retrieve import RetrieveAction
from game.task import *
from game.llm import LLMProvider, DecideLocationPrompt, DecideItemPrompt, DecideResourcePrompt
from game.actions import GenericAction, DecideLocationAction, DecideItemAction, DecideResourceAction
from game.map import GameObjects
from game.map import Sections

# @@ vars @@
time_scale = 20

# with open('game/tasks.json') as f:
#     tasks_data = json.load(f)

# nlp = spacy.load("en_core_web_lg")

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
    ch = Character.create(1, 'Isabella Rodriguez')
    ch.setSpatialMemory(
        'data/test/Isabella Rodriguez/bootstrap_memory/spatial_memory.json')
    ch.setAssociativeMemory(
        'data/test/Isabella Rodriguez/bootstrap_memory/associative_memory')
    ch.setScratchMemory(
        'data/test/Isabella Rodriguez/bootstrap_memory/scratch.json')

    parser = configparser.ConfigParser()
    parser.read("config.ini")
    api_key = parser.get("OPENAI", "key")
    llm = LLMProvider(api_key)
    # embed = llm.get_embed("Maria Lopez")
    # text_file = open("embed_test.txt", "w")
    # text_file.write("Purchase Amount: %s" % embed)
    # text_file.close()

    focal_points = [" Maria Lopez"]
    retrieve_action = RetrieveAction(llm)
    retrieved = retrieve_action.new_retrieve(ch, focal_points, 50)

    # set type to add distinct items
    all_embedding_keys = set()
    for key, val in retrieved.items():
        for i in val:
            all_embedding_keys.add(i.embedding_key)
    all_embedding_key_str = ""
    for i in all_embedding_keys:
        all_embedding_key_str += f"{i}\n"

    # print(all_embedding_key_str)

    prompt_template = "prompt_template/v3_ChatGPT/summarize_chat_relationship_v2.txt"
    prompt_input = create_prompt_input(ch, ch, all_embedding_key_str)
    prompt = generate_prompt(prompt_input, prompt_template)
    print(prompt)
    # Isabella Rodriguez and Maria Lopez are conversing about preparations for the Valentine's Day party


def create_prompt_input(persona: Character, target_persona, statements, test_input=None):
    prompt_input = [statements, persona.name, target_persona.name]
    return prompt_input


def generate_prompt(curr_input, prompt_lib_file):
    """
    Takes in the current input (e.g. comment that you want to classifiy) and 
    the path to a prompt file. The prompt file contains the raw str prompt that
    will be used, which contains the following substr: !<INPUT>! -- this 
    function replaces this substr with the actual curr_input to produce the 
    final promopt that will be sent to the GPT3 server. 
    ARGS:
      curr_input: the input we want to feed in (IF THERE ARE MORE THAN ONE
                  INPUT, THIS CAN BE A LIST.)
      prompt_lib_file: the path to the promopt file. 
    RETURNS: 
      a str prompt that will be sent to OpenAI's GPT server.  
    """
    if type(curr_input) == type("string"):
        curr_input = [curr_input]
    curr_input = [str(i) for i in curr_input]

    f = open(prompt_lib_file, "r")
    prompt = f.read()
    f.close()
    for count, i in enumerate(curr_input):
        prompt = prompt.replace(f"!<INPUT {count}>!", i)
    if "<commentblockmarker>###</commentblockmarker>" in prompt:
        prompt = prompt.split(
            "<commentblockmarker>###</commentblockmarker>")[1]
    return prompt.strip()


def test_whatever(db):

    # @@ task gather materials compose @@

    # fell trees for wood to use in building and crafting
    action_descr = 'fell trees for wood to use in building and crafting'
    # find section(s)
    sections = Sections({'db': db})
    game_objects = GameObjects({'db': db})
    a_loc = DecideLocationAction(
        {'sections': sections.getGameSections(),
         'action_descr': action_descr,
         'decide_location_prompt': DecideLocationPrompt({'llm': LLMProvider()})
         }
    )
    retLoc = a_loc.execute()
    sectionIds = [e["id"] for e in retLoc]
    # find section(s)'s game object(s)
    a_it = DecideItemAction(
        {'selected_sections': sectionIds,
         'game_objects': game_objects.getGameObjects(),
         'action_descr': action_descr,
         'decide_item_prompt': DecideItemPrompt({'llm': LLMProvider()})
         }
    )

    itLoc = a_it.execute()
    mItLoc = []
    for gm in itLoc:
        mItLoc.append({"id": gm["id"], "section_id": gm["section_id"]})

    # find resource(s) gathered from game object(s)
    trLoc = []
    for gm in itLoc:
        a_res = DecideResourceAction(
            {
                'selected_game_object': gm,
                'action_descr': action_descr,
                'decide_resource_prompt': DecideResourcePrompt({'llm': LLMProvider()})
            }
        )
        res = a_res.execute()
        trLoc.append(res)

    # get action verb
    # get and calculate action execution time
    a_gen = GenericAction(
        {'action_descr': action_descr}
    )

    action_duration = a_gen.get_execution_duration()
    action_verb = a_gen.get_execution_duration()

    # create game object(s) if not exist
    # create relation between action - game object - resource
    # get game object(s) status after action
    # define game object(s) cases (e.x animal hunt (movable, flying), fishing or underwater, mining (percentage of find))
    ret = {
        'task': action_descr,
        'type': 'gather-material',
        'resources': trLoc,
        'action': action_verb,
        'params': {'sections': sectionIds, 'game_objects': mItLoc},
        'action_duration': action_duration
    }

    return ret
    print("ok")
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

# https://github.com/cpacker/MemGPT/tree/main
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
