from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class Competition(Base):
    __tablename__ = 'competitions'
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    country = Column(String, nullable=True)
    code = Column(String, nullable=True)

    matches = relationship("Match", back_populates="competition")

class Match(Base):
    __tablename__ = 'matches'
    id = Column(Integer, primary_key=True)
    home_team = Column(String, nullable=False)
    away_team = Column(String, nullable=False)
    date = Column(DateTime, nullable=False)
    channel = Column(String, nullable=True)
    status = Column(String, nullable=False)  # scheduled, finished, in_progress
    result = Column(String, nullable=True)   # "2-1", etc
    competition_id = Column(Integer, ForeignKey('competitions.id'))

    competition = relationship("Competition", back_populates="matches")