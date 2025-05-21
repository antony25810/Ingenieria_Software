from backend.db.database import SessionLocal
from backend.db import models

def save_matches(matches, competition_id=1):
    db = SessionLocal()
    for match in matches:
        db_match = models.Match(
            home_team=match['home_team'],
            away_team=match['away_team'],
            date=match['date'],
            status=match.get('status', 'scheduled'),
            competition_id=competition_id
        )
        db.add(db_match)
    db.commit()
    db.close()