from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

class UserRegister(BaseModel):
    email: str = Field(..., pattern=r"^[\w\.\+\-]+@[\w\-]+\.[a-zA-Z0-9\.\-]+$")
    password: str = Field(..., min_length=6)
    role: str = Field("CREATOR", pattern="^(CREATOR|BRAND)$")
    display_name: Optional[str] = None
    specialization: Optional[str] = None

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    role: str
    is_active: bool
    created_at: datetime
    creator_profile_id: Optional[int] = None

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
