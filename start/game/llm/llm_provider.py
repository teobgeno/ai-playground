from game.llm.mockai import MockAIAPI


class LLMProvider:
    def __init__(
        self,
    ):
        self._api = MockAIAPI()

    def request(self):
        self._api.request()
