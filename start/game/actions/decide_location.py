from typing import List, Set
from game.llm import DecideLocationPrompt
from game.map import SectionsDef


class DecideLocationAction:
    def __init__(self, props):
        self._sections: List[SectionsDef] = props["sections"]
        self._action_descr: str = props["action_descr"]
        self._decide_location_prompt: DecideLocationPrompt = props["decide_location_prompt"]

    @classmethod
    def create(cls, props):
        return cls(props)

    def execute(self):
        selected_sections = self.get_selected_sections()
        return selected_sections

    def get_selected_sections(self, parent_ids: List[int] = [0], selected_sections: List[SectionsDef] = []):
        child_sections: Set[str] = set([
            e["keyword"] for e in self._sections if parent_ids.count(e["parent_id"])])
        chosen_sections: List[str] = self._decide_location_prompt.execute(
            self._action_descr, child_sections)
        if len(chosen_sections) > 0:
            selected_sections = [
                e for e in self._sections if parent_ids.count(e["parent_id"]) and chosen_sections.count(e["keyword"])]
            current_parent_ids: List[int] = [e["id"]
                                             for e in selected_sections]
            self.get_selected_sections(current_parent_ids, selected_sections)

        return selected_sections
