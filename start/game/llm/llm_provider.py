from typing import List
from game.llm.mockai import MockAIAPI
from game.llm.openai import OpenAIAPI


class LLMProvider:
    def __init__(
        self,
        api_key
    ):
        self._api = OpenAIAPI(api_key)

    def request(self, llm_params, prompt):
        return self._api.request(llm_params, prompt)

    def get_embed(self, query: str) -> List[float]:
        return self._api.embed(query)
