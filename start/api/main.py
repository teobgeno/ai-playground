import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from game.deb import test_whatever

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:8001",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/test")
async def test():
    return test_whatever()


def init():
    uvicorn.run(app, host="0.0.0.0", port=8000)
