from game.llm import PromptParser


class BasePrompt:
    def parse_prompt(self, prompt_file, prompt_data):
        parser = PromptParser()
        parsed_prompt = parser.generate_prompt(prompt_file, prompt_data)
        parser.print_run_prompts(parsed_prompt)
        return parsed_prompt
