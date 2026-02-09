from __future__ import annotations
import sqlite3, os, json
from typing import Any, Dict, List, Optional, Tuple
from datetime import datetime, timezone

def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat().replace("+00:00","Z")

def ensure_db(db_path: str) -> sqlite3.Connection:
    os.makedirs(os.path.dirname(db_path), exist_ok=True)
    conn = sqlite3.connect(db_path, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()
    cur.execute("""
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      channel TEXT NOT NULL,
      sender_name TEXT NOT NULL,
      sender_id TEXT NOT NULL,
      content TEXT NOT NULL,
      ts TEXT NOT NULL
    )
    """)
    cur.execute("""
    CREATE TABLE IF NOT EXISTS analyses (
      analysis_id TEXT PRIMARY KEY,
      client_id TEXT NOT NULL,
      message_id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      analysis_json TEXT NOT NULL
    )
    """)
    cur.execute("""
    CREATE INDEX IF NOT EXISTS idx_analyses_client_created
    ON analyses(client_id, created_at DESC)
    """)
    conn.commit()
    return conn

def seed_messages(conn: sqlite3.Connection):
    cur = conn.cursor()
    cur.execute("SELECT COUNT(*) AS c FROM messages")
    c = cur.fetchone()["c"]
    if c and c > 0:
        return
    samples = [
        ("msg_001","sms","택배","010-****-5678","배송지 확인이 필요합니다. 주소 확인: https://short.url/abcd", now_iso()),
        ("msg_002","sms","은행","010-****-1234","긴급! 계정 인증이 필요합니다. 아래 링크에서 즉시 확인하세요 https://bit.ly/xxxx", now_iso()),
        ("msg_003","facebook","남현","fb_user_01","내일 식사 갈래?", now_iso()),
        ("msg_004","instagram","은혜","ig_user_01","이거 너 맞아? 링크 봐 https://example.com", now_iso()),
        ("msg_005","kakao","민채","kakao_user_01","카카오톡에서 공유된 메시지 예시입니다. https://t.co/abcd", now_iso()),
        ("msg_006","email","billing@example.com","billing@example.com","결제 실패 안내입니다. 결제 수단을 확인하세요.", now_iso()),
    ]
    cur.executemany(
        "INSERT INTO messages(id,channel,sender_name,sender_id,content,ts) VALUES (?,?,?,?,?,?)",
        samples
    )
    conn.commit()

def list_messages(conn: sqlite3.Connection, channel: str, offset: int, limit: int):
    cur = conn.cursor()
    cur.execute(
        "SELECT id,channel,sender_name,sender_id,substr(content,1,60) AS preview, ts FROM messages WHERE channel=? ORDER BY ts DESC LIMIT ? OFFSET ?",
        (channel, limit, offset),
    )
    return [dict(r) for r in cur.fetchall()]

def get_message(conn: sqlite3.Connection, message_id: str) -> Optional[Dict[str,Any]]:
    cur = conn.cursor()
    cur.execute("SELECT id,channel,sender_name,sender_id,content,ts FROM messages WHERE id=?", (message_id,))
    r = cur.fetchone()
    return dict(r) if r else None

def save_analysis(conn: sqlite3.Connection, analysis_id: str, client_id: str, message_id: str, created_at: str, analysis_obj: Dict[str,Any]):
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO analyses(analysis_id, client_id, message_id, created_at, analysis_json) VALUES (?,?,?,?,?)",
        (analysis_id, client_id, message_id, created_at, json.dumps(analysis_obj, ensure_ascii=False)),
    )
    conn.commit()

def list_analyses(conn: sqlite3.Connection, client_id: str, offset: int, limit: int):
    cur = conn.cursor()
    cur.execute(
        "SELECT analysis_id, message_id, created_at, analysis_json FROM analyses WHERE client_id=? ORDER BY created_at DESC LIMIT ? OFFSET ?",
        (client_id, limit, offset),
    )
    rows=[]
    for r in cur.fetchall():
        rows.append({
            "analysis_id": r["analysis_id"],
            "message_id": r["message_id"],
            "created_at": r["created_at"],
            "analysis": json.loads(r["analysis_json"]),
        })
    return rows

def get_analysis(conn: sqlite3.Connection, client_id: str, analysis_id: str) -> Optional[Dict[str,Any]]:
    cur = conn.cursor()
    cur.execute(
        "SELECT analysis_id, message_id, created_at, analysis_json FROM analyses WHERE client_id=? AND analysis_id=?",
        (client_id, analysis_id),
    )
    r = cur.fetchone()
    if not r:
        return None
    return {
        "analysis_id": r["analysis_id"],
        "message_id": r["message_id"],
        "created_at": r["created_at"],
        "analysis": json.loads(r["analysis_json"]),
    }
