# backend/app/crud.py
from sqlalchemy.orm import Session
from . import models, schemas
from typing import Optional

def get_patient_by_external_id(db: Session, external_id: str) -> Optional[models.Patient]:
    return db.query(models.Patient).filter(models.Patient.external_id == external_id).first()

def create_or_update_patient(db: Session, resource_json: dict):
    ext_id = resource_json.get("id") or resource_json.get("identifier", [{}])[0].get("value")
    patient = get_patient_by_external_id(db, ext_id) if ext_id else None
    if not patient:
        patient = models.Patient(
            external_id=ext_id or f"p-{os.urandom(6).hex()}",
            name=" ".join([n.get("family","") + " " + " ".join(n.get("given",[])) if isinstance(n,dict) else str(n) for n in resource_json.get("name", [])]) if resource_json.get("name") else None,
            gender=resource_json.get("gender"),
            birthDate=resource_json.get("birthDate"),
            raw_resource=resource_json
        )
        db.add(patient)
    else:
        patient.raw_resource = resource_json
        patient.gender = resource_json.get("gender")
        patient.birthDate = resource_json.get("birthDate")
    db.commit()
    db.refresh(patient)
    return patient

def log_consent(db: Session, patient: Optional[models.Patient], requester: str, granted: bool, raw_data: dict=None, audio_path: str=None):
    c = models.Consent(patient_id=patient.id if patient else None, requester=requester, granted=granted, raw_data=raw_data, audio_trail_path=audio_path)
    db.add(c)
    db.commit()
    db.refresh(c)
    return c

def create_alert(db: Session, region: str, message: str, severity="medium", metadata: dict=None):
    a = models.Alert(region=region, message=message, severity=severity, metadata=metadata)
    db.add(a)
    db.commit()
    db.refresh(a)
    return a
