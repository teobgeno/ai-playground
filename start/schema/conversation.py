from enum import Enum
from typing import List
from typing_extensions import TypedDict
from game.character.character import Character
# from game.character.character_memory import CharacterMemory

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


class ConversationApiPropsDef(TypedDict):
    character_ids: List[int]
    character_id_talk: int
    message: str
    end_conversation: bool


#conversation_id : int > 0 or 0 if new
        #character_ids : [character_id, character_id]
        #character_id_talk: character_id
        #message: str only by player fill from chat else empty
        #end_conversation: 0 or 1 (set by player if close chat)