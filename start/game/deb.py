import sys
import json
import spacy
from datetime import datetime
from pprint import pprint
import configparser
from core.db.json_db_manager import JsonDBManager
from core.cache import Cache
from game.character.character import *
from game.character.character_memory import CharacterMemory
from game.character.cognitive_modules.retrieve import RetrieveAction
from game.character.cognitive_modules.conversation import Conversation, Participant, ConversationStatus
from core.db.json_db_manager import JsonDBManager
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

def test_cont_conv(conv_id: int, participants, isNpc: bool, player_message: str):
    
    parser = configparser.ConfigParser()
    parser.read("config.ini")
    api_key = parser.get("OPENAI", "key")
    db = JsonDBManager()
    llm = LLMProvider(api_key)
    cache = Cache(db, llm)
    game_time = datetime.now()
    utterance = ''
    
    conv = db.get_record_by_id('conversations', conv_id)
    conversation = Conversation(db, llm, cache, conv_id)
    conversation.set_participants(participants)
    conversation.set_messages(conv['messages'])
    conversation.set_relationships(conv['relationships'])
    if isNpc:
        utterance = conversation.talk_npc(game_time)
    else :
        utterance = conversation.talk_player(player_message)

    conversation.update_conversation()
    print('Conversation Status:' + str(conversation.status))
    return utterance
    
    
def test_action():

    parser = configparser.ConfigParser()
    parser.read("config.ini")
    api_key = parser.get("OPENAI", "key")
    db = JsonDBManager()
    llm = LLMProvider(api_key)
    cache = Cache(db, llm)
    # game_time = datetime(2024, 7, 22, 11, 56)
    game_time = datetime.now()

    player_memory = CharacterMemory(llm, '')
    player = Character.create(2, False, 'Maria Lopez', player_memory)

    npm_memory = CharacterMemory(llm, 'data/test/Isabella Rodriguez/memory')
    npc = Character.create(1, True, 'Isabella Rodriguez', npm_memory)

    
    
    # new conversation
    # participants = [{'character':npc, 'is_talking': True}, {'character':player, 'is_talking': False}]
    # conversation = Conversation(db, llm, cache)
    # conversation.set_start_date(game_time)
    # conversation.set_participants(participants)
    # conversation.insert_conversation()
    # conversation.talk_npc(game_time)
    # conversation.update_conversation()

    # existing conversation continue(player)
    # conv_id = 709835299195158552
    # participants = [{'character':npc, 'is_talking': False}, {'character':player, 'is_talking': True}]
    # test_cont_conv(conv_id, participants, False, "No there is no solution for this. I DO NOT WANT TO PARTICIPATE ON THIS. This is my final answer. Please leave me alone.")
    
    
    # existing conversation continue(npc)
    # conv_id = 709835299195158552
    # participants = [{'character':npc, 'is_talking': True}, {'character':player, 'is_talking': False}]
    # test_cont_conv(conv_id, participants, True, '')
    

    # existing conversation end
    conv_id = 709835299195158552
    conv_data = db.get_record_by_id('conversations', conv_id)
    participants: List[Participant] = [{'character':npc, 'is_talking': False}, {'character':player, 'is_talking': False}]
    # conversation = Conversation(db, llm, cache, conv_id)
    # conversation.set_participants(participants)
    # conversation.set_messages(conv['messages'])
    # conversation.set_relationships(conv['relationships'])
    
    # '\nHere is a brief description of Isabella Rodriguez\nName: Isabella Rodriguez\nAge: 34\nInnate traits: friendly, outgoing, hospitable\nLearned traits: Isabella Rodriguez is a cafe owner of Hobbs Cafe who loves to make people feel welcome. She is always looking for ways to make the cafe a place where people can come to relax and enjoy themselves.\nCurrently: Isabella Rodriguez is planning on having a Valentine\'s Day party at Hobbs Cafe with her customers on February 14th, 2023 at 5pm. She is gathering party material, and is telling everyone to join the party at Hobbs Cafe on February 14th, 2023, from 5pm to 7pm.\nLifestyle: Isabella Rodriguez goes to bed around 11pm, awakes up around 6am.\nDaily plan requirement: Isabella Rodriguez opens Hobbs Cafe at 8am everyday, and works at the counter until 8pm, at which point she closes the cafe.\nCurrent Date: Thursday August 15\n\n\nOn the scale of 1 to 10, where 1 is purely mundane (e.g., routine morning greetings) and 10 is extremely poignant (e.g., a conversation about breaking up, a fight), rate the likely poignancy of the following conversation for Isabella Rodriguez.\n\nConversation: \nFrom my perspective, I was excited about the Valentine\'s Day party at Hobbs Cafe and wanted to discuss decorations with Maria. However, it seemed like Maria was upset because she felt like I left all the preparations to her. I apologized for the misunderstanding and tried to work things out, but Maria made it clear that she did not want to participate anymore. I respected her decision and will handle the preparations for the party on my own. Overall, I disliked this interaction because I had hoped to collaborate with Maria on the party planning.\n\nAnswer on a scale of 1 to 9. Respond with number only, e.g. "5"`\n  

    for participant in participants:
        if participant['character'].is_npc:
            target_person = [element for element in participants if element['character'].id != participant['character'].id][0]['character']
            # summary = participant['character'].memory.create_conversation_summary(target_person.name, conv_data['messages'], participants)
            # score = participant['character'].memory.calculate_conversation_poig_score(summary)
            # summary_embed = llm.get_embed(summary)

            summary = 'From my perspective, I was excited about the Valentine\'s Day party at Hobbs Cafe and wanted to discuss decorations with Maria. However, it seemed like Maria was upset because she felt like I left all the preparations to her. I apologized for the misunderstanding and tried to work things out, but Maria made it clear that she did not want to participate anymore. I respected her decision and will handle the preparations for the party on my own. Overall, I disliked this interaction because I had hoped to collaborate with Maria on the party planning'
            score = 8
            summary_embed = '123456'
           
            props = {
                'date' : game_time,
                'subject' : participant['character'].name,
                'predicate' : 'chat with',
                'object' : target_person.name,
                'summary' : summary,
                'keywords' : [participant['character'].name, target_person.name],
                'poignancy' : score,
                'embedding_pair' :  (summary, summary_embed),
                'filling': [{'conversation_id': conv_id}]
            }

            chat_node = participant['character'].memory.add_coversation_memory(props)

            props['filling'] = [{'node_id': chat_node.node_id}]
            props['description'] = summary
            
            participant['character'].memory.add_event_memory(props)



    # db.get_record_by_id
    # time  self.curr_time += datetime.timedelta(seconds=self.sec_per_step) ( reverie/backend_server/reverie.py )
    # when end convo
    # generate_convo_summary (plan.py)
    # chat_poignancy = generate_poig_score(persona, "chat", persona.scratch.act_description) (perceive.py)
    
    #conversation.add_conversation_message()

    # focal_points = [player.name]
    # retrieve_action = RetrieveAction(llm)
    # retrieved = retrieve_action.new_retrieve(npc, focal_points, 50)
    # generate_summarize_agent_relationship(npc, player, retrieved)

    # relationship = generate_summarize_agent_relationship(npc, player, retrieved)
    # focal_points = [f"{relationship}"],

    # generate_one_utterance(npc, player, retrieved, curr_chat)
    # curr_chat += [[ch.name, utt]]
    # convo_summary = run_gpt_prompt_summarize_conversation(persona, curr_chat)
    # Isabella Rodriguez and Maria Lopez are conversing about preparations for the Valentine's Day party


def run_gpt_prompt_summarize_conversation(persona, conversation, test_input=None, verbose=False):
    def create_prompt_input(conversation, test_input=None):
        convo_str = ""
        for row in conversation:
            convo_str += f'{row[0]}: "{row[1]}"\n'

        prompt_input = [convo_str]
        return prompt_input

    def __func_clean_up(gpt_response, prompt=""):
        ret = "conversing about " + gpt_response.strip()
        return ret

    def __func_validate(gpt_response, prompt=""):
        try:
            __func_clean_up(gpt_response, prompt)
            return True
        except:
            return False

    def get_fail_safe():
        return "conversing with a housemate about morning greetings"

    # ChatGPT Plugin ===========================================================
    def __chat_func_clean_up(gpt_response, prompt=""):
        ret = "conversing about " + gpt_response.strip()
        return ret

    def __chat_func_validate(gpt_response, prompt=""):
        try:
            __func_clean_up(gpt_response, prompt)
            return True
        except:
            return False

    prompt_template = "persona/prompt_template/v3_ChatGPT/summarize_conversation_v1.txt"
    prompt_input = create_prompt_input(conversation, test_input)
    prompt = generate_prompt(prompt_input, prompt_template)
    print(prompt)

    # ChatGPT Plugin ===========================================================


def generate_one_utterance(init_persona: Character, target_persona: Character, retrieved, curr_chat):
    # Chat version optimized for speed via batch generation
    # curr_context = (f"{init_persona.scratch_memory.name} " +
    #                 f"was {init_persona.scratch_memory.act_description} " +
    #                 f"when {init_persona.scratch_memory.name} " +
    #                 f"saw {target_persona.name}.\n")
    # f"in the middle of {target_persona.scratch_memory.act_description}.\n")
    curr_context = (f"{init_persona.scratch_memory.name} " +
                    f"is initiating a conversation with " +
                    f"{target_persona.name}.")

    run_gpt_generate_iterative_chat_utt(
        init_persona, target_persona, retrieved, curr_context, curr_chat)


def run_gpt_generate_iterative_chat_utt(init_persona: Character, target_persona: Character, retrieved, curr_context, curr_chat, test_input=None, verbose=False):
    def create_prompt_input(init_persona: Character, target_persona: Character, retrieved, curr_context, curr_chat, test_input=None):
        persona = init_persona
        prev_convo_insert = "\n"
        if persona.associative_memory.seq_chat:
            for i in persona.associative_memory.seq_chat:
                if i.object == target_persona.name:
                    v1 = int((persona.scratch_memory.curr_time -
                             i.created).total_seconds()/60)
                    prev_convo_insert += f'{str(v1)} minutes ago, {persona.scratch_memory.name} and {target_persona.name} were already {i.description} This context takes place after that conversation.'
                    break
        if prev_convo_insert == "\n":
            prev_convo_insert = ""
        # if persona.associative_memory.seq_chat:
        #     if int((persona.scratch_memory.curr_time - persona.associative_memory.seq_chat[-1].created).total_seconds()/60) > 480:
        #         prev_convo_insert = ""
        # print(prev_convo_insert)

        curr_sector = f"{init_persona.name} apartment"
        curr_arena = "living room"
        curr_location = f"{curr_arena} in {curr_sector}"

        retrieved_str = ""
        for key, vals in retrieved.items():
            for v in vals:
                retrieved_str += f"- {v.description}\n"

        convo_str = ""
        for i in curr_chat:
            convo_str += ": ".join(i) + "\n"
        if convo_str == "":
            convo_str = "[The conversation has not started yet -- start it!]"

        init_iss = f"Here is Here is a brief description of {init_persona.scratch_memory.name}.\n{init_persona.scratch_memory.get_str_iss()}"
        prompt_input = [init_iss, init_persona.scratch_memory.name, retrieved_str, prev_convo_insert,
                        curr_location, curr_context, init_persona.scratch_memory.name, target_persona.name,
                        convo_str, init_persona.scratch_memory.name, target_persona.name,
                        init_persona.scratch_memory.name, init_persona.scratch_memory.name,
                        init_persona.scratch_memory.name
                        ]
        return prompt_input

    prompt_template = "prompt_template/v3_ChatGPT/iterative_convo_v1.txt"
    prompt_input = create_prompt_input(
        init_persona, target_persona, retrieved, curr_context, curr_chat)
    prompt = generate_prompt(prompt_input, prompt_template)
    print(prompt)


def generate_summarize_agent_relationship(init_persona, target_persona, retrieved):
    all_embedding_keys = set()
    for key, val in retrieved.items():
        for i in val:
            all_embedding_keys.add(i.embedding_key)
    all_embedding_key_str = ""
    for i in all_embedding_keys:
        all_embedding_key_str += f"{i}\n"

    run_gpt_prompt_agent_chat_summarize_relationship(
        init_persona, target_persona, all_embedding_key_str)


def run_gpt_prompt_agent_chat_summarize_relationship(persona, target_persona, statements, test_input=None, verbose=False):
    def create_prompt_input(persona, target_persona, statements, test_input=None):
        prompt_input = [statements, persona.name, target_persona.name]
        return prompt_input

    prompt_template = "prompt_template/v3_ChatGPT/summarize_chat_relationship_v2.txt"
    prompt_input = create_prompt_input(persona, target_persona, statements)
    prompt = generate_prompt(prompt_input, prompt_template)
    example_output = 'Jane Doe is working on a project'
    special_instruction = 'The output should be a string that responds to the question.'
    print(prompt)


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
