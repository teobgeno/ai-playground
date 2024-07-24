from fastapi import Request
import configparser
from core.db.json_db_manager import JsonDBManager
from game.llm import LLMProvider
from core.cache import Cache

def get_parser(request: Request)->configparser:
    return request.state.parser

def get_db(request: Request)->JsonDBManager:
    return request.state.db

def get_llm(request: Request)->LLMProvider:
    return request.state.llm

def get_cache(request: Request)->Cache:
    return request.state.cache


