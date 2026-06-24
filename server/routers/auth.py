from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from ..database import get_db
from ..models.user import User
from ..schemas.auth import (
    RegisterRequest,
    LoginRequest,
    RefreshRequest,
    TokenResponse,
    AccessTokenResponse,
    CaptchaResponse,
)
from ..schemas.user import UserOut
from ..services.auth_service import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token,
)
from ..services.captcha import generate_captcha, verify_captcha

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.get("/captcha", response_model=CaptchaResponse)
def get_captcha():
    return generate_captcha()


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(body: RegisterRequest, db: Session = Depends(get_db)):
    if not verify_captcha(body.captcha_id, body.captcha_answer):
        raise HTTPException(status_code=400, detail="Invalid or expired captcha")

    existing = db.query(User).filter(
        (User.username == body.username) | (User.email == body.email)
    ).first()
    if existing:
        if existing.username == body.username:
            raise HTTPException(status_code=409, detail="Username already exists")
        raise HTTPException(status_code=409, detail="Email already exists")

    user = User(
        username=body.username,
        email=body.email,
        password_hash=hash_password(body.password),
        level=1,
    )
    db.add(user)
    try:
        db.commit()
        db.refresh(user)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Username or email already exists")

    user_out = UserOut(
        id=user.id,
        username=user.username,
        email=user.email,
        avatar_url=user.avatar_url,
        level=user.level,
        browse_count=0,
        created_at=user.created_at,
    )

    return TokenResponse(
        access_token=create_access_token(user.id, user.username),
        refresh_token=create_refresh_token(user.id),
        token_type="bearer",
        user=user_out,
    )


@router.post("/login", response_model=TokenResponse)
def login(body: LoginRequest, db: Session = Depends(get_db)):
    if not verify_captcha(body.captcha_id, body.captcha_answer):
        raise HTTPException(status_code=400, detail="Invalid or expired captcha")

    user = db.query(User).filter(User.username == body.username).first()
    if not user or not verify_password(body.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    user_out = UserOut(
        id=user.id,
        username=user.username,
        email=user.email,
        avatar_url=user.avatar_url,
        level=user.level,
        browse_count=0,
        created_at=user.created_at,
    )

    return TokenResponse(
        access_token=create_access_token(user.id, user.username),
        refresh_token=create_refresh_token(user.id),
        token_type="bearer",
        user=user_out,
    )


@router.post("/refresh", response_model=AccessTokenResponse)
def refresh(body: RefreshRequest, db: Session = Depends(get_db)):
    payload = decode_token(body.refresh_token, expected_type="refresh")
    if payload is None:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    user_id = payload.get("sub")
    user = db.query(User).filter(User.id == int(user_id)).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")

    return AccessTokenResponse(
        access_token=create_access_token(user.id, user.username),
        token_type="bearer",
    )
