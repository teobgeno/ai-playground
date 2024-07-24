from fastapi import APIRouter, Depends
from api.context import *
from pydantic import BaseModel
import configparser
from core.db.json_db_manager import JsonDBManager
from game.llm import LLMProvider
from core.cache import Cache
from game.conversation_manager import ConversationManager


router = APIRouter()

class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None


@router.post("/conversation_talk/")
async def conversation_talk(
    params: Item, 
    parser: configparser = Depends(get_parser), 
    db: JsonDBManager = Depends(get_db),
    llm: LLMProvider = Depends(get_llm),
    cache: Cache = Depends(get_cache)
    ):
    conversation_manager = ConversationManager(parser, db, llm, params)
    return conversation_manager.process_conversation()