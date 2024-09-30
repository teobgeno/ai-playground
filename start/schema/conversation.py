from enum import Enum
from typing import List
from typing_extensions import TypedDict
from datetime import datetime
from game.character.character import Character
from pydantic import ConfigDict, TypeAdapter, ValidationError, BaseModel

class ConversationStatus(Enum):
    RUNNING = 1
    COMPLETED = 2


class MessageDef(TypedDict):
    character_id: int
    message: str
    added_at: float

class CharacterDef(TypedDict):
    id: int
    name: str
    memory_path: str
    is_npc: bool

class ParticipantDef(TypedDict):
    character: Character
    is_talking: bool
    
class RelationshipDef(TypedDict):
    character_id: int
    descr: str
    
    
class ConversationDef(TypedDict):
    id: int
    status: ConversationStatus
    start_date: datetime
    end_date: datetime
    participants: List[int]
    messages: List[MessageDef]
    relationships: List[RelationshipDef]
    type: str

class ConversationApiCreateRequestDef(TypedDict):
    character_ids: List[int]

class ConversationApiCreateResponseDef(TypedDict):
    conversation_id: str

class ConversationApiTalkRequestDef(TypedDict):
    conversation_id: str
    character_id_talk: int
    message: str
    end_conversation: bool

class ConversationApiTalkResponseDef(TypedDict):
    conversation_id: str
    message_reply: str
    end_conversation: bool

class ConversationApiDestroyRequestDef(TypedDict):
     conversation_id: str