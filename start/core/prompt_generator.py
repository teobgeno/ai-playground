from typing import List

def get_conversation_summary_prompt(props):
 
        tpl = """
You are {props[init_person_name]}, and you just finished the following conversation with {props[target_person_name]}. I would
like you to summarize the conversation from {props[init_person_name]}'s perspective, using first-person pronouns like
"I," and add if you liked or disliked this interaction.
Conversation:
         """
        for message in props['messages']:
                tpl += [e['character'].name for e in props['participants'] if e['character'].id == message['character_id']][0] + ' :' + message['message'] + '\n'

        print(tpl.format(props=props))
        return tpl.format(props=props)
    
    
def generate_conversation_poig_score(props):
    tpl = """
Here is a brief description of {props[init_person_name]}
{props[init_person_iis]}\n
On the scale of 1 to 10, where 1 is purely mundane (e.g., routine morning greetings) and 10 is extremely poignant (e.g., a conversation about breaking up, a fight), rate the likely poignancy of the following conversation for {props[init_person_name]}.\n
Conversation: 
{props[conversation_summary]}\n
Answer on a scale of 1 to 9. Respond with number only, e.g. "5"`
        """
        
    return tpl.format(props=props)



def get_relation_prompt(self, props):
        tpl = """
[Statements]
{props[statements]}\n
What do you think about {props[target_person_name]}?
        """
        #  \nBased on the statements above, summarize {props[init_person_name]} and {props[target_person_name]}'s relationship. What do they feel or know about each other?
        print(tpl.format(props=props))
        return [{'role': 'user', 'content': tpl.format(props=props)}]


def get_utterance_prompt(self, props):
        query_fragments: List[str] = []
        tpl = """
Context for the task:\n
PART 1.\n
Here is a brief description of {props[init_person_name]}
{props[init_person_iis]}
Here is the memory that is in {props[init_person_name]}'s head:
{props[init_person_retrieved_memories]}
PART 2.\n
Current Location: {props[target_person_name]} Farm\n
Current Context:
You are roleplaying {props[init_person_name]}, and you're currently in a conversation with {props[target_person_name]}.The conversation started at {props[start_date]}. It's now {props[current_date]}.\n
"""
        
        if  len(props["messages"]):
            tpl +="""
            Below is the current conversation history between you and {props[target_person_name]}.\n
            """
            for message in props["messages"]:
                tpl += [e['character'].name for e in props["participants"] if e['character'].id == message['character_id']][0] + ' :' + message['message'] + '\n'
        else:
            tpl +="""The conversation has not started yet -- start it!.\n"""

        tpl +="""
---
Task: Given the above, what should you say to {props[target_person_name]} next in the conversation? And did you end the conversation?
DO NOT greet them again. Do NOT use the word "Hey" too often. Talk like a human being and not like an assistant bot.
Output format: Output a json of the following format: 
{{
"utterance": "{props[init_person_name]}'s utterance>",
"Did the conversation end?": "<json Boolean>"
}}
"""

        query_fragments.append(tpl.format(props=props))
        print(tpl.format(props=props))
        return [{'role': 'user', 'content': "\n".join(query_fragments)}]


def generate_focal_points(props):
        tpl = ""

        for statement in props["statements"]:
                tpl += statement + '\n'
    
        tpl += """
Given only the information above, what are {props[quantity]} most salient high-level questions we can answer about the subjects grounded in the statements?
Return in JSON format, where the key is a list of input statements that contributed to your insights and value is your insight. Make the response parseable by python json.loads function. DO NOT escape characters or include "\n" or white space in response.
'Example: [{insight: "...", statementIds: [1,2]}, {insight: "...", statementIds: [1]}, ...]'
        """
        return [{'role': 'user', 'content': tpl.format(props=props)}]



'''
        ---- Prompts To Check ----
        Keep responses concise.
        Do not offer information that is irrelevant to the current conversation.
        NEVER mention you are an AI language model. You MUST stay in character and respond ONLY as {props[init_person_name]}
        Be sure to include some detail or question about a previous conversation in your greeting.
        You've decided to leave the question and would like to politely tell them you're leaving the conversation
        How would you like to tell them that you're leaving? Your response should be brief and within 200 characters.
'''