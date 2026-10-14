from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, HttpUrl

class SkillResponse(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True

class AIToolResponse(BaseModel):
    id: int
    name: str
    provider: Optional[str] = None
    category: Optional[str] = None

    class Config:
        from_attributes = True

class VerificationResponse(BaseModel):
    id: int
    verification_type: str
    status: str
    verification_method: Optional[str] = None
    verified_at: Optional[datetime] = None
    tool_id: Optional[int] = None
    portfolio_item_id: Optional[int] = None

    class Config:
        from_attributes = True

class PortfolioToolResponse(BaseModel):
    tool: AIToolResponse
    usage_description: Optional[str] = None

    class Config:
        from_attributes = True

class PortfolioItemSummary(BaseModel):
    id: int
    title: str
    content_type: str
    media_url: str
    aspect_ratio: Optional[str] = None
    output_format: Optional[str] = None
    workflow_description: Optional[str] = None
    commercial_use_status: Optional[str] = None
    tools: List[PortfolioToolResponse] = []
    verifications: List[VerificationResponse] = []

    class Config:
        from_attributes = True

class CreatorProfileUpdate(BaseModel):
    display_name: Optional[str] = None
    bio: Optional[str] = None
    specialization: Optional[str] = None
    experience_years: Optional[int] = None
    avatar_url: Optional[str] = None
    skill_names: Optional[List[str]] = None

class CreatorProfileResponse(BaseModel):
    id: int
    user_id: int
    display_name: str
    bio: Optional[str] = None
    specialization: Optional[str] = None
    experience_years: Optional[int] = None
    avatar_url: Optional[str] = None
    created_at: datetime
    skills: List[SkillResponse] = []
    portfolio_items: List[PortfolioItemSummary] = []
    verification_records: List[VerificationResponse] = []

    class Config:
        from_attributes = True

class CreatorCardResponse(BaseModel):
    id: int
    user_id: int
    display_name: str
    bio: Optional[str] = None
    specialization: Optional[str] = None
    experience_years: Optional[int] = None
    avatar_url: Optional[str] = None
    skills: List[str] = []
    tools: List[str] = []
    portfolio_count: int = 0
    sample_portfolio: List[PortfolioItemSummary] = []
    is_verified: bool = False
    verification_count: int = 0

    class Config:
        from_attributes = True
