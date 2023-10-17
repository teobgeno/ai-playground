# from gpt4all import GPT4All
from langchain.llms import GPT4All, LlamaCpp
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler
from langchain.agents import initialize_agent
from langchain.agents import AgentType
from langchain.agents import load_tools
from fastapi import FastAPI


app = FastAPI()
callbacks = [StreamingStdOutCallbackHandler()]
#llm = GPT4All(model="./models/ggml-gpt4all-l13b-snoozy.bin", backend="gptj", callbacks=callbacks, verbose=True, n_threads=8, n_predict=256, temp=0.7, top_p=0.1, top_k=40, repeat_penalty=1.18)
#llm = GPT4All(model='models/orca-mini-3b.ggmlv3.q4_0.bin', max_tokens=1000,temp=1, backend='gptj', n_batch=8, callbacks=callbacks, verbose=False)

@app.get("/")
async def root(prompt: str = "", max_tokens: int = 500, temperature: float = 1, top_p: float = 0.1, repeat_penalty: float  = 1.18):
    llm = GPT4All(model='models/orca-mini-3b.ggmlv3.q4_0.bin', backend='gptj', callbacks=callbacks, max_tokens=max_tokens,temp=temperature, top_p=top_p, repeat_penalty=1.18, n_batch=8, verbose=False)
    return {"text": llm.predict(prompt)}


def test():
    # Callbacks support token-wise streaming
    


    text = "Name: Isabella Rodriguez\nAge: 34\nInnate traits: friendly, outgoing, hospitable\nLearned traits: Isabella Rodriguez is a cafe owner of Hobbs Cafe who loves to make people feel welcome. She is always looking for ways to make the cafe a place where people can come to relax and enjoy themselves.\nCurrently: Isabella Rodriguez is planning on having a Valentine's Day party at Hobbs Cafe with her customers on February 14th, 2023 at 5pm. She is gathering party material, and is telling everyone to join the party at Hobbs Cafe on February 14th, 2023, from 5pm to 7pm.\nLifestyle: Isabella Rodriguez goes to bed around 11pm, awakes up around 6am.\nDaily plan requirement: Isabella Rodriguez opens Hobbs Cafe at 8am everyday, and works at the counter until 8pm, at which point she closes the cafe.\nCurrent Date: Monday February 13\n\n\nIn general, Isabella Rodriguez goes to bed around 11pm, awakes up around 6am.\nToday is Monday February 13. Here is Isabella's plan today in broad-strokes (with the time of the day. e.g., have a lunch at 12:00 pm, watch TV from 7 to 8 pm): 1) wake up and complete the morning routine at 8:00 am, 2)"
    return llm.predict(text)


def _handle_error(error) -> str:
    return str(error)[:200]



#tools = load_tools(["wikipedia"], llm=llm)
#agent = initialize_agent(tools,llm,agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,verbose=True)
#agent.run("What is the capital of Greece?")

#tools = load_tools(["llm-math"], llm=llm)
#agent = initialize_agent(tools, llm, agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION, verbose=True, handle_parsing_errors=True) # handle_parsing_errors _handle_error
#agent.run("13+13?")


#uvicorn agent:app --reload