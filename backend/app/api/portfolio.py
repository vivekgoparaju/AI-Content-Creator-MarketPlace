import os
import uuid
from fastapi import APIRouter, Depends, status, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.dependencies import require_creator
from app.models.user import User
from app.schemas.portfolio import PortfolioCreate, PortfolioUpdate, PortfolioResponse
from app.services.portfolio_service import PortfolioService

router = APIRouter(prefix="/portfolio", tags=["AI Portfolio"])

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "uploads", "portfolio")
ALLOWED_TYPES = {
    "image/jpeg", "image/png", "image/gif", "image/webp",
    "video/mp4", "video/webm", "video/quicktime", "video/x-msvideo"
}
MAX_FILE_SIZE = 100 * 1024 * 1024  # 100 MB

@router.post("/upload-media", status_code=status.HTTP_200_OK)
async def upload_portfolio_media(
    file: UploadFile = File(...),
    current_user: User = Depends(require_creator)
):
    """Upload a media file (image or video) for use in a portfolio item."""
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"code": "INVALID_FILE_TYPE", "message": f"File type '{file.content_type}' is not allowed. Use JPEG, PNG, GIF, WebP, MP4, WebM, or MOV."}
        )

    # Read and validate size
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail={"code": "FILE_TOO_LARGE", "message": "File exceeds the 100 MB limit."}
        )

    # Ensure upload directory exists
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    # Generate a unique filename preserving extension
    ext = os.path.splitext(file.filename or "")[1].lower() or ".bin"
    unique_name = f"{uuid.uuid4().hex}{ext}"
    file_path = os.path.join(UPLOAD_DIR, unique_name)

    with open(file_path, "wb") as f:
        f.write(contents)

    # Return the public URL path that will be served as static
    return {"url": f"/uploads/portfolio/{unique_name}", "filename": unique_name}

@router.post("", response_model=PortfolioResponse, status_code=status.HTTP_201_CREATED)
def create_portfolio_item(
    data: PortfolioCreate,
    current_user: User = Depends(require_creator),
    db: Session = Depends(get_db)
):
    return PortfolioService.create_item(db, current_user.id, data)

@router.get("/{id}", response_model=PortfolioResponse)
def get_portfolio_item(id: int, db: Session = Depends(get_db)):
    return PortfolioService.get_item(db, id)

@router.put("/{id}", response_model=PortfolioResponse)
def update_portfolio_item(
    id: int,
    data: PortfolioUpdate,
    current_user: User = Depends(require_creator),
    db: Session = Depends(get_db)
):
    return PortfolioService.update_item(db, current_user.id, id, data)

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_portfolio_item(
    id: int,
    current_user: User = Depends(require_creator),
    db: Session = Depends(get_db)
):
    PortfolioService.delete_item(db, current_user.id, id)
    return None
