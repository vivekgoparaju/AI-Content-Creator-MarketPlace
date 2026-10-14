from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.models.creator import CreatorProfile, Skill, AITool
from app.schemas.creator import CreatorProfileUpdate

class CreatorService:
    @staticmethod
    def get_profile_by_id(db: Session, creator_id: int) -> CreatorProfile:
        profile = db.query(CreatorProfile).filter(CreatorProfile.id == creator_id).first()
        if not profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={"code": "NOT_FOUND", "message": f"Creator profile #{creator_id} not found."}
            )
        return profile

    @staticmethod
    def get_profile_by_user_id(db: Session, user_id: int) -> CreatorProfile:
        profile = db.query(CreatorProfile).filter(CreatorProfile.user_id == user_id).first()
        if not profile:
            # Create if missing
            profile = CreatorProfile(
                user_id=user_id,
                display_name=f"Creator {user_id}",
                specialization="AI Content Creator"
            )
            db.add(profile)
            db.commit()
            db.refresh(profile)
        return profile

    @staticmethod
    def update_profile(db: Session, user_id: int, data: CreatorProfileUpdate) -> CreatorProfile:
        profile = CreatorService.get_profile_by_user_id(db, user_id)
        
        if data.display_name is not None:
            profile.display_name = data.display_name.strip()
        if data.bio is not None:
            profile.bio = data.bio
        if data.specialization is not None:
            profile.specialization = data.specialization.strip()
        if data.experience_years is not None:
            profile.experience_years = data.experience_years
        if data.avatar_url is not None:
            profile.avatar_url = data.avatar_url.strip()

        if data.skill_names is not None:
            new_skills = []
            for name in data.skill_names:
                name_clean = name.strip()
                if not name_clean:
                    continue
                skill = db.query(Skill).filter(Skill.name.ilike(name_clean)).first()
                if not skill:
                    skill = Skill(name=name_clean)
                    db.add(skill)
                    db.flush()
                new_skills.append(skill)
            profile.skills = new_skills

        db.commit()
        db.refresh(profile)
        return profile

    @staticmethod
    def get_all_skills(db: Session) -> List[Skill]:
        return db.query(Skill).order_by(Skill.name.asc()).all()

    @staticmethod
    def get_all_tools(db: Session) -> List[AITool]:
        return db.query(AITool).order_by(AITool.name.asc()).all()
