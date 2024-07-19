import json
from game.llm import LLMProvider
from core.db.json_db_manager import JsonDBManager

class Cache:
    def __init__(self, db:JsonDBManager, llm: LLMProvider):
        self._db = db
        self._llm = llm

    def get_embed(self, key: str):
        embed = self._db.get_records({'text': key})
        if not embed:
            embed = self._llm.get_embed(self._target_person.name)
            self._db.add_record({"text": key, "value":embed, "type":"embed"})
        else:
            print('from cache')
            embed = embed[0]['embed']

        return embed
