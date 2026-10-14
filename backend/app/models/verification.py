from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.session import Base

class VerificationRecord(Base):
    __tablename__ = "verification_records"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    creator_profile_id = Column(Integer, ForeignKey("creator_profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    portfolio_item_id = Column(Integer, ForeignKey("portfolio_items.id", ondelete="CASCADE"), nullable=True, index=True)
    tool_id = Column(Integer, ForeignKey("ai_tools.id", ondelete="CASCADE"), nullable=True, index=True)
    verification_type = Column(String(50), nullable=False)  # 'TOOL', 'WORKFLOW', 'PORTFOLIO'
    status = Column(String(30), nullable=False, default="UNVERIFIED")  # 'PENDING', 'VERIFIED', 'UNVERIFIED'
    verification_method = Column(String(150), nullable=True)
    verified_at = Column(DateTime, nullable=True)

    creator_profile = relationship("CreatorProfile", back_populates="verification_records")
    portfolio_item = relationship("PortfolioItem", back_populates="verification_records")
    tool = relationship("AITool")
