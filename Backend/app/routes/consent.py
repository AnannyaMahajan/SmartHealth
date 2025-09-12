# backend/app/routes/consent.py
from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app import crud, models
import shutil, os

router = APIRouter(prefix="/consent", tags=["consent"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", summary="Record consent, optionally with audio trail")
async def give_consent(
    patient_external_id: str = Form(None),
    requester: str = Form(...),
    granted: bool = Form(...),
    audio: UploadFile = File(None),
    db: Session = Depends(get_db),
):
    # Find patient
    patient = None
    if patient_external_id:
        patient = db.query(models.Patient).filter(models.Patient.external_id == patient_external_id).first()

    audio_path = None
    if audio:
        os.makedirs("uploads", exist_ok=True)
        audio_path = f"uploads/{patient_external_id or 'anon'}_{audio.filename}"
        with open(audio_path, "wb") as f:
            shutil.copyfileobj(audio.file, f)

    consent = crud.log_consent(db=db, patient=patient, requester=requester, granted=granted, raw_data=None, audio_path=audio_path)
    return {"status": "consent recorded", "consent_id": consent.id, "audio": audio_path}
