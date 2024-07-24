from fastapi import APIRouter, Depends, FastAPI, HTTPException
from api.context import *
import configparser
from core.db.json_db_manager import JsonDBManager
from game.llm import LLMProvider
from core.cache import Cache
from schema.conversation import *
from game.conversation_manager import ConversationManager
from pydantic import ConfigDict, TypeAdapter, ValidationError

router = APIRouter(
    prefix='/conversation'
)


@router.post("/talk")
async def conversation_talk(
    params: ConversationApiRequestDef, 
    parser: configparser = Depends(get_parser), 
    db: JsonDBManager = Depends(get_db),
    llm: LLMProvider = Depends(get_llm),
    cache: Cache = Depends(get_cache)
    ):

    conversation_manager = ConversationManager(parser, db, llm, cache, params)
    return conversation_manager.process_conversation()

    # try:
    #     ta = TypeAdapter(ConversationApiRequestDef)
    #     ta.validate_python(params)
    #     conversation_manager = ConversationManager(parser, db, llm, cache, params)
    #     return conversation_manager.process_conversation()
    # except ValidationError as e:
    #     raise HTTPException(status_code=401, detail="Gia ton Poutso data")


   