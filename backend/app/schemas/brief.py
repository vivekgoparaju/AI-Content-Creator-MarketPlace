from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field

class BriefCreate(BaseModel):
    title: str = Field(..., min_length=2, max_length=200)
    original_idea: str = Field(..., min_length=5)
    objective: Optional[str] = None
    content_type: Optional[List[str]] = Field(default_factory=list)
    visual_style: Optional[str] = None
    aspect_ratio: Optional[str] = None
    output_format: Optional[str] = None
    quantity: Optional[int] = Field(default=1, ge=1)
    target_audience: Optional[str] = None
    commercial_use_required: Optional[bool] = None  # None = unspecified
    licensing_requirements: Optional[str] = None
    additional_requirements: Optional[str] = None
    status: str = Field("DRAFT", pattern="^(DRAFT|PUBLISHED)$")

class BriefUpdate(BaseModel):
    title: Optional[str] = None
    original_idea: Optional[str] = None
    objective: Optional[str] = None
    content_type: Optional[List[str]] = None
    visual_style: Optional[str] = None
    aspect_ratio: Optional[str] = None
    output_format: Optional[str] = None
    quantity: Optional[int] = None
    target_audience: Optional[str] = None
    commercial_use_required: Optional[bool] = None
    licensing_requirements: Optional[str] = None
    additional_requirements: Optional[str] = None
    status: Optional[str] = Field(None, pattern="^(DRAFT|PUBLISHED)$")

class BriefResponse(BaseModel):
    id: int
    brand_user_id: int
    title: str
    original_idea: str
    objective: Optional[str] = None
    content_type: Optional[List[str]] = []
    visual_style: Optional[str] = None
    aspect_ratio: Optional[str] = None
    output_format: Optional[str] = None
    quantity: Optional[int] = None
    target_audience: Optional[str] = None
    commercial_use_required: Optional[bool] = None
    licensing_requirements: Optional[str] = None
    additional_requirements: Optional[str] = None
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
