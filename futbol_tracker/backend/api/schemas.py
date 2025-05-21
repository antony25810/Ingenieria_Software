from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class CompetitionBase(BaseModel):
    name: str
    country: Optional[str] = None
    code: Optional[str] = None

class CompetitionCreate(CompetitionBase):
    pass

class Competition(CompetitionBase):
    id: int
    class Config:
        orm_mode = True

class MatchBase(BaseModel):
    home_team: str
    away_team: str
    date: datetime
    channel: Optional[str] = None
    status: str
    result: Optional[str] = None
    competition_id: int

class MatchCreate(MatchBase):
    pass

class Match(MatchBase):
    id: int
    class Config:
        orm_mode = True