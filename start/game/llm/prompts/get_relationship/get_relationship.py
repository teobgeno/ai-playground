from typing import List, Any
from pydantic import BaseModel, ValidationError
import json
from game.llm import LLMProvider
from game.llm import BasePrompt


class GetRelationshipModel(BaseModel):
    item: str


class GetRelationshipResponse(BaseModel):
    res: List[GetRelationshipModel]


class GetRelationshipPrompt(BasePrompt):
    def __init__(self, props):
        self._llm: LLMProvider = props["llm"]

    def execute(self, statements: str, init_person_name: str, target_person_name: str):

        prompt_data = []
        prompt_data.append({"keyword": "STATEMENTS", "value": statements})
        prompt_data.append({"keyword": "INIT_PERSON_NAME", "value": init_person_name})
        prompt_data.append({"keyword": "TARGET_PERSON_NAME", "value": target_person_name})

        prompt_file = "game/llm/prompts/get_relationship/get_relationship.txt"
        prompt = self.parse_prompt(prompt_file, prompt_data)
        response = self._llm.completition(self.get_llm_params(), prompt)
        parsed_response: GetRelationshipPrompt = self.get_valid_response(response)
        if parsed_response is not None:
            return [e["item"] for e in parsed_response]

        return []

    def get_valid_response(self, response):
        try:
            ret = None
            parsed_response = json.loads(response)
            if isinstance(parsed_response, list):
                validated_response = GetRelationshipResponse.model_validate(
                    {"res": parsed_response})
                ret = parsed_response
            else:
                validated_response = GetRelationshipResponse.model_validate(
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
        return {"max_tokens": 300, "temperature": 0.5, "top_p": 1, "stream": True, "frequency_penalty": 0, "presence_penalty": 0, "stop": None}
