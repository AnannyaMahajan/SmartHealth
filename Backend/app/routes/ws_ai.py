# backend/app/routes/ws_ai.py
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from typing import Dict, List
import json, os, uuid, asyncio
from app.database import SessionLocal
from app import crud
# You'll create a small helper module "ai_pipeline" (see below) to call ASR/LLM/TTS

router = APIRouter(prefix="/ws", tags=["ai_ws"])

class AICallManager:
    """
    Manages per-session websockets and runs the AI pipeline for incoming audio or transcript.
    For MVP: receive 'transcript' messages from frontend (string) or 'audio_chunk' (base64)
    Then send back assistant messages as {'type':'assistant','text':...}
    """
    def __init__(self):
        self.sessions: Dict[str, List[WebSocket]] = {}

    async def connect(self, session_id: str, websocket: WebSocket):
        await websocket.accept()
        self.sessions.setdefault(session_id, []).append(websocket)

    def disconnect(self, session_id: str, websocket: WebSocket):
        lst = self.sessions.get(session_id, [])
        if websocket in lst:
            lst.remove(websocket)
        if not lst:
            self.sessions.pop(session_id, None)

    async def broadcast(self, session_id: str, message: dict, sender: WebSocket = None):
        for ws in list(self.sessions.get(session_id, [])):
            if ws != sender:
                try:
                    await ws.send_text(json.dumps(message))
                except:
                    self.disconnect(session_id, ws)

manager = AICallManager()

# import your AI pipeline functions
from app.ai_pipeline import handle_transcript, handle_audio_chunk

@router.websocket("/ai/{session_id}")
async def ai_ws(websocket: WebSocket, session_id: str):
    """
    Expected incoming JSON messages:
      {"type":"transcript","text":"patient: i have fever ..."}
      {"type":"audio_chunk","data":"<base64>", "seq": n}
      {"type":"command","name":"end_session"}
    Outgoing messages:
      {"type":"assistant","text":"..."}
      {"type":"status","msg":"processing"}
    """
    await manager.connect(session_id, websocket)
    try:
        while True:
            raw = await websocket.receive_text()
            data = json.loads(raw)
            typ = data.get("type")
            if typ == "transcript":
                text = data.get("text","")
                # call the LLM pipeline to get a reply asynchronously
                # handle_transcript should return assistant_text
                asyncio.create_task(_process_transcript(session_id, text))
            elif typ == "audio_chunk":
                # you can buffer and run ASR on chunks or let frontend do ASR
                await handle_audio_chunk(session_id, data)  # might store and async ASR to produce transcript and then call handle_transcript
            elif typ == "command" and data.get("name") == "end_session":
                await manager.broadcast(session_id, {"type":"status","msg":"session_closed"})
            else:
                await websocket.send_text(json.dumps({"type":"error","msg":"unknown message type"}))
    except WebSocketDisconnect:
        manager.disconnect(session_id, websocket)

async def _process_transcript(session_id: str, text: str):
    # minimal: send status, run LLM, broadcast assistant reply
    await manager.broadcast(session_id, {"type":"status","msg":"assistant_processing"})
    try:
        assistant_text = await handle_transcript(session_id, text)
        await manager.broadcast(session_id, {"type":"assistant","text":assistant_text})
    except Exception as e:
        await manager.broadcast(session_id, {"type":"error","msg":str(e)})
