class TaskAssignment:
    def __init__(self, props):
        self._id = props["id"]
        self._task_id = props["task_id"]
        self._character_id = props["character_id"]
        self._duration = props["duration"]  # seconds
        self._priority = 0

    @classmethod
    def create(cls, props):
        return cls(props)

    @property
    def id(self):
        return self._id
