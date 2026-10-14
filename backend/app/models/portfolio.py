from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.session import Base

class PortfolioTool(Base):
    __tablename__ = "portfolio_tools"

    portfolio_item_id = Column(Integer, ForeignKey("portfolio_items.id", ondelete="CASCADE"), primary_key=True)
    tool_id = Column(Integer, ForeignKey("ai_tools.id", ondelete="CASCADE"), primary_key=True)
    usage_description = Column(Text, nullable=True)

    portfolio_item = relationship("PortfolioItem", back_populates="tools")
    tool = relationship("AITool", back_populates="portfolio_associations")

class PortfolioItem(Base):
    __tablename__ = "portfolio_items"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    creator_profile_id = Column(Integer, ForeignKey("creator_profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(200), nullable=False, index=True)
    description = Column(Text, nullable=True)
    content_type = Column(String(50), nullable=False, index=True)
    media_url = Column(String(2048), nullable=False)
    aspect_ratio = Column(String(30), nullable=True)
    output_format = Column(String(50), nullable=True)
    workflow_description = Column(Text, nullable=True)
    commercial_use_status = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    creator_profile = relationship("CreatorProfile", back_populates="portfolio_items")
    tools = relationship("PortfolioTool", back_populates="portfolio_item", cascade="all, delete-orphan")
    verification_records = relationship("VerificationRecord", back_populates="portfolio_item", cascade="all, delete-orphan")
