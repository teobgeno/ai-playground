from fastapi import APIRouter, Depends
from api.context import get_db
from game.deb import test_whatever

router = APIRouter()


@router.get("/")
async def root():
    return {"message": "Hello World"}


@router.get("/test")
async def test(db=Depends(get_db)):
    return test_whatever(db)
