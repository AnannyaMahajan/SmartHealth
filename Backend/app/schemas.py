from pydantic import BaseModel
from typing import Optional, Dict, Any

# ---------------- Patient Schemas ----------------
class PatientBase(BaseModel):
    external_id: str
    name: str
    age: int
    gender: str
    contact: str

class PatientCreate(PatientBase):
    pass

class PatientUpdate(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    contact: Optional[str] = None

class PatientOut(PatientBase):
    id: int
    class Config:
        orm_mode = True


# ---------------- Consent Schemas ----------------
class ConsentBase(BaseModel):
    patient_id: Optional[int] = None
    requester: str
    granted: bool
    raw_data: Optional[Dict[str, Any]] = None
    audio_path: Optional[str] = None

class ConsentOut(ConsentBase):
    id: int
    timestamp: str
    class Config:
        orm_mode = True


# ---------------- Alert Schemas ----------------
class AlertBase(BaseModel):
    region: str
    message: str
    severity: str = "low"
    metadata: Optional[Dict[str, Any]] = None

class AlertOut(AlertBase):
    id: int
    class Config:
        orm_mode = True
