class Task:
    def __init__(self, props):
        self._id = props["id"]
        self._title = props["title"]
        self._patterns = props["patterns"]
        self.factors = props["factors"]

    @classmethod
    def create(cls, props):
        return cls(props)
