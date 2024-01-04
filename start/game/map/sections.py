from core.db.json_db_manager import JsonDBManager


class Sections:
    def __init__(self, props):
        self._db: JsonDBManager = props["db"]

    def getGameSections(self):
        return self._db.getGameSections()
