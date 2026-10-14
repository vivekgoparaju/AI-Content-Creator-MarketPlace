import os
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_ENV: str = "development"
    APP_HOST: str = "127.0.0.1"
    APP_PORT: int = 8000
    FRONTEND_URL: str = "http://localhost:5173"
    
    # Database URL: default to MySQL or SQLite fallback
    DATABASE_URL: str = "sqlite:///./marketplace.db"
    
    # JWT Auth
    JWT_SECRET_KEY: str = "creatorai-super-secure-jwt-secret-key-change-in-prod-2026"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    
    # AI Provider
    AI_PROVIDER: str = "heuristic"
    AI_API_KEY: str = ""
    AI_MODEL: str = ""
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ]

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
