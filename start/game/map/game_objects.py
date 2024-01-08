from pydantic import BaseModel
from core.db.json_db_manager import JsonDBManager


class GameObjectsDef(BaseModel):
    id: int
    section_id: int
    parent_id: int
    keyword: str
    title: str


class GameObjects:
    def __init__(self, props):
        self._db: JsonDBManager = props["db"]

    def getGameObjects(self):
        return self._db.getGameObjects()
