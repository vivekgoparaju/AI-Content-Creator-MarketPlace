from typing import Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.dependencies import get_optional_current_user
from app.models.user import User
from app.schemas.ai_brief import AIBriefRequest, AIBriefResponse
from app.services.ai_brief_service import AIBriefService

router = APIRouter(prefix="/ai", tags=["AI Brief Builder"])

@router.post("/brief-builder", response_model=AIBriefResponse)
async def generate_brief(
    request: AIBriefRequest,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    user_id = current_user.id if current_user else 1
    return await AIBriefService.generate_brief(db, user_id, request)
