from datetime import timedelta
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.creator import CreatorProfile
from app.schemas.auth import UserRegister, UserLogin
from app.core.security import hash_password, verify_password, create_access_token
from app.core.config import settings

class AuthService:
    @staticmethod
    def register_user(db: Session, data: UserRegister) -> tuple[User, str]:
        existing = db.query(User).filter(User.email == data.email.lower().strip()).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail={"code": "EMAIL_EXISTS", "message": "An account with this email address already exists."}
            )

        user = User(
            email=data.email.lower().strip(),
            password_hash=hash_password(data.password),
            role=data.role,
            is_active=True
        )
        db.add(user)
        db.flush()

        # If user is a Creator, initialize a CreatorProfile
        if data.role == "CREATOR":
            display_name = data.display_name or data.email.split("@")[0].capitalize()
            profile = CreatorProfile(
                user_id=user.id,
                display_name=display_name,
                specialization=data.specialization or "AI Content Creator",
                bio="AI-native creator eager to collaborate with leading brands and agencies."
            )
            db.add(profile)

        db.commit()
        db.refresh(user)

        token = create_access_token(
            data={"sub": str(user.id), "email": user.email, "role": user.role},
            expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        )
        return user, token

    @staticmethod
    def login_user(db: Session, data: UserLogin) -> tuple[User, str]:
        user = db.query(User).filter(User.email == data.email.lower().strip()).first()
        if not user or not verify_password(data.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail={"code": "INVALID_CREDENTIALS", "message": "Incorrect email or password. Please try again."}
            )

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={"code": "ACCOUNT_DISABLED", "message": "This account has been deactivated."}
            )

        token = create_access_token(
            data={"sub": str(user.id), "email": user.email, "role": user.role},
            expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        )
        return user, token
