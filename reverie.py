import json
import numpy
import datetime
import pickle
import time
import math
import os
import shutil
import traceback

from global_methods import *
from utils import *
from maze import *
from persona.persona import *

class ReverieServer: 
      def __init__(self):
            sim_folder = "base_the_ville_isabella_maria_klaus"
            with open(f"{sim_folder}/reverie/meta.json") as json_file:  
                  reverie_meta = json.load(json_file)

            # LOADING REVERIE'S GLOBAL VARIABLES
            # The start datetime of the Reverie: 
            # <start_datetime> is the datetime instance for the start datetime of 
            # the Reverie instance. Once it is set, this is not really meant to 
            # change. It takes a string date in the following example form: 
            # "June 25, 2022"
            # e.g., ...strptime(June 25, 2022, "%B %d, %Y")
            self.start_time = datetime.datetime.strptime(
                                    f"{reverie_meta['start_date']}, 00:00:00",  
                                    "%B %d, %Y, %H:%M:%S")
            # <curr_time> is the datetime instance that indicates the game's current
            # time. This gets incremented by <sec_per_step> amount everytime the world
            # progresses (that is, everytime curr_env_file is recieved). 
            self.curr_time = datetime.datetime.strptime(reverie_meta['curr_time'], 
                                                            "%B %d, %Y, %H:%M:%S")
            # <sec_per_step> denotes the number of seconds in game time that each 
            # step moves foward. 
            self.sec_per_step = reverie_meta['sec_per_step']

            # <step> denotes the number of steps that our game has taken. A step here
            # literally translates to the number of moves our personas made in terms
            # of the number of tiles. 
            self.step = reverie_meta['step']

            # SETTING UP PERSONAS IN REVERIE
            # <personas> is a dictionary that takes the persona's full name as its 
            # keys, and the actual persona instance as its values.
            # This dictionary is meant to keep track of all personas who are part of
            # the Reverie instance. 
            # e.g., ["Isabella Rodriguez"] = Persona("Isabella Rodriguezs")
            self.personas = dict()


            # Loading in all personas. 
            init_env_file = f"{sim_folder}/environment/{str(self.step)}.json"
            init_env = json.load(open(init_env_file))
            for persona_name in reverie_meta['persona_names']: 
                  persona_folder = f"{sim_folder}/personas/{persona_name}"
                  p_x = init_env[persona_name]["x"]
                  p_y = init_env[persona_name]["y"]
                  curr_persona = Persona(persona_name, persona_folder)
                  self.personas[persona_name] = curr_persona

            print(self.personas['Isabella Rodriguez'])


if __name__ == '__main__':
      rs = ReverieServer()
