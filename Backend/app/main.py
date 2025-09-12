# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import fhir, consent, signaling, alerts
from app.database import init_db

app = FastAPI(title="HealthNE Pro Backend", version="0.1")

# init database (creates sqlite file and tables)
init_db()

# CORS - allow your frontend origin(s)
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    # add your deployed frontend domain(s)
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(fhir.router)
app.include_router(consent.router)
app.include_router(alerts.router)
app.include_router(signaling.router)

@app.get("/")
def root():
    return {"status": "HealthNE backend running"}
