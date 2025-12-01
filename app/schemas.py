from pydantic import BaseModel
from typing import List, Optional, Any


class Outcome(BaseModel):
    name: str
    price: float


class Market(BaseModel):
    key: str
    outcomes: List[Outcome]


class Bookmaker(BaseModel):
    key: str
    title: Optional[str]
    markets: List[Market]


class Event(BaseModel):
    id: str
    sport_key: Optional[str]
    home_team: Optional[str]
    away_team: Optional[str]
    bookmakers: List[Bookmaker]
