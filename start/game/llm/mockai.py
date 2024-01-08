class MockAIAPI:
    def __init__(
        self,
        api_key: str = "",
        model: str = "gpt-3.5-turbo",
    ):
        self.api_key = api_key

    def request(self, llm_params, prompt):
        # decide location
        if prompt.find('Area Options Available') != -1:
            if prompt.find('house') != -1:
                return '{}'
            else:
                return '{"section": "forest"}'

        # decide item
        if prompt.find('Item Options Available') != -1:
            return '{"item" : "tree"}'

         # decide Resource
        if prompt.find("{resource:'fish'}") != -1:
            return '{"resource" : "wood logs"}'
