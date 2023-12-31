class Material:
    def __init__(self, props):
        self._id = props["id"]

    @classmethod
    def create(cls, props):
        return cls(props)

    @property
    def id(self):
        return self._id
