from agent.persona import *

if __name__ == '__main__':
  curr_time = datetime.datetime.strptime("February 13, 2023, 06:00:00", 
                                            "%B %d, %Y, %H:%M:%S")
  i = Persona('Isabella Rodriguez')
  k = Persona('Klaus Mueller')

  personas = dict()
  personas['Isabella Rodriguez'] = i
  personas['Klaus Mueller'] = k

  i.move(curr_time, personas)
