
class GatherResourcesTask:
    def __init__(self, props):
        self._id = props["id"]

    @classmethod
    def create(cls, props):
        return cls(props)

    @property
    def id(self):
        return self._id

    def setup():
        # query embeddings
        pass

    def create():
        # create new action
        pass

    def execute():
        # execute created or existing action
        pass
