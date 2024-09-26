import json
from game.llm import LLMProvider
from core.db.json_db_manager import JsonDBManager
from typing import List

class Cache:
    def __init__(self, db:JsonDBManager, llm: LLMProvider):
        self._db = db
        self._llm = llm

    def get_embed(self, key: str)->List[float]:
        embed = self._db.get_records('embeds', {'text': key})
        if not embed:
            embed = self._llm.get_embed(key)
            self._db.add_record('embeds', {"text": key, "value":embed, "type":"embed"})
        else:
            print('from cache')
            embed = embed[0]['value']

        return embed
