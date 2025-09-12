from sqlalchemy import Column, Integer, String
from pydantic import BaseModel
from app.database import Base

# ---------------- SQLAlchemy ORM ----------------
class Patient(Base):
    __tablename__ = "patients"
    id = Column(Integer, primary_key=True, index=True)
    external_id = Column(String, unique=True, index=True)
    name = Column(String, index=True)
    age = Column(Integer)
    gender = Column(String)
    contact = Column(String)

# ---------------- Pydantic Schemas ----------------
class PatientBase(BaseModel):
    external_id: str
    name: str
    age: int
    gender: str
    contact: str

class PatientCreate(PatientBase):
    pass

class PatientUpdate(BaseModel):
    name: str | None = None
    age: int | None = None
    gender: str | None = None
    contact: str | None = None

class PatientOut(PatientBase):
    id: int
    class Config:
        orm_mode = True
