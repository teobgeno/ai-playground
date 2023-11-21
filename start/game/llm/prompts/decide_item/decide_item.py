from typing import List, Any
from pydantic import BaseModel, ValidationError
import json
from game.llm import LLMProvider
from game.llm import PromptParser


class DecideItemModel(BaseModel):
    existing_items: str
    new_generated_items: str


class DecideItemResponse(BaseModel):
    res: List[DecideItemModel]


class DecideItemPrompt:
    def __init__(self, props):
        self._llm: LLMProvider = props["llm"]

    @classmethod
    def create(cls, props):
        return cls(props)

    def choose_game_objects(self, action_descr: str, sections: List[str]):
        # TODO:: query llm
        sections_str = ','.join([e for e in sections])

        prompt_data = []
        prompt_data.append({"keyword": "ACTION", "value": action_descr})
        prompt_data.append({"keyword": "SECTIONS", "value": sections_str})
        prompt_file = "game/llm/prompts/decide_item/decide_item.txt"
        prompt = self.parse_prompt(prompt_file, prompt_data)
        response = self._llm.request(self.get_llm_params(), prompt)
        parsed_response: DecideItemModel = self.get_valid_response(response)
        ret = {"existing_objects": [], "new_objects": []}
        if parsed_response is not None:
            if parsed_response[0]["existing_items"] != "none":
                ret["existing_objects"] = parsed_response[0]["existing_items"].split(
                    ",")

            if parsed_response[0]["new_generated_items"] != "none":
                ret["new_objects"] = parsed_response[0]["new_generated_items"].split(
                    ",")

            return ret

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

    def get_llm_params(self):
        return {"max_tokens": 1000, "temperature": 0, "top_p": 1, "stream": False, "frequency_penalty": 0, "presence_penalty": 0, "stop": None}

    def parse_prompt(self, prompt_file, prompt_data):
        parser = PromptParser()
        parsed_prompt = parser.generate_prompt(prompt_file, prompt_data)
        # parser.print_run_prompts(parsed_prompt)
        return parsed_prompt


# https://xebia.com/blog/enforce-and-validate-llm-output-with-pydantic/
