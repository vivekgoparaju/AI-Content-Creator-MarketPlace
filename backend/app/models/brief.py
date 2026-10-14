from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.db.session import Base

class CreativeBrief(Base):
    __tablename__ = "creative_briefs"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    brand_user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(200), nullable=False, index=True)
    original_idea = Column(Text, nullable=False)
    objective = Column(Text, nullable=True)
    content_type = Column(JSON, nullable=True)  # list of strings, e.g. ["video", "animation"]
    visual_style = Column(String(150), nullable=True)
    aspect_ratio = Column(String(30), nullable=True)
    output_format = Column(String(50), nullable=True)
    quantity = Column(Integer, nullable=True)
    target_audience = Column(Text, nullable=True)
    commercial_use_required = Column(Boolean, nullable=True)
    licensing_requirements = Column(Text, nullable=True)
    additional_requirements = Column(Text, nullable=True)
    status = Column(String(30), default="DRAFT", nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    brand_user = relationship("User", back_populates="creative_briefs")

class AIBriefGeneration(Base):
    __tablename__ = "ai_brief_generations"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    brand_user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    original_idea = Column(Text, nullable=False)
    generated_brief = Column(JSON, nullable=False)
    model_name = Column(String(150), nullable=True)
    status = Column(String(30), default="SUCCESS", nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    brand_user = relationship("User", back_populates="ai_generations")
