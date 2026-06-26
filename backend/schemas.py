from pydantic import BaseModel
from typing import List, Optional

class UserQuery(BaseModel):
    query: str
    context: Optional[str] = "assistant" # assistant, simplifier, or hoax_checker

class ActionMap(BaseModel):
    now: List[str]
    within_24h: List[str]
    within_7d: List[str]
    contacts: List[str]
    documents: List[str]

class AIResponse(BaseModel):
    intent: str
    summary: str
    confidence_score: int
    reasoning: str
    risk_warning: Optional[str]
    sources: List[str]
    action_map: ActionMap