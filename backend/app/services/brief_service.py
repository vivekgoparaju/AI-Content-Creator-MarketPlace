from typing import List
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.models.brief import CreativeBrief
from app.schemas.brief import BriefCreate, BriefUpdate

class BriefService:
    @staticmethod
    def create_brief(db: Session, brand_user_id: int, data: BriefCreate) -> CreativeBrief:
        brief = CreativeBrief(
            brand_user_id=brand_user_id,
            title=data.title.strip(),
            original_idea=data.original_idea.strip(),
            objective=data.objective,
            content_type=data.content_type or [],
            visual_style=data.visual_style,
            aspect_ratio=data.aspect_ratio,
            output_format=data.output_format,
            quantity=data.quantity,
            target_audience=data.target_audience,
            commercial_use_required=data.commercial_use_required,
            licensing_requirements=data.licensing_requirements,
            additional_requirements=data.additional_requirements,
            status=data.status
        )
        db.add(brief)
        db.commit()
        db.refresh(brief)
        return brief

    @staticmethod
    def list_briefs(db: Session, brand_user_id: int) -> List[CreativeBrief]:
        return db.query(CreativeBrief).filter(
            CreativeBrief.brand_user_id == brand_user_id
        ).order_by(CreativeBrief.created_at.desc()).all()

    @staticmethod
    def get_brief(db: Session, brief_id: int, brand_user_id: int) -> CreativeBrief:
        brief = db.query(CreativeBrief).filter(CreativeBrief.id == brief_id).first()
        if not brief:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={"code": "NOT_FOUND", "message": f"Creative brief #{brief_id} not found."}
            )
        # Check ownership: only owning brand or creator (if public/published)
        if brief.brand_user_id != brand_user_id and brief.status != "PUBLISHED":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={"code": "FORBIDDEN", "message": "You do not have permission to view this brief."}
            )
        return brief

    @staticmethod
    def update_brief(db: Session, brief_id: int, brand_user_id: int, data: BriefUpdate) -> CreativeBrief:
        brief = db.query(CreativeBrief).filter(CreativeBrief.id == brief_id).first()
        if not brief:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={"code": "NOT_FOUND", "message": f"Creative brief #{brief_id} not found."}
            )
        if brief.brand_user_id != brand_user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={"code": "FORBIDDEN", "message": "You can only edit briefs that you created."}
            )

        if data.title is not None:
            brief.title = data.title.strip()
        if data.original_idea is not None:
            brief.original_idea = data.original_idea.strip()
        if data.objective is not None:
            brief.objective = data.objective
        if data.content_type is not None:
            brief.content_type = data.content_type
        if data.visual_style is not None:
            brief.visual_style = data.visual_style
        if data.aspect_ratio is not None:
            brief.aspect_ratio = data.aspect_ratio
        if data.output_format is not None:
            brief.output_format = data.output_format
        if data.quantity is not None:
            brief.quantity = data.quantity
        if data.target_audience is not None:
            brief.target_audience = data.target_audience
        if data.commercial_use_required is not None:
            brief.commercial_use_required = data.commercial_use_required
        if data.licensing_requirements is not None:
            brief.licensing_requirements = data.licensing_requirements
        if data.additional_requirements is not None:
            brief.additional_requirements = data.additional_requirements
        if data.status is not None:
            brief.status = data.status

        db.commit()
        db.refresh(brief)
        return brief

    @staticmethod
    def delete_brief(db: Session, brief_id: int, brand_user_id: int) -> None:
        brief = db.query(CreativeBrief).filter(CreativeBrief.id == brief_id).first()
        if not brief:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={"code": "NOT_FOUND", "message": f"Creative brief #{brief_id} not found."}
            )
        if brief.brand_user_id != brand_user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={"code": "FORBIDDEN", "message": "You can only delete briefs that you created."}
            )
        db.delete(brief)
        db.commit()
