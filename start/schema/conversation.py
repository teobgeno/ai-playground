from pydantic import UUID4, BaseModel, Field
from enum import Enum

class ConversationStatus(Enum):
    RUNNING = 1
    COMPLETED = 2

class ConversationDef(BaseModel):
    id: int
    status: ConversationStatus