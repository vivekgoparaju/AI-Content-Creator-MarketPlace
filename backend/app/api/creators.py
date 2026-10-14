from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.dependencies import get_current_user, require_creator
from app.models.user import User
from app.schemas.creator import (
    CreatorProfileResponse,
    CreatorProfileUpdate,
    CreatorCardResponse,
    SkillResponse,
    AIToolResponse,
    PortfolioItemSummary,
    PortfolioToolResponse,
    VerificationResponse
)
from app.schemas.portfolio import PortfolioResponse
from app.services.creator_service import CreatorService
from app.services.discovery_service import DiscoveryService
from app.services.portfolio_service import PortfolioService

router = APIRouter(prefix="/creators", tags=["Creators & Discovery"])

@router.get("", response_model=Dict[str, Any])
def search_creators(
    q: Optional[str] = Query(None, description="Keyword search in name, bio, specialization"),
    skill: Optional[str] = Query(None, description="Filter by skill"),
    specialization: Optional[str] = Query(None, description="Filter by specialization"),
    tool: Optional[str] = Query(None, description="Filter by AI tool/model"),
    content_type: Optional[str] = Query(None, description="Filter by content type: video, image, animation, etc."),
    verified_only: Optional[bool] = Query(False, description="Filter by verified creators only"),
    page: int = Query(1, ge=1),
    page_size: int = Query(12, ge=1, le=50),
    db: Session = Depends(get_db)
):
    return DiscoveryService.search_creators(
        db=db,
        query=q,
        skill=skill,
        specialization=specialization,
        tool=tool,
        content_type=content_type,
        verified_only=verified_only,
        page=page,
        page_size=page_size
    )

@router.get("/skills", response_model=List[SkillResponse])
def get_skills(db: Session = Depends(get_db)):
    return CreatorService.get_all_skills(db)

@router.get("/tools", response_model=List[AIToolResponse])
def get_tools(db: Session = Depends(get_db)):
    return CreatorService.get_all_tools(db)

@router.get("/me", response_model=CreatorProfileResponse)
def get_my_profile(current_user: User = Depends(require_creator), db: Session = Depends(get_db)):
    profile = CreatorService.get_profile_by_user_id(db, current_user.id)
    return profile

@router.put("/me", response_model=CreatorProfileResponse)
def update_my_profile(
    data: CreatorProfileUpdate,
    current_user: User = Depends(require_creator),
    db: Session = Depends(get_db)
):
    return CreatorService.update_profile(db, current_user.id, data)

@router.get("/me/portfolio", response_model=List[PortfolioResponse])
def get_my_portfolio(current_user: User = Depends(require_creator), db: Session = Depends(get_db)):
    profile = CreatorService.get_profile_by_user_id(db, current_user.id)
    return PortfolioService.get_creator_portfolio(db, profile.id)

@router.get("/{id}", response_model=CreatorProfileResponse)
def get_creator_profile(id: int, db: Session = Depends(get_db)):
    return CreatorService.get_profile_by_id(db, id)
