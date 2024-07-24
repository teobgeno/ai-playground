import configparser
from core.db.json_db_manager import JsonDBManager
from game.llm import LLMProvider
from core.cache import Cache
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from core.db.json_db_manager import JsonDBManager
from game.deb import test_whatever
from api.router import conversation_handler


@asynccontextmanager
async def lifespan(app: FastAPI):
    parser = configparser.ConfigParser()
    parser.read("config.ini")
    db = JsonDBManager()
    llm = LLMProvider( parser.get("OPENAI", "key"))
    cache = Cache(db, llm)
    
    yield {
        "parser": parser,
        "db": db,
        "llm": llm,
        "cache": cache,
        
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

app.include_router(conversation_handler.router)


def init():
    uvicorn.run(app, host="0.0.0.0", port=8000)
