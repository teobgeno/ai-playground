import configparser
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from core.db.json_db_manager import JsonDBManager
from game.deb import test_whatever
from api.router import test_handler


@asynccontextmanager
async def lifespan(app: FastAPI):
    # db = MySqlDBManager('root', '123456', '127.0.0.1')
    db = JsonDBManager()
    # parser = configparser.ConfigParser()
    # parser.read("config.ini")

    yield {
        "db": db,
    }

    # await db.close()


app = FastAPI(lifespan=lifespan)

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

app.include_router(test_handler.router)


def init():
    uvicorn.run(app, host="0.0.0.0", port=8000)
