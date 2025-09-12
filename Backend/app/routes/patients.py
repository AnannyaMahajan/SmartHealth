from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app import models, crud

router = APIRouter(prefix="/patients", tags=["patients"])

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ✅ Create patient
@router.post("/")
def create_patient(patient: models.PatientCreate, db: Session = Depends(get_db)):
    db_patient = crud.get_patient_by_external_id(db, external_id=patient.external_id)
    if db_patient:
        raise HTTPException(status_code=400, detail="Patient already exists")
    return crud.create_patient(db=db, patient=patient)

# ✅ Get all patients
@router.get("/")
def list_patients(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    return crud.get_patients(db, skip=skip, limit=limit)

# ✅ Get patient by external_id
@router.get("/{external_id}")
def get_patient(external_id: str, db: Session = Depends(get_db)):
    patient = crud.get_patient_by_external_id(db, external_id=external_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient

# ✅ Update patient (basic info)
@router.put("/{external_id}")
def update_patient(external_id: str, update_data: models.PatientUpdate, db: Session = Depends(get_db)):
    patient = crud.get_patient_by_external_id(db, external_id=external_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return crud.update_patient(db=db, patient=patient, update_data=update_data)

# ✅ Delete patient
@router.delete("/{external_id}")
def delete_patient(external_id: str, db: Session = Depends(get_db)):
    success = crud.delete_patient(db=db, external_id=external_id)
    if not success:
        raise HTTPException(status_code=404, detail="Patient not found")
    return {"detail": f"Patient {external_id} deleted"}
