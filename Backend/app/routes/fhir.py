from fastapi import APIRouter

router = APIRouter(prefix="/fhir", tags=["FHIR"])

@router.get("/")
def fhir_root():
    return {"message": "FHIR API placeholder"}
