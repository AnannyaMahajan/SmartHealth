# backend/app/routes/ai_assistant.py
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app import crud, models
import os, shutil, uuid, json
from datetime import datetime

router = APIRouter(prefix="/ai", tags=["ai"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/consent", summary="Record patient consent for AI consult (audio/text)")
async def ai_consent(patient_external_id: str = Form(...), requester: str = Form(...),
                     granted: bool = Form(...), db: Session = Depends(get_db)):
    """
    Must be called before starting AI consult. Records consent with timestamp and links to patient.
    """
    patient = None
    if patient_external_id:
        patient = db.query(models.Patient).filter(models.Patient.external_id == patient_external_id).first()
    consent = crud.log_consent(db=db, patient=patient, requester=requester, granted=granted, raw_data={"ai_consent": True}, audio_path=None)
    return {"status":"consent_recorded", "consent_id": consent.id, "timestamp": str(consent.timestamp)}

# optional endpoint to store final transcript / report after consult
@router.post("/final_report")
async def final_report(patient_external_id: str = Form(None), session_id: str = Form(...),
                       transcript: str = Form(...), llm_summary: str = Form(...), db: Session = Depends(get_db)):
    # store as an Alert or note under patient raw_resource or new table. Keep it simple here.
    patient = None
    if patient_external_id:
        patient = db.query(models.Patient).filter(models.Patient.external_id == patient_external_id).first()
    # create an Alert-like record for auditable consult summary
    from app.crud import create_alert
    rec = create_alert(db=db, region="AI_CONSULT", message=f"AI consult {session_id}", severity="low", metadata={"transcript": transcript, "summary": llm_summary})
    return {"status":"saved", "report_id": rec.id}
