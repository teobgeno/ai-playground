from fastapi import APIRouter, Depends
from api.context import get_db
from pydantic import BaseModel
from core.db.json_db_manager import JsonDBManager
from game.deb import test_whatever

router = APIRouter()


class SectionDef(BaseModel):
    id: int
    parent_id: int
    keyword: str
    title: str


class GameObjectDef(BaseModel):
    id: int
    section_id: int
    parent_id: int
    keyword: str


@router.get("/")
async def root():
    return {"message": "Hello World"}


@router.get("/test")
async def test(db: JsonDBManager = Depends(get_db)):
    return test_whatever(db)


@router.get("/getGameSections", response_model=list[SectionDef])
async def getSections(db: JsonDBManager = Depends(get_db)):
    return db.getGameSections()


@router.get("/getGameObjects", response_model=list[GameObjectDef])
async def getGameObjects(db: JsonDBManager = Depends(get_db)):
    return db.getGameObjects()
