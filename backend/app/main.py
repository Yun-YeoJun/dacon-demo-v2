from fastapi import FastAPI, HTTPException, Query, Header, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from typing import Optional
import httpx, uuid, base64, json

from .settings import settings
from .models import (
    AnalyzeRequest, AnalyzeResponse, AnalyzeResult,
    InboxResponse, InboxItem, MessageDetail,
    SaveAnalysisRequest, AnalysisRecord, AnalysisListResponse
)
from .heuristic import analyze_text
from .db import ensure_db, seed_messages, list_messages, get_message, save_analysis as db_save_analysis, list_analyses as db_list_analyses, get_analysis as db_get_analysis, now_iso

app = FastAPI(title="Smishing Guard API", version="0.2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

conn = ensure_db(settings.db_path)
seed_messages(conn)

def client_id_from_header(x_client_id: Optional[str]) -> str:
    return x_client_id or "anon"

def encode_cursor(offset: int) -> str:
    payload = json.dumps({"o": offset}).encode("utf-8")
    return base64.urlsafe_b64encode(payload).decode("ascii").rstrip("=")

def decode_cursor(cursor: Optional[str]) -> int:
    if not cursor:
        return 0
    pad = "=" * (-len(cursor) % 4)
    raw = base64.urlsafe_b64decode((cursor + pad).encode("ascii"))
    obj = json.loads(raw.decode("utf-8"))
    return int(obj.get("o", 0))

@app.post("/v1/analyze", response_model=AnalyzeResponse)
async def analyze(req: AnalyzeRequest, x_client_id: Optional[str] = Header(default=None)):
    request_id = req.request_id or f"req_{uuid.uuid4().hex[:8]}"

    # 1) 모델 서버 프록시
    if settings.model_url:
        try:
            async with httpx.AsyncClient(timeout=settings.request_timeout_seconds) as client:
                r = await client.post(
                    settings.model_url,
                    json={"request_id": request_id, "text": req.text},
                    headers={"Content-Type": "application/json"},
                )
                r.raise_for_status()
                data = r.json()
            result = data.get("result") or {}
            return AnalyzeResponse(
                request_id=data.get("request_id", request_id),
                success=bool(data.get("success", True)),
                result=AnalyzeResult(
                    label=result.get("label", "불명"),
                    score=result.get("score", None),
                    explanation=result.get("explanation", ""),
                    patterns=result.get("patterns", []) or [],
                    recommended_actions=result.get("recommended_actions", []) or [],
                    raw_output=result.get("raw_output", None),
                )
            )
        except Exception:
            pass

    # 2) fallback
    res = analyze_text(req.text)
    return AnalyzeResponse(request_id=request_id, success=True, result=res)

@app.get("/v1/inbox", response_model=InboxResponse)
async def inbox(
    channel: str = Query("sms"),
    cursor: Optional[str] = None,
    limit: int = Query(20, ge=1, le=100),
):
    offset = decode_cursor(cursor)
    rows = list_messages(conn, channel, offset, limit)
    items=[]
    for r in rows:
        items.append(InboxItem(
            id=r["id"],
            channel=r["channel"],
            senderName=r["sender_name"],
            senderId=r["sender_id"],
            preview=(r["preview"] + "...") if len(r["preview"]) >= 60 else r["preview"],
            ts=r["ts"],
            riskHint=None,
        ))
    next_cursor = encode_cursor(offset + limit) if len(rows) == limit else None
    return InboxResponse(items=items, nextCursor=next_cursor)

@app.get("/v1/messages/{id}", response_model=MessageDetail)
async def message_detail(id: str):
    m = get_message(conn, id)
    if not m:
        raise HTTPException(status_code=404, detail="message not found")
    return MessageDetail(id=m["id"], channel=m["channel"], senderId=m["sender_id"], content=m["content"], ts=m["ts"])

@app.post("/v1/analysis", response_model=AnalysisRecord)
async def create_analysis(payload: SaveAnalysisRequest, x_client_id: Optional[str] = Header(default=None)):
    cid = client_id_from_header(x_client_id)
    aid = f"an_{uuid.uuid4().hex[:10]}"
    created_at = now_iso()
    db_save_analysis(conn, aid, cid, payload.messageId, created_at, payload.analysis.model_dump())
    return AnalysisRecord(analysisId=aid, messageId=payload.messageId, createdAt=created_at, analysis=payload.analysis)

@app.get("/v1/analysis", response_model=AnalysisListResponse)
async def get_analyses(
    x_client_id: Optional[str] = Header(default=None),
    cursor: Optional[str] = None,
    limit: int = Query(20, ge=1, le=100),
):
    cid = client_id_from_header(x_client_id)
    offset = decode_cursor(cursor)
    rows = db_list_analyses(conn, cid, offset, limit)
    items=[]
    for r in rows:
        items.append(AnalysisRecord(
            analysisId=r["analysis_id"],
            messageId=r["message_id"],
            createdAt=r["created_at"],
            analysis=AnalyzeResult(**r["analysis"]),
        ))
    next_cursor = encode_cursor(offset + limit) if len(rows) == limit else None
    return AnalysisListResponse(items=items, nextCursor=next_cursor)

@app.get("/v1/analysis/{analysisId}", response_model=AnalysisRecord)
async def get_analysis_detail(analysisId: str, x_client_id: Optional[str] = Header(default=None)):
    cid = client_id_from_header(x_client_id)
    r = db_get_analysis(conn, cid, analysisId)
    if not r:
        raise HTTPException(status_code=404, detail="analysis not found")
    return AnalysisRecord(
        analysisId=r["analysis_id"],
        messageId=r["message_id"],
        createdAt=r["created_at"],
        analysis=AnalyzeResult(**r["analysis"]),
    )

# PWA share_target: POST multipart/form-data -> backend -> redirect
_SHARED = {}

@app.post("/share")
async def share(text: str = Form(""), title: str = Form(""), url: str = Form("")):
    token = uuid.uuid4().hex[:12]
    _SHARED[token] = {"text": text, "title": title, "url": url}
    return RedirectResponse(url=f"/?shared={token}", status_code=302)

@app.get("/v1/shared-text")
async def shared_text(token: str):
    item = _SHARED.get(token)
    if not item:
        raise HTTPException(status_code=404, detail="token not found")
    return item
