from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.dependencies import require_brand, get_current_user
from app.models.user import User
from app.schemas.brief import BriefCreate, BriefUpdate, BriefResponse
from app.services.brief_service import BriefService

router = APIRouter(prefix="/briefs", tags=["Creative Briefs"])

@router.post("", response_model=BriefResponse, status_code=status.HTTP_201_CREATED)
def create_brief(
    data: BriefCreate,
    current_user: User = Depends(require_brand),
    db: Session = Depends(get_db)
):
    return BriefService.create_brief(db, current_user.id, data)

@router.get("", response_model=List[BriefResponse])
def list_briefs(
    current_user: User = Depends(require_brand),
    db: Session = Depends(get_db)
):
    return BriefService.list_briefs(db, current_user.id)

@router.get("/{id}", response_model=BriefResponse)
def get_brief(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return BriefService.get_brief(db, id, current_user.id)

@router.put("/{id}", response_model=BriefResponse)
def update_brief(
    id: int,
    data: BriefUpdate,
    current_user: User = Depends(require_brand),
    db: Session = Depends(get_db)
):
    return BriefService.update_brief(db, id, current_user.id, data)

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_brief(
    id: int,
    current_user: User = Depends(require_brand),
    db: Session = Depends(get_db)
):
    BriefService.delete_brief(db, id, current_user.id)
    return None
