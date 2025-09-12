# backend/app/routes/alerts.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app import crud
from app.schemas import AlertOut
from typing import List

router = APIRouter(prefix="/alerts", tags=["alerts"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/simulate", summary="Simulate creation of an alert")
def simulate_alert(region: str, message: str, severity: str = "medium", db: Session = Depends(get_db)):
    a = crud.create_alert(db=db, region=region, message=message, severity=severity, metadata={})
    return {"status": "created", "alert_id": a.id}

@router.get("/", response_model=List[AlertOut])
def list_alerts(db: Session = Depends(get_db)):
    return db.query(type(crud).__module__ and __import__("app").models.Alert).query.all()  # fallback, but we'll use explicit
