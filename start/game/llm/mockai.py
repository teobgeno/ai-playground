class MockAIAPI:
    def __init__(
        self,
        api_key: str = "",
        model: str = "gpt-3.5-turbo",
    ):
        self.api_key = api_key

    def request(self, llm_params, prompt):
        if prompt.find('Area options') != -1:
            if prompt.find('house') != -1:
                return '{}'
            else:
                return '{"section": "forest"}'
