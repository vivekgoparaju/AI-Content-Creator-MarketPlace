from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field
from app.schemas.creator import AIToolResponse, VerificationResponse

class PortfolioToolInput(BaseModel):
    tool_name: str
    usage_description: Optional[str] = None

class PortfolioCreate(BaseModel):
    title: str = Field(..., min_length=2, max_length=200)
    description: Optional[str] = None
    content_type: str = Field(..., description="video, image, animation, motion_graphics, 3d_gen")
    media_url: str = Field(..., min_length=5)
    aspect_ratio: Optional[str] = None  # e.g., '16:9', '9:16', '1:1'
    output_format: Optional[str] = None  # e.g., 'MP4', 'ProRes', 'PNG'
    workflow_description: Optional[str] = None
    commercial_use_status: Optional[str] = None
    tools: Optional[List[PortfolioToolInput]] = []

class PortfolioUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    content_type: Optional[str] = None
    media_url: Optional[str] = None
    aspect_ratio: Optional[str] = None
    output_format: Optional[str] = None
    workflow_description: Optional[str] = None
    commercial_use_status: Optional[str] = None
    tools: Optional[List[PortfolioToolInput]] = None

class PortfolioToolDetail(BaseModel):
    tool: AIToolResponse
    usage_description: Optional[str] = None

    class Config:
        from_attributes = True

class PortfolioResponse(BaseModel):
    id: int
    creator_profile_id: int
    title: str
    description: Optional[str] = None
    content_type: str
    media_url: str
    aspect_ratio: Optional[str] = None
    output_format: Optional[str] = None
    workflow_description: Optional[str] = None
    commercial_use_status: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    tools: List[PortfolioToolDetail] = []
    verification_records: List[VerificationResponse] = []

    class Config:
        from_attributes = True
