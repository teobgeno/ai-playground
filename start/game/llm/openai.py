from typing import List
import openai
# https://github.com/mluogh/eastworld/blob/main/llm/openai.py


class OpenAIAPI:
    def __init__(
        self,
        api_key: str = "",
        model: str = "gpt-3.5-turbo",
    ):
        if api_key:
            openai.api_key = api_key

    def request():
        pass

    def completition(self, params, messages):
        try:
            completion = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages= messages,
                max_tokens=params['max_tokens'],
                temperature=params['temperature'],
                top_p=params['top_p'],
                stream=params['stream'],
                frequency_penalty=params['frequency_penalty'],
                presence_penalty=params['presence_penalty'],
                stop=params['stop']
            )
            print(completion)
            return completion["choices"][0]["message"]["content"]
        except Exception as error:
            print("ChatGPT ERROR", error)
            return "ChatGPT ERROR"

    def embed(self, query: str) -> List[float]:
        return (
            openai.Embedding.create(  # type: ignore
                input=query, model="text-embedding-ada-002"
            )
        )["data"][0]["embedding"]

    # prompt = 'GPT-3 Prompt:\n"""\n' + prompt + '\n"""\n'
    # prompt += f"Output the response to the prompt above in json. {special_instruction}\n"
    # prompt += "Example output json:\n"
    # prompt += '{"output": "' + str(example_output) + '"}'

    #   try:
    #     completion = openai.ChatCompletion.create(
    #         model="gpt-3.5-turbo",
    #         messages=[{"role": "user", "content": prompt}]
    #     )
    #     return completion["choices"][0]["message"]["content"]

    # except:
    #     print("ChatGPT ERROR")
    #     return "ChatGPT ERROR"

    # async def embed(self, query: str) -> List[float]:
    #     return (
    #         await openai.Embedding.acreate(  # type: ignore
    #             input=query, model="text-embedding-ada-002"
    #         )
    #     )["data"][0]["embedding"]

#  messages = [
#             {"role": "user", "content": task_prompt}
#         ]
#         response = openai.ChatCompletion.create(
#             model="gpt-3.5-turbo-16k",
#             messages=messages,
#             temperature=0.4,
#             max_tokens=4000,
#             top_p=1,
#             frequency_penalty=0,
#             presence_penalty=0
#         )

#         return "\n\n"+response.choices[0].message['content'].strip()


#   gpt_param = {"engine": "text-davinci-003", "max_tokens": 50,
#                "temperature": 0.5, "top_p": 1, "stream": False,
#                "frequency_penalty": 0, "presence_penalty": 0, "stop": ["\n"]}
