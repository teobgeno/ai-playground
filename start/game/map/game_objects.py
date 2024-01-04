from core.db.json_db_manager import JsonDBManager


class GameObjects:
    def __init__(self, props):
        self._db: JsonDBManager = props["db"]

    def getGameObjects(self):
        return self._db.getGameObjects()
