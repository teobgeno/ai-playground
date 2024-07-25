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
    start_date: str
    end_date: str
    participants: List[int]
    messages: List[MessageDef]
    relationships: List[RelationshipDef]
    type: str


class ConversationApiTalkRequestDef(TypedDict):
    conversation_id: int
    character_ids: List[int]
    character_id_talk: int
    message: str
    end_conversation: bool

class ConversationApiTalkResponseDef(TypedDict):
    conversation_id: int
    message_reply: str
    end_conversation: bool

class ConversationApiCreateRequestDef(TypedDict):
    character_ids: List[int]

class ConversationApiCreateResponsetDef(TypedDict):
    conversation_id: str