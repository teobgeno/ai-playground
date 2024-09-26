from enum import Enum
from typing import List
from typing_extensions import TypedDict
from datetime import datetime
from pydantic import ConfigDict, TypeAdapter, ValidationError, BaseModel


class FocalPointDef(TypedDict):
    text: str
    embed: List[float]


class SummaryPromptDef(TypedDict):
    init_person_name: str
    init_person_iis: str
    target_person_name: str
    messages: List[str]