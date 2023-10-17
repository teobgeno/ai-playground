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
            self.sim_code = "base_the_ville_isabella_maria_klaus"
            sim_folder = f"{fs_storage}/{self.sim_code}"
            
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

           # <maze> is the main Maze instance. Note that we pass in the maze_name
            # (e.g., "double_studio") to instantiate Maze. 
            # e.g., Maze("double_studio")
            self.maze = Maze(reverie_meta['maze_name'])

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

            # <personas_tile> is a dictionary that contains the tile location of
            # the personas (!-> NOT px tile, but the actual tile coordinate).
            # The tile take the form of a set, (row, col). 
            # e.g., ["Isabella Rodriguez"] = (58, 39)
            self.personas_tile = dict()


            # Loading in all personas. 
            init_env_file = f"{sim_folder}/environment/{str(self.step)}.json"
            init_env = json.load(open(init_env_file))
            for persona_name in reverie_meta['persona_names']: 
                  persona_folder = f"{sim_folder}/personas/{persona_name}"
                  p_x = init_env[persona_name]["x"]
                  p_y = init_env[persona_name]["y"]
                  curr_persona = Persona(persona_name, persona_folder)

                  self.personas[persona_name] = curr_persona
                  self.personas_tile[persona_name] = (p_x, p_y)
                  self.maze.tiles[p_y][p_x]["events"].add(curr_persona.scratch
                                                      .get_curr_event_and_desc())

           

            curr_sim_code = dict()
            curr_sim_code["sim_code"] = self.sim_code
            with open(f"{fs_temp_storage}/curr_sim_code.json", "w") as outfile: 
                  outfile.write(json.dumps(curr_sim_code, indent=2))
            
            curr_step = dict()
            curr_step["step"] = self.step
            with open(f"{fs_temp_storage}/curr_step.json", "w") as outfile: 
                  outfile.write(json.dumps(curr_step, indent=2))

            for persona_name, persona in self.personas.items():
                  print(persona.scratch.get_curr_event_and_desc())
            
            movements = {"persona": dict(), 
                       "meta": dict()}
            for persona_name, persona in self.personas.items(): 
                  # <next_tile> is a x,y coordinate. e.g., (58, 9)
                  # <pronunciatio> is an emoji. e.g., "\ud83d\udca4"
                  # <description> is a string description of the movement. e.g., 
                  #   writing her next novel (editing her novel) 
                  #   @ double studio:double studio:common room:sofa
                  
                  # July1_the_ville_isabella_maria_klaus-step-3-3
                  next_tile, pronunciatio, description = persona.move(
                  self.maze, self.personas, self.personas_tile[persona_name], 
                  self.curr_time)
                  movements["persona"][persona_name] = {}
                  movements["persona"][persona_name]["movement"] = next_tile
                  movements["persona"][persona_name]["pronunciatio"] = pronunciatio
                  movements["persona"][persona_name]["description"] = description
                  movements["persona"][persona_name]["chat"] = (persona
                                                            .scratch.chat)

            # Include the meta information about the current stage in the 
            # movements dictionary. 
            movements["meta"]["curr_time"] = (self.curr_time 
                                                .strftime("%B %d, %Y, %H:%M:%S"))

            # We then write the personas' movements to a file that will be sent 
            # to the frontend server. 
            # Example json output: 
            # {"persona": {"Maria Lopez": {"movement": [58, 9]}},
            #  "persona": {"Klaus Mueller": {"movement": [38, 12]}}, 
            #  "meta": {curr_time: <datetime>}}
            curr_move_file = f"{sim_folder}/movement/{self.step}.json"
            with open(curr_move_file, "w") as outfile: 
                  outfile.write(json.dumps(movements, indent=2))


if __name__ == '__main__':
      rs = ReverieServer()
