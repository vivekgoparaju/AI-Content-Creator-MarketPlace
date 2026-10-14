import logging
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.staticfiles import StaticFiles
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.core.config import settings
from app.db.init_db import init_db
from app.api.auth import router as auth_router
from app.api.creators import router as creators_router
from app.api.portfolio import router as portfolio_router
from app.api.briefs import router as briefs_router
from app.api.ai_brief import router as ai_brief_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("creatorai")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing database and seeding demo data...")
    try:
        init_db()
        logger.info("Database initialized successfully.")
    except Exception as e:
        logger.error(f"Failed to initialize database: {e}")
    yield
    logger.info("Shutting down CreatorAI backend.")

app = FastAPI(
    title="CreatorAI — AI Content Creator Marketplace API",
    description="API connecting AI-native content creators with brands and agencies through AI briefs and rich portfolios.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow frontend during development & demos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Standardized Error Handlers per architecture.md
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    if isinstance(exc.detail, dict):
        code = exc.detail.get("code", "ERROR")
        message = exc.detail.get("message", str(exc.detail))
    else:
        code = "HTTP_ERROR"
        message = str(exc.detail)
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": {"code": code, "message": message}}
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    first_msg = errors[0].get("msg", "Validation error") if errors else "Invalid request data"
    first_loc = " -> ".join([str(l) for l in errors[0].get("loc", [])]) if errors else ""
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": {
                "code": "VALIDATION_ERROR",
                "message": f"{first_loc}: {first_msg}" if first_loc else first_msg,
                "details": errors
            }
        }
    )

@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An unexpected server error occurred. Please try again later."
            }
        }
    )

# Root & Health
@app.get("/")
def root():
    return {
        "name": "CreatorAI API",
        "status": "online",
        "version": "1.0.0",
        "documentation": "/docs"
    }

@app.get("/health")
def health():
    return {"status": "healthy"}

# Mount API v1 Routers
api_v1_prefix = "/api/v1"
app.include_router(auth_router, prefix=api_v1_prefix)
app.include_router(creators_router, prefix=api_v1_prefix)
app.include_router(portfolio_router, prefix=api_v1_prefix)
app.include_router(briefs_router, prefix=api_v1_prefix)
app.include_router(ai_brief_router, prefix=api_v1_prefix)

# Serve uploaded media files as static assets
_uploads_dir = os.path.join(os.path.dirname(__file__), "..", "uploads")
os.makedirs(_uploads_dir, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=_uploads_dir), name="uploads")
