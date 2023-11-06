import sys
import json
import spacy
from character import *


if __name__ == '__main__':
    # ch = Character.create('Alex',)
    # nlp = spacy.load("en_core_web_lg")  # make sure to use larger package!
    # main = nlp("Agreed to start chopping logs")
    # main_no_stop_words = nlp(' '.join([str(t) for t in main if not t.is_stop]))

    # doc2 = nlp("chop down trees")
    # doc2_1 = nlp("chop logs")
    # doc3 = nlp("cook potatoes")
    # doc4 = nlp("plant seed")
    # doc5 = nlp("plant tree")

    # # Similarity of two documents
    # print(main_no_stop_words, "<->", doc2, main.similarity(doc2))
    # print(main_no_stop_words, "<->", doc2, main.similarity(doc2_1))
    # print(main_no_stop_words, "<->", doc3, main.similarity(doc3))
    # print(main_no_stop_words, "<->", doc4, main.similarity(doc4))
    # print(main_no_stop_words, "<->", doc5, main.similarity(doc5))


    #https://github.com/sanjaybora04/CustomAiAssistant
    #https://github.com/shpetimhaxhiu/agi-taskgenius-gpt/blob/master/app.py
    #https://github.com/yoheinakajima/babyagi/tree/main
    #https://github.com/yoheinakajima/babyagi/blob/main/classic/BabyElfAGI/tasks/task_registry.py
    
    nlp = spacy.load("en_core_web_lg")
    main = nlp("Search for suitable land for farming")
    main_no_stop_words = nlp(' '.join([str(t) for t in main if not t.is_stop]))

    # print(main.vector_norm)
    # sys.exit(0)
    
    with open('actions.json') as f:
        actions_data = json.load(f)

    scores = []
    
    for i in actions_data['actions']:
        print(i['patterns'])
        for x in i['patterns']:
            scores.append({'action':i['title'], 'pattern': x, 'score': main_no_stop_words.similarity(nlp(x))})
            #print(main_no_stop_words, "<->", x, main_no_stop_words.similarity(nlp(x)))
        
    
    scores.sort(key=lambda x: x.get('score'), reverse=True)
    
    for i in scores:
      print(i)
  
    
    
    # actions = [
    # { "action": "Fell trees for wood to use in building and crafting" },
    # { "action": "Gather food from the forest (foraging)" },
    # { "action": "Hunt for game in the forest" },
    # { "action": "Fish in nearby rivers or streams" },
    # { "action": "Collect berries, nuts, and edible plants" },
    # { "action": "Set up traps for small animals" },
    # { "action": "Build simple shelters or huts from available materials" },
    # { "action": "Locate a clean water source (well, river, or spring)" },
    # { "action": "Dig a well for a more reliable water supply" },
    # { "action": "Create basic tools and utensils (wooden, stone, or bone)" },
    # { "action": "Start a fire for cooking and warmth" },
    # { "action": "Explore the forest for useful plants and herbs" },
    # { "action": "Search for suitable land for farming" },
    # { "action": "Clear land for agriculture (cutting trees, removing rocks)" },
    # { "action": "Plant crops and tend to a small garden" },
    # { "action": "Hunt or gather materials for clothing and shelter (animal hides, leaves, etc.)" },
    # { "action": "Build storage facilities for food and supplies" },
    # { "action": "Establish a leadership structure for organization and decision-making" }
    # ]