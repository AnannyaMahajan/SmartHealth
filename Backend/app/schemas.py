# backend/app/schemas.py
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any

class FHIRPatientIn(BaseModel):
    id: Optional[str]
    name: Optional[Any]
    gender: Optional[str]
    birthDate: Optional[str]
    resourceType: Optional[str]
    # accept arbitrary resource content
    class Config:
        extra = "allow"

class FHIRPatientOut(BaseModel):
    external_id: str
    name: Optional[str]
    gender: Optional[str]
    birthDate: Optional[str]

class ConsentIn(BaseModel):
    patient_external_id: Optional[str]
    requester: Optional[str]
    granted: bool
    raw_data: Optional[Dict[str, Any]] = None

class ConsentOut(BaseModel):
    id: int
    patient_external_id: Optional[str]
    requester: Optional[str]
    granted: bool
    timestamp: str

class AlertOut(BaseModel):
    id: int
    region: str
    message: str
    severity: str
    timestamp: str
