from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    allowed_origins: str = "http://localhost:5173,http://localhost:3000"
    model_url: str = "https://34lgfbpo1egrt7-8000.proxy.runpod.net/predict"
    request_timeout_seconds: float = 10.0
    db_path: str = "./data/app.db"

    def allowed_origins_list(self) -> List[str]:
        return [o.strip() for o in self.allowed_origins.split(",") if o.strip()]

settings = Settings()
