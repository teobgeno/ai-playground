from typing import List, Any
from pydantic import BaseModel, ValidationError
import json
from game.llm import LLMProvider
from game.llm import BasePrompt


class DecideItemModel(BaseModel):
    item: str


class DecideItemResponse(BaseModel):
    res: List[DecideItemModel]


class DecideItemPrompt(BasePrompt):
    def __init__(self, props):
        self._llm: LLMProvider = props["llm"]

    @classmethod
    def create(cls, props):
        return cls(props)

    def execute(self, action_descr: str, game_objects: List[str]):
        # TODO:: query llm
        game_objects_str = ','.join([e for e in game_objects])

        prompt_data = []
        prompt_data.append({"keyword": "ACTION", "value": action_descr})
        prompt_data.append(
            {"keyword": "GAMEOBJECTS", "value": game_objects_str})
        prompt_file = "game/llm/prompts/decide_item/decide_item_resource.txt"
        prompt = self.parse_prompt(prompt_file, prompt_data)
        response = self._llm.request(self.get_llm_params(), prompt)
        parsed_response: DecideItemModel = self.get_valid_response(response)
        if parsed_response is not None:
            return [e["item"] for e in parsed_response]

        return []

    def get_valid_response(self, response):
        try:
            ret = None
            parsed_response = json.loads(response)
            if isinstance(parsed_response, list):
                validated_response = DecideItemResponse.model_validate(
                    {"res": parsed_response})
                ret = parsed_response
            else:
                validated_response = DecideItemResponse.model_validate(
                    {"res": [parsed_response]})
                ret = [parsed_response]

            return ret
        except ValidationError as e:
            print("Unable to validate LLM response.")
            return None
        except Exception as e:
            print(f"unhandled : {e}")
            return None

    def get_llm_params(self):
        return {"max_tokens": 1000, "temperature": 0, "top_p": 1, "stream": False, "frequency_penalty": 0, "presence_penalty": 0, "stop": None}
