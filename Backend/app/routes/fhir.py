# backend/app/routes/fhir.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app import crud, schemas, models
from typing import Dict
import os

router = APIRouter(prefix="/fhir", tags=["fhir"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/Patient", response_model=Dict)
def create_patient(resource: Dict, db: Session = Depends(get_db)):
    """
    Accepts a FHIR Patient resource (arbitrary JSON). Stores raw resource and returns stored metadata.
    """
    # minimal validation: resourceType must be Patient
    if resource.get("resourceType") != "Patient" and resource.get("resourceType") is not None:
        raise HTTPException(status_code=400, detail="resourceType must be 'Patient' or omitted")

    patient = crud.create_or_update_patient(db, resource)
    return {"external_id": patient.external_id, "id": patient.id, "status": "stored"}

@router.get("/Patient/{external_id}")
def get_patient(external_id: str, db: Session = Depends(get_db)):
    p = crud.get_patient_by_external_id(db, external_id)
    if not p:
        raise HTTPException(status_code=404, detail="Patient not found")
    return {"external_id": p.external_id, "raw_resource": p.raw_resource}
