from game.actions.decide_location import DecideLocationAction
from game.llm import DecideLocationPrompt, OpenAIAPI


class GatherResourcesTask:
    def __init__(self, props):
        self._id = 1

    @classmethod
    def create(cls, props):
        return cls(props)

    @property
    def id(self):
        return self._id

    def setup(self):
        # query embeddings
        pass

    def create(self):
        # create new action
        a_loc = DecideLocationAction(
            {'decide_location_prompt': DecideLocationPrompt({'llm': OpenAIAPI()})})
        print(a_loc.execute())

    def execute():
        # execute created or existing action
        pass
