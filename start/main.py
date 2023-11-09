from fastapi import FastAPI
from game.bridge_api_test import create_character


app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}


# uvicorn main:app --reload
