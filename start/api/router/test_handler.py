from fastapi import APIRouter, Depends
from api.context import get_db
from core.db.json_db_manager import JsonDBManager
from game.deb import test_whatever

router = APIRouter()


@router.get("/")
async def root():
    return {"message": "Hello World"}


@router.get("/test")
async def test(db: JsonDBManager = Depends(get_db)):
    return test_whatever(db)


@router.get("/getGameSections")
async def getSections(db: JsonDBManager = Depends(get_db)):
    return db.getGameSections()


@router.get("/getGameObjects")
async def getGameObjects(db: JsonDBManager = Depends(get_db)):
    return db.getGameObjects()
