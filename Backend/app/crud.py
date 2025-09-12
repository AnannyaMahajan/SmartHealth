from sqlalchemy.orm import Session
from app import models

def get_patient_by_external_id(db: Session, external_id: str):
    return db.query(models.Patient).filter(models.Patient.external_id == external_id).first()

def get_patients(db: Session, skip: int = 0, limit: int = 20):
    return db.query(models.Patient).offset(skip).limit(limit).all()

def create_patient(db: Session, patient: models.PatientCreate):
    db_patient = models.Patient(
        external_id=patient.external_id,
        name=patient.name,
        age=patient.age,
        gender=patient.gender,
        contact=patient.contact
    )
    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    return db_patient

def update_patient(db: Session, patient: models.Patient, update_data: models.PatientUpdate):
    for field, value in update_data.dict(exclude_unset=True).items():
        setattr(patient, field, value)
    db.commit()
    db.refresh(patient)
    return patient

def delete_patient(db: Session, external_id: str):
    patient = get_patient_by_external_id(db, external_id)
    if not patient:
        return False
    db.delete(patient)
    db.commit()
    return True
