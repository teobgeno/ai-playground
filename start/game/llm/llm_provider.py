from game.llm.mockai import MockAIAPI


class LLMProvider:
    def __init__(
        self,
    ):
        self._api = MockAIAPI()

    def request(self, llm_params, prompt):
        return self._api.request(llm_params, prompt)
