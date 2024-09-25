from enum import Enum
from typing import List
from typing_extensions import TypedDict
from datetime import datetime
from pydantic import ConfigDict, TypeAdapter, ValidationError, BaseModel


class FocalPointDef(TypedDict):
    text: str
    embed: List[float]

