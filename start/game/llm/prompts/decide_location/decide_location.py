from typing import List, Any
from pydantic import BaseModel
from game.llm import LLMProvider
from game.llm.prompt_parser import PromptParser


class DecideLocationResponse(BaseModel):
    thought: str
    answer: str


class DecideLocationPrompt:
    def __init__(self, props):
        self._llm: LLMProvider = props["llm"]

    @classmethod
    def create(cls, props):
        return cls(props)

    def choose_sections(self, sections: List[Any]):
        # TODO:: query llm
        sections_str = ','.join([e["keyword"] for e in sections])

        prompt_data = []
        prompt_data.append({"keyword": "SECTIONS", "value": sections_str})
        prompt_file = "game/llm/prompts/decide_location/action_section.txt"
        prompt = self.parse_prompt(prompt_file, prompt_data)
        # self._llm.request()

        if sections[0]["keyword"] == "house":
            return []
        else:
            return [{'id': 1, 'parent_id': 0, 'keyword': 'forest'}]

    def choose_game_objects(self, game_objects: List[Any]):
        # TODO:: query llm
        # llm will return comma seperated strings like rabbit, deer
        # if item exist {'id': 1, 'section_id': 1, 'parent_id': 0, 'keyword': 'tree'}
        # if item not exist {'id': 0, 'section_id': 0, 'parent_id': 0, 'keyword': 'rabbit'}
        game_objects_str = ','.join([e["keyword"] for e in game_objects])
        return [{'id': 1, 'section_id': 1, 'parent_id': 0, 'keyword': 'tree'}]

    def get_llm_params():
        return {"max_tokens": 1000,
                "temperature": 0, "top_p": 1, "stream": False,
                "frequency_penalty": 0, "presence_penalty": 0, "stop": None}

    def parse_prompt(self, prompt_file, prompt_data):
        parser = PromptParser()
        parsed_prompt = parser.generate_prompt(prompt_file, prompt_data)
        parser.print_run_prompts(parsed_prompt)
        return parsed_prompt


# https://xebia.com/blog/enforce-and-validate-llm-output-with-pydantic/
