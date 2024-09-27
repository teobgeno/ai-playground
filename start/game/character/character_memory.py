from numpy import dot
from numpy.linalg import norm
from game.llm import LLMProvider
from core.cache import Cache
# from game.character.cognitive_modules.conversation import Conversation
from core.prompt_generator import conversation_summary_prompt
from core.prompt_generator import conversation_poig_score_prompt
from core.prompt_generator import conversation_memory_prompt
from core.prompt_generator import conversation_planning_thought_prompt
from core.prompt_generator import generate_focal_points_prompt
from core.prompt_generator import generate_insights_and_evidence_prompt
from core.prompt_generator import event_poig_score_prompt
from game.character.memory_structures.spatial_memory import MemoryTree
from game.character.memory_structures.associative_memory import AssociativeMemory
from game.character.memory_structures.scratch import Scratch
from typing import cast, List
from schema.memory import *
# from schema.conversation import MessageDef, ParticipantDef

class CharacterMemory:

    def __init__(self, llm: LLMProvider, base_path: str):
        # self.spatial
        # self.associative
        # self.scratch
        self._llm = llm
        self._base_path = base_path
        if base_path !='':
            self.setSpatial()
            self.setAssociative()
            self.setScratch()


    def setSpatial(self):
        self.spatial = MemoryTree(self._base_path + '/spatial_memory.json')

    def setAssociative(self):
        self.associative = AssociativeMemory(self._base_path + '/associative_memory')

    def setScratch(self):
        self.scratch = Scratch(self._base_path + '/scratch.json')

    def save_associative(self):
        self.associative.save(self._base_path + '/associative_memory')

    def save_scratch(self):
        self.scratch.save(self._base_path + '/scratch.json')

    def cos_sim(self, a, b):
        """
        This function calculates the cosine similarity between two input vectors 
        'a' and 'b'. Cosine similarity is a measure of similarity between two 
        non-zero vectors of an inner product space that measures the cosine 
        of the angle between them.

        INPUT: 
            a: 1-D array object 
            b: 1-D array object 
        OUTPUT: 
            A scalar value representing the cosine similarity between the input 
            vectors 'a' and 'b'.

        Example input: 
            a = [0.3, 0.2, 0.5]
            b = [0.2, 0.2, 0.5]
        """
        return dot(a, b)/(norm(a)*norm(b))

    def normalize_dict_floats(self, d, target_min, target_max):
        """
        This function normalizes the float values of a given dictionary 'd' between 
        a target minimum and maximum value. The normalization is done by scaling the
        values to the target range while maintaining the same relative proportions 
        between the original values.

        INPUT: 
            d: Dictionary. The input dictionary whose float values need to be 
            normalized.
            target_min: Integer or float. The minimum value to which the original 
                        values should be scaled.
            target_max: Integer or float. The maximum value to which the original 
                        values should be scaled.
        OUTPUT: 
            d: A new dictionary with the same keys as the input but with the float
            values normalized between the target_min and target_max.

        Example input: 
            d = {'a':1.2,'b':3.4,'c':5.6,'d':7.8}
            target_min = -5
            target_max = 5
        """
        min_val = min(val for val in d.values())
        max_val = max(val for val in d.values())
        range_val = max_val - min_val

        if range_val == 0:
            for key, val in d.items():
                d[key] = (target_max - target_min)/2
        else:
            for key, val in d.items():
                d[key] = ((val - min_val) * (target_max -
                        target_min) / range_val + target_min)
        return d

    def top_highest_x_values(self, d, x):
        """
        This function takes a dictionary 'd' and an integer 'x' as input, and 
        returns a new dictionary containing the top 'x' key-value pairs from the 
        input dictionary 'd' with the highest values.

        INPUT: 
            d: Dictionary. The input dictionary from which the top 'x' key-value pairs 
            with the highest values are to be extracted.
            x: Integer. The number of top key-value pairs with the highest values to
            be extracted from the input dictionary.
        OUTPUT: 
            A new dictionary containing the top 'x' key-value pairs from the input 
            dictionary 'd' with the highest values.

        Example input: 
            d = {'a':1.2,'b':3.4,'c':5.6,'d':7.8}
            x = 3
        """
        top_v = dict(sorted(d.items(),
                            key=lambda item: item[1],
                            reverse=True)[:x])
        return top_v

    def extract_recency(self, nodes):
        """
        Gets the current Persona object and a list of nodes that are in a 
        chronological order, and outputs a dictionary that has the recency score
        calculated.

        INPUT: 
            persona: Current persona whose memory we are retrieving. 
            nodes: A list of Node object in a chronological order. 
        OUTPUT: 
            recency_out: A dictionary whose keys are the node.node_id and whose values
                        are the float that represents the recency score. 
        """
        recency_vals = [self.scratch.recency_decay ** i
                        for i in range(1, len(nodes) + 1)]

        recency_out = dict()
        for count, node in enumerate(nodes):
            recency_out[node.node_id] = recency_vals[count]

        return recency_out

    def extract_importance(self, nodes):
        """
        Gets the current Persona object and a list of nodes that are in a 
        chronological order, and outputs a dictionary that has the importance score
        calculated.

        INPUT: 
            persona: Current persona whose memory we are retrieving. 
            nodes: A list of Node object in a chronological order. 
        OUTPUT: 
            importance_out: A dictionary whose keys are the node.node_id and whose 
                            values are the float that represents the importance score.
        """
        importance_out = dict()
        for count, node in enumerate(nodes):
            importance_out[node.node_id] = node.poignancy

        return importance_out

    def extract_relevance(self, nodes, focal_pt): 
        """
        Gets the current Persona object, a list of nodes that are in a 
        chronological order, and the focal_pt string and outputs a dictionary 
        that has the relevance score calculated.

        INPUT: 
            persona: Current persona whose memory we are retrieving. 
            nodes: A list of Node object in a chronological order. 
            focal_pt: A string describing the current thought of revent of focus.  
        OUTPUT: 
            relevance_out: A dictionary whose keys are the node.node_id and whose values
                        are the float that represents the relevance score. 
        """
        # focal_embedding = get_embedding(focal_pt)
        
        relevance_out = dict()
        for count, node in enumerate(nodes): 
            node_embedding = self.associative.embeddings[node.embedding_key]
            relevance_out[node.node_id] = self.cos_sim(node_embedding, focal_pt['embed'])

        return relevance_out
    
    def new_retrieve(self, focal_points: List[FocalPointDef], n_count=30): 
        """
        Given the current persona and focal points (focal points are events or 
        thoughts for which we are retrieving), we retrieve a set of nodes for each
        of the focal points and return a dictionary. 

        INPUT: 
            persona: The current persona object whose memory we are retrieving. 
            focal_points: A list of focal points (string description of the events or
                        thoughts that is the focus of current retrieval).
        OUTPUT: 
            retrieved: A dictionary whose keys are a string focal point, and whose 
                    values are a list of Node object in the agent's associative 
                    memory.

        Example input:
            persona = <persona> object 
            focal_points = [{'text':Jane is swimming in the pond, 'embed':[-0.03697006031870842, -0.010967422276735306, 0.0015322132967412472,....]}]
        """
        # <retrieved> is the main dictionary that we are returning
        retrieved = dict() 
        for focal_pt in focal_points: 

          
            # Getting all nodes from the agent's memory (both thoughts and events) and
            # sorting them by the datetime of creation.
            # You could also imagine getting the raw conversation, but for now. 
        
            nodes = [[i.last_accessed, i]
                    for i in self.associative.seq_event + self.associative.seq_thought
                    if "idle" not in i.embedding_key]
            
            if nodes:
                nodes = sorted(nodes, key=lambda x: x[0])
                nodes = [i for created, i in nodes]

                # Calculating the component dictionaries and normalizing them.
                recency_out = self.extract_recency(nodes)
                recency_out = self.normalize_dict_floats(recency_out, 0, 1)
                importance_out = self.extract_importance(nodes)
                importance_out = self.normalize_dict_floats(importance_out, 0, 1)  
                relevance_out = self.extract_relevance(nodes, focal_pt)
                relevance_out = self.normalize_dict_floats(relevance_out, 0, 1)

                # Computing the final scores that combines the component values. 
                # Note to self: test out different weights. [1, 1, 1] tends to work
                # decently, but in the future, these weights should likely be learned, 
                # perhaps through an RL-like process.
                # gw = [1, 1, 1]
                # gw = [1, 2, 1]
                
                gw = [0.5, 3, 2]
                master_out = dict()
                for key in recency_out.keys(): 
                    master_out[key] = (self.scratch.recency_w*recency_out[key]*gw[0] 
                                    + self.scratch.relevance_w*relevance_out[key]*gw[1] 
                                    + self.scratch.importance_w*importance_out[key]*gw[2])

                # master_out = self.top_highest_x_values(master_out, len(master_out.keys()))
                # for key, val in master_out.items(): 
                #     print (self.associative.id_to_node[key].embedding_key, val)
                #     print (self.scratch.recency_w*recency_out[key]*1, 
                #             self.scratch.relevance_w*relevance_out[key]*1, 
                #             self.scratch.importance_w*importance_out[key]*1)
                    

                # Extracting the highest x values.
                # <master_out> has the key of node.id and value of float. Once we get the 
                # highest x values, we want to translate the node.id into nodes and return
                # the list of nodes.
                master_out = self.top_highest_x_values(master_out, n_count)
                master_nodes = [self.associative.id_to_node[key] for key in list(master_out.keys())]

                for n in master_nodes: 
                    n.last_accessed = self.scratch.curr_time
                
                retrieved[focal_pt['text']] = master_nodes

        return retrieved
    
    def create_conversation_summary(self, target_person_name: str, conv_messages: List[str]) -> str:
        props: SummaryPromptDef = {'init_person_name': self.scratch.name, 'init_person_iis': self.scratch.get_str_iss(), 'target_person_name': target_person_name, 'messages': conv_messages}
        messages = conversation_summary_prompt(props)
        summarize = ''
       
        summarize = self._llm.completition({'max_tokens': 200, 'temperature': 0.5, 'top_p': 1, 'stream': False, 'frequency_penalty': 0, 'presence_penalty': 0, 'stop': None}, messages)
      
        return summarize
    
    def calculate_conversation_poig_score(self, conversation_summary: str) -> int:
        messages = conversation_poig_score_prompt({'init_person_name': self.scratch.name, 'init_person_iis': self.scratch.get_str_iss(), 'conversation_summary': conversation_summary})
        
        score = int(self._llm.completition({'max_tokens': 1, 'temperature': 0, 'top_p': 1, 'stream': False, 'frequency_penalty': 0, 'presence_penalty': 0, 'stop': None}, messages))
    
        return score
    
    def create_conversation_memory(self, target_person_name: str, conv_messages: List[str]) -> str:
        messages = conversation_memory_prompt({'init_person_name': self.scratch.name, 'init_person_iis': self.scratch.get_str_iss(), 'target_person_name': target_person_name, 'messages': conv_messages})
        
        memory = self._llm.completition({'max_tokens': 200, 'temperature': 0.5, 'top_p': 1, 'stream': False, 'frequency_penalty': 0, 'presence_penalty': 0, 'stop': None}, messages)
        return memory
    
    def create_conversation_planning_thought(self, target_person_name: str, conv_messages: List[str]) -> str:
        messages = conversation_planning_thought_prompt({'init_person_name': self.scratch.name, 'init_person_iis': self.scratch.get_str_iss(), 'target_person_name': target_person_name, 'messages': conv_messages})
        
        memory = self._llm.completition({'max_tokens': 200, 'temperature': 0.5, 'top_p': 1, 'stream': False, 'frequency_penalty': 0, 'presence_penalty': 0, 'stop': None}, messages)
        return memory
    
    def calculate_event_poig_score(self, event_description: str) -> int:
        messages = event_poig_score_prompt({'init_person_name': self.scratch.name, 'init_person_iis': self.scratch.get_str_iss(), 'event_description': event_description})
        
        score = int(self._llm.completition({'max_tokens': 1, 'temperature': 0, 'top_p': 1, 'stream': False, 'frequency_penalty': 0, 'presence_penalty': 0, 'stop': None}, messages))
    
        return score
    
    def insert_to_memory(self, props):
        if props['type'] == 'conversation':
             return self.associative.add_chat(props['created'], props['expires'], props['subject'], props['predicate'], props['object'],  props['description'], props['keywords'], props['poignancy'], props['embedding_pair'], props['filling'])
        elif props['type'] == 'thought':
            return self.associative.add_thought(props['created'], props['expires'], props['subject'], props['predicate'], props['object'], props['description'],  props['keywords'], props['poignancy'], props['embedding_pair'], props['filling'])
        else:
            return self.associative.add_event(props['created'], props['expires'], props['subject'], props['predicate'], props['object'], props['description'],  props['keywords'], props['poignancy'], props['embedding_pair'], props['filling'])
       
    # def add_conversation_memory(self, props):
    #     return self.associative.add_chat(props['created'], props['expires'], props['subject'], props['predicate'], props['object'],  props['description'], props['keywords'], props['poignancy'], props['embedding_pair'], props['filling'])

    # def add_event_memory(self, props):
    #    self.associative.add_event(props['created'], props['expires'], props['subject'], props['predicate'], props['object'], props['description'],  props['keywords'], props['poignancy'], props['embedding_pair'], props['filling'])

    def update_reflect_trigger(self, event_poignancy: int):
        self.scratch.importance_trigger_curr -= event_poignancy
        self.scratch.importance_ele_n += 1

    def reflect(self):
        if self.reflection_trigger():
            self.process_reflect()

    def reflection_trigger(self): 
        """
        Given the current persona, determine whether the persona should run a 
        reflection. 
        
        Our current implementation checks for whether the sum of the new importance
        measure has reached the set (hyper-parameter) threshold.

        INPUT: 
            persona: Current Persona object
        Output: 
            True if we are running a new reflection. 
            False otherwise. 
        """
        if (self.scratch.importance_trigger_curr <= 0 and 
            [] != self.associative.seq_event + self.associative.seq_thought): 
            return True 
        return True
    
    def reset_reflection_counter(self): 
        """
        We reset the counters used for the reflection trigger. 

        INPUT: 
            persona: Current Persona object
        Output: 
            None
        """
        self.scratch.importance_trigger_curr = self.scratch.importance_trigger_max
        self.scratch.importance_ele_n = 0
    
    def process_reflect(self):
        focal_points_res = self.generate_focal_points(3)
        focal_points_list: List[str] = focal_points_res.strip('][').replace('"', '').split(', ')

        focal_points: List[FocalPointDef] = []
        for focal_point in focal_points_list:
            embed = self._llm.get_embed(focal_point)
            focal_points.append({'text':focal_point, 'embed':embed})
        # focal_points=[{'text':relationship, 'embed':embed}]
        retrieved = self.new_retrieve(focal_points)

        print("-----------------")
        for focal_pt, nodes in retrieved.items(): 

            thoughts = self.generate_insights_and_evidence(nodes, 5)
            print('ok')
            # for thought, evidence in thoughts.items(): 
            #     created = self.scratch.curr_time
            #     expiration = self.scratch.curr_time + datetime.timedelta(days=30)
            #     s, p, o = ""
            #     keywords = set([s, p, o])
            #     thought_poignancy = generate_poig_score(persona, "thought", thought)
            #     thought_embedding_pair = (thought, get_embedding(thought))

            #     self.associative.add_thought(created, expiration, s, p, o, 
            #                                 thought, keywords, thought_poignancy, 
            #                                 thought_embedding_pair, evidence)

    def generate_focal_points(self, n=3): 
       
        nodes = [[i.last_accessed, i]
                    for i in self.associative.seq_event + self.associative.seq_thought
                    if "idle" not in i.embedding_key]

        nodes = sorted(nodes, key=lambda x: x[0])
        nodes = [i for created, i in nodes]

        messages = generate_focal_points_prompt({'quantity': n, 'nodes': nodes[-1*self.scratch.importance_ele_n:]})
        focal_points = self._llm.completition({'max_tokens': 300, 'temperature': 0.5, 'top_p': 1, 'stream': False, 'frequency_penalty': 0, 'presence_penalty': 0, 'stop': None}, messages)
        return focal_points
    
    def generate_insights_and_evidence(self, nodes, n=5): 

        messages = generate_insights_and_evidence_prompt({'quantity': n, 'nodes': nodes})

        insights = self._llm.completition({'max_tokens': 300, 'temperature': 0.5, 'top_p': 1, 'stream': False, 'frequency_penalty': 0, 'presence_penalty': 0, 'stop': None}, messages)
        return insights


    
# "node_545": {
#     "node_count": 545,
#     "type_count": 2,
#     "type": "chat",
#     "depth": 0,
#     "created": "2023-02-13 15:19:20",
#     "expiration": null,
#     "subject": "Isabella Rodriguez",
#     "predicate": "chat with",
#     "object": "Maria Lopez",
#     "description": "conversing about preparations for the Valentine's Day party at Hobbs Cafe including decorations and snacks, with Isabella Rodriguez and Maria Lopez",
#     "embedding_key": "conversing about preparations for the Valentine's Day party at Hobbs Cafe including decorations and snacks, with Isabella Rodriguez and Maria Lopez",
#     "poignancy": 6,
#     "keywords": [
#       "Isabella Rodriguez",
#       "Maria Lopez"
#     ],