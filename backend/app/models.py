from pydantic import BaseModel, Field
from typing import List, Optional, Literal, Any

Channel = Literal["sms", "facebook", "instagram", "kakao", "email"]

class AnalyzeRequest(BaseModel):
    request_id: str = Field(default_factory=lambda: f"req_{__import__('uuid').uuid4().hex[:8]}")
    text: str

class AnalyzeResult(BaseModel):
    label: Literal["스미싱", "정상", "불명"] = "불명"
    score: float | None = None
    explanation: str = ""
    patterns: List[str] = Field(default_factory=list)
    recommended_actions: List[str] = Field(default_factory=list)
    raw_output: Any | None = None

class AnalyzeResponse(BaseModel):
    request_id: str
    success: bool = True
    result: AnalyzeResult

class InboxItem(BaseModel):
    id: str
    channel: Channel
    senderName: str
    senderId: str
    preview: str
    ts: str
    riskHint: Optional[Literal["warn", "safe"]] = None

class InboxResponse(BaseModel):
    items: List[InboxItem]
    nextCursor: Optional[str] = None

class MessageDetail(BaseModel):
    id: str
    channel: Channel
    senderId: str
    content: str
    ts: str

class SaveAnalysisRequest(BaseModel):
    messageId: str
    analysis: AnalyzeResult

class AnalysisRecord(BaseModel):
    analysisId: str
    messageId: str
    createdAt: str
    analysis: AnalyzeResult

class AnalysisListResponse(BaseModel):
    items: List[AnalysisRecord]
    nextCursor: Optional[str] = None
