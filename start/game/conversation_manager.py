import configparser
from core.db.json_db_manager import JsonDBManager
from game.llm import LLMProvider
from core.cache import Cache

class ConversationManager:
    def __init__(self, parser: configparser, db: JsonDBManager, llm: LLMProvider, cache: Cache, params):
        self._parcer = parser
        self._db = db
        self._llm  = llm
        self._cache = cache
        #params
        #conversation_id : int or null if new
        #participants : [character_id, character_id]
        #character_id_talk: character_id
            

    def create_participants():
        pass
    def start_conversation():
        # participants = [{'character':npc, 'is_talking': True}, {'character':player, 'is_talking': False}]
        # conversation = Conversation(db, llm, cache)
        # conversation.set_start_date(game_time)
        # conversation.set_participants(participants)
        # conversation.insert_conversation()
        # conversation.talk_npc(game_time)
        # conversation.update_conversation()
        pass

    def continue_conversation():
        # existing conversation continue(player)
        # conv_id = 709835299195158552
        # participants = [{'character':npc, 'is_talking': False}, {'character':player, 'is_talking': True}]
        # test_cont_conv(conv_id, participants, False, "bla bla.")
    
    
        # existing conversation continue(npc)
        # conv_id = 709835299195158552
        # participants = [{'character':npc, 'is_talking': True}, {'character':player, 'is_talking': False}]
        # test_cont_conv(conv_id, participants, True, '')
        pass

    def end_conversation():
        pass