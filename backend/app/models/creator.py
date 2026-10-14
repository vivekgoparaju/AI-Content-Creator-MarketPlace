from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.session import Base

class CreatorSkill(Base):
    __tablename__ = "creator_skills"

    creator_profile_id = Column(Integer, ForeignKey("creator_profiles.id", ondelete="CASCADE"), primary_key=True)
    skill_id = Column(Integer, ForeignKey("skills.id", ondelete="CASCADE"), primary_key=True)

class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    name = Column(String(100), unique=True, index=True, nullable=False)

    creators = relationship("CreatorProfile", secondary="creator_skills", back_populates="skills")

class AITool(Base):
    __tablename__ = "ai_tools"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    name = Column(String(150), unique=True, index=True, nullable=False)
    provider = Column(String(150), nullable=True)
    category = Column(String(100), nullable=True)

    portfolio_associations = relationship("PortfolioTool", back_populates="tool", cascade="all, delete-orphan")

class CreatorProfile(Base):
    __tablename__ = "creator_profiles"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    display_name = Column(String(150), nullable=False, index=True)
    bio = Column(Text, nullable=True)
    specialization = Column(String(150), nullable=True, index=True)
    experience_years = Column(Integer, nullable=True)
    avatar_url = Column(String(2048), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    user = relationship("User", back_populates="creator_profile")
    skills = relationship("Skill", secondary="creator_skills", back_populates="creators")
    portfolio_items = relationship("PortfolioItem", back_populates="creator_profile", cascade="all, delete-orphan")
    verification_records = relationship("VerificationRecord", back_populates="creator_profile", cascade="all, delete-orphan")
