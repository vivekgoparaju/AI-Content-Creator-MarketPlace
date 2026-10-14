from typing import List
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.models.creator import CreatorProfile, AITool
from app.models.portfolio import PortfolioItem, PortfolioTool
from app.schemas.portfolio import PortfolioCreate, PortfolioUpdate

class PortfolioService:
    @staticmethod
    def create_item(db: Session, user_id: int, data: PortfolioCreate) -> PortfolioItem:
        profile = db.query(CreatorProfile).filter(CreatorProfile.user_id == user_id).first()
        if not profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={"code": "PROFILE_NOT_FOUND", "message": "Creator profile required before adding portfolio work."}
            )

        item = PortfolioItem(
            creator_profile_id=profile.id,
            title=data.title.strip(),
            description=data.description,
            content_type=data.content_type.strip().lower(),
            media_url=data.media_url.strip(),
            aspect_ratio=data.aspect_ratio,
            output_format=data.output_format,
            workflow_description=data.workflow_description,
            commercial_use_status=data.commercial_use_status or "Commercial Ready"
        )
        db.add(item)
        db.flush()

        # Associate tools
        if data.tools:
            for tool_input in data.tools:
                t_name = tool_input.tool_name.strip()
                if not t_name:
                    continue
                ai_tool = db.query(AITool).filter(AITool.name.ilike(t_name)).first()
                if not ai_tool:
                    ai_tool = AITool(name=t_name, category="Generative AI")
                    db.add(ai_tool)
                    db.flush()
                db.add(PortfolioTool(
                    portfolio_item_id=item.id,
                    tool_id=ai_tool.id,
                    usage_description=tool_input.usage_description
                ))

        db.commit()
        db.refresh(item)
        return item

    @staticmethod
    def get_item(db: Session, item_id: int) -> PortfolioItem:
        item = db.query(PortfolioItem).filter(PortfolioItem.id == item_id).first()
        if not item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={"code": "NOT_FOUND", "message": f"Portfolio item #{item_id} not found."}
            )
        return item

    @staticmethod
    def get_creator_portfolio(db: Session, creator_profile_id: int) -> List[PortfolioItem]:
        return db.query(PortfolioItem).filter(
            PortfolioItem.creator_profile_id == creator_profile_id
        ).order_by(PortfolioItem.created_at.desc()).all()

    @staticmethod
    def update_item(db: Session, user_id: int, item_id: int, data: PortfolioUpdate) -> PortfolioItem:
        item = PortfolioService.get_item(db, item_id)
        profile = db.query(CreatorProfile).filter(CreatorProfile.user_id == user_id).first()
        
        # Enforce resource ownership
        if not profile or item.creator_profile_id != profile.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={"code": "FORBIDDEN", "message": "You can only edit your own portfolio items."}
            )

        if data.title is not None:
            item.title = data.title.strip()
        if data.description is not None:
            item.description = data.description
        if data.content_type is not None:
            item.content_type = data.content_type.strip().lower()
        if data.media_url is not None:
            item.media_url = data.media_url.strip()
        if data.aspect_ratio is not None:
            item.aspect_ratio = data.aspect_ratio
        if data.output_format is not None:
            item.output_format = data.output_format
        if data.workflow_description is not None:
            item.workflow_description = data.workflow_description
        if data.commercial_use_status is not None:
            item.commercial_use_status = data.commercial_use_status

        if data.tools is not None:
            # Clear existing tools
            db.query(PortfolioTool).filter(PortfolioTool.portfolio_item_id == item.id).delete()
            for tool_input in data.tools:
                t_name = tool_input.tool_name.strip()
                if not t_name:
                    continue
                ai_tool = db.query(AITool).filter(AITool.name.ilike(t_name)).first()
                if not ai_tool:
                    ai_tool = AITool(name=t_name, category="Generative AI")
                    db.add(ai_tool)
                    db.flush()
                db.add(PortfolioTool(
                    portfolio_item_id=item.id,
                    tool_id=ai_tool.id,
                    usage_description=tool_input.usage_description
                ))

        db.commit()
        db.refresh(item)
        return item

    @staticmethod
    def delete_item(db: Session, user_id: int, item_id: int) -> None:
        item = PortfolioService.get_item(db, item_id)
        profile = db.query(CreatorProfile).filter(CreatorProfile.user_id == user_id).first()
        if not profile or item.creator_profile_id != profile.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={"code": "FORBIDDEN", "message": "You can only delete your own portfolio items."}
            )
        db.delete(item)
        db.commit()
