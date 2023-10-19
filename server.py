from agent.persona import *

if __name__ == '__main__':
  curr_time = datetime.datetime.strptime("February 13, 2023, 00:00:00", 
                                            "%B %d, %Y, %H:%M:%S")
  p = Persona('Nikos Matsablokos')
  p.move(curr_time)