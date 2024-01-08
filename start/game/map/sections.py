from pydantic import BaseModel
from core.db.json_db_manager import JsonDBManager


class SectionsDef(BaseModel):
    id: int
    parent_id: int
    keyword: str
    title: str


class Sections:
    def __init__(self, props):
        self._db: JsonDBManager = props["db"]

    def getGameSections(self):
        return self._db.getGameSections()
