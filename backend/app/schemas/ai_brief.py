from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class AIBriefContext(BaseModel):
    content_type: Optional[str] = None
    aspect_ratio: Optional[str] = None
    target_platform: Optional[str] = None
    budget_range: Optional[str] = None

class AIBriefRequest(BaseModel):
    idea: str = Field(..., min_length=5, description="Natural language creative campaign idea")
    additional_context: Optional[AIBriefContext] = None

class SuggestedBriefData(BaseModel):
    title: str
    objective: str
    content_type: List[str] = []
    visual_style: Optional[str] = None
    aspect_ratio: Optional[str] = None
    output_format: Optional[str] = None
    quantity: Optional[int] = 1
    target_audience: Optional[str] = None
    commercial_use_required: Optional[bool] = None  # None when unstated
    licensing_requirements: Optional[str] = None
    additional_requirements: Optional[str] = None
    missing_information: List[str] = []
    ai_suggestions: Dict[str, str] = {}

class AIBriefResponse(BaseModel):
    suggested_brief: SuggestedBriefData
    provider_used: str = "intelligent_heuristic"
