import uvicorn
from fastapi import FastAPI
from game.bridge_api_test import create_character

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}


def init():
    uvicorn.run(app, host="0.0.0.0", port=8000)
