from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.db.database import SessionLocal, init_db
from backend.db import models
from backend.api import schemas

# Importa el scraper y la función para guardar partidos
from backend.scrapers.sofascore_scraper import get_today_matches
from backend.scrapers.save_matches import save_matches

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.on_event("startup")
def on_startup():
    init_db()

# --- COMPETITIONS ---

@app.get("/competitions", response_model=list[schemas.Competition])
def get_competitions(db: Session = Depends(get_db)):
    return db.query(models.Competition).all()

@app.post("/competitions", response_model=schemas.Competition)
def create_competition(competition: schemas.CompetitionCreate, db: Session = Depends(get_db)):
    db_comp = models.Competition(**competition.dict())
    db.add(db_comp)
    db.commit()
    db.refresh(db_comp)
    return db_comp

# --- MATCHES ---

@app.get("/matches/upcoming", response_model=list[schemas.Match])
def get_upcoming_matches(db: Session = Depends(get_db)):
    from datetime import datetime, timedelta
    now = datetime.utcnow()
    week = now + timedelta(days=7)
    matches = db.query(models.Match).filter(models.Match.date >= now, models.Match.date <= week).all()
    return matches

@app.get("/matches/recent", response_model=list[schemas.Match])
def get_recent_matches(db: Session = Depends(get_db)):
    from datetime import datetime, timedelta
    now = datetime.utcnow()
    yesterday = now - timedelta(days=1)
    matches = db.query(models.Match).filter(models.Match.date >= yesterday, models.Match.date <= now).all()
    return matches

@app.get("/matches/{match_id}", response_model=schemas.Match)
def get_match(match_id: int, db: Session = Depends(get_db)):
    match = db.query(models.Match).filter(models.Match.id == match_id).first()
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
    return match

@app.post("/matches", response_model=schemas.Match)
def create_match(match: schemas.MatchCreate, db: Session = Depends(get_db)):
    db_match = models.Match(**match.dict())
    db.add(db_match)
    db.commit()
    db.refresh(db_match)
    return db_match

@app.put("/matches/{match_id}", response_model=schemas.Match)
def update_match(match_id: int, match: schemas.MatchCreate, db: Session = Depends(get_db)):
    db_match = db.query(models.Match).filter(models.Match.id == match_id).first()
    if not db_match:
        raise HTTPException(status_code=404, detail="Match not found")
    for key, value in match.dict().items():
        setattr(db_match, key, value)
    db.commit()
    db.refresh(db_match)
    return db_match

@app.delete("/matches/{match_id}")
def delete_match(match_id: int, db: Session = Depends(get_db)):
    db_match = db.query(models.Match).filter(models.Match.id == match_id).first()
    if not db_match:
        raise HTTPException(status_code=404, detail="Match not found")
    db.delete(db_match)
    db.commit()
    return {"ok": True, "deleted_id": match_id}

# --- SCRAPER ENDPOINT ---

@app.post("/scrape/sofascore")
def scrape_sofascore_and_save():
    """
    Ejecuta el scraper de Sofascore, guarda los partidos (usando competition_id=1) y retorna la cantidad.
    Asegúrate de tener al menos una competencia creada.
    """
    matches = get_today_matches()
    save_matches(matches, competition_id=1)  # Cambia el ID según corresponda
    return {"added": len(matches)}