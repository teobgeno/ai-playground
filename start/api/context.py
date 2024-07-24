from fastapi import Request

def get_parser(request: Request):
    return request.state.parser

def get_db(request: Request):
    return request.state.db

def get_llm(request: Request):
    return request.state.llm

def get_cache(request: Request):
    return request.state.cache


