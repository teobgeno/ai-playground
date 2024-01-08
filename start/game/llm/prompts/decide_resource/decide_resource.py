from typing import List, Any
from pydantic import BaseModel, ValidationError
import json
from game.llm import LLMProvider
from game.llm import PromptParser


class DecideResourceModel(BaseModel):
    resource: str


class DecideResourceResponse(BaseModel):
    res: List[DecideResourceModel]


class DecideResourcePrompt:
    def __init__(self, props):
        self._llm: LLMProvider = props["llm"]

    @classmethod
    def create(cls, props):
        return cls(props)

    def execute(self, action_descr: str, game_object: str):

        prompt_data = []
        prompt_data.append({"keyword": "ACTION", "value": action_descr})
        prompt_data.append({"keyword": "GAMEOBJECT", "value": game_object})
        prompt_file = "game/llm/prompts/decide_resource/decide_resource.txt"
        prompt = self.parse_prompt(prompt_file, prompt_data)
        response = self._llm.request(self.get_llm_params(), prompt)
        parsed_response = self.get_valid_response(response)
        if parsed_response is not None:
            return [e["resource"] for e in parsed_response]

        return []

    def get_valid_response(self, response):
        try:
            ret = None
            parsed_response = json.loads(response)
            if isinstance(parsed_response, list):
                validated_response = DecideResourceResponse.model_validate(
                    {"res": parsed_response})
                ret = parsed_response
            else:
                validated_response = DecideResourceResponse.model_validate(
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

    def parse_prompt(self, prompt_file, prompt_data):
        parser = PromptParser()
        parsed_prompt = parser.generate_prompt(prompt_file, prompt_data)
        parser.print_run_prompts(parsed_prompt)
        return parsed_prompt


# https://xebia.com/blog/enforce-and-validate-llm-output-with-pydantic/
