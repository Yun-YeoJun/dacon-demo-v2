# Smishing Guard API v2 (FastAPI)
- 클라이언트(브라우저/기기)별 분석 내역을 SQLite로 저장하여, 새로고침/새 탭에서도 유지됩니다.
- 프론트는 항상 `/v1/*`만 호출하고, 모델 서버는 `MODEL_URL`로 백엔드가 프록시합니다.

## 실행(Windows)
```bat
cd smishing_api_fastapi_v2
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

## 환경변수
- `MODEL_URL`: 실제 모델 서빙 URL(선택)
- `ALLOWED_ORIGINS`: CORS(쉼표구분). AWS 단일 도메인 구성 시 없어도 무방
- `DB_PATH`: SQLite 파일 경로(기본 `./data/app.db`)
