from fastapi import APIRouter

router = APIRouter(prefix="/signaling", tags=["Signaling"])

@router.get("/")
def signaling_root():
    return {"message": "Signaling API placeholder"}
