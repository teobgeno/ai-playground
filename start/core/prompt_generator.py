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
