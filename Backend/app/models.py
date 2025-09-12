# backend/app/models.py
from sqlalchemy import Column, Integer, String, DateTime, JSON, Boolean, Text, ForeignKey
from sqlalchemy.sql import func
from .database import Base
from sqlalchemy.orm import relationship

class Patient(Base):
    __tablename__ = "patients"
    id = Column(Integer, primary_key=True, index=True)
    external_id = Column(String, unique=True, index=True)  # e.g., FHIR patient id or guid
    name = Column(String)
    gender = Column(String)
    birthDate = Column(String)
    raw_resource = Column(JSON)  # store FHIR resource JSON

    consents = relationship("Consent", back_populates="patient")

class Consent(Base):
    __tablename__ = "consents"
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=True)
    requester = Column(String, nullable=True)  # who requested consent
    granted = Column(Boolean, default=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    audio_trail_path = Column(String, nullable=True)  # path to uploaded audio (optional)
    raw_data = Column(JSON, nullable=True)

    patient = relationship("Patient", back_populates="consents")

class Alert(Base):
    __tablename__ = "alerts"
    id = Column(Integer, primary_key=True, index=True)
    region = Column(String, index=True)
    message = Column(String)
    severity = Column(String, default="medium")
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    metadata = Column(JSON, nullable=True)
