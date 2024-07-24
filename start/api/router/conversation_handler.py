from fastapi import APIRouter, Depends
from api.context import get_db
from pydantic import BaseModel
from core.db.json_db_manager import JsonDBManager
from game.deb import test_whatever


router = APIRouter()

class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None


@router.post("/conversation_talk/")
def create_item(item: Item, db: JsonDBManager = Depends(get_db)):
    return item