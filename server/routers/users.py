from fastapi import APIRouter, Depends, HTTPException, status, Query, UploadFile, File
from sqlalchemy.orm import Session
from sqlalchemy import func
import os
import uuid

from ..database import get_db
from ..dependencies import get_current_user
from ..models.user import User
from ..models.browse_history import BrowseHistory
from ..schemas.user import UserOut, ProfileUpdate, BrowseHistoryItem, HistoryListResponse

router = APIRouter(prefix="/api/users", tags=["users"])

AVATAR_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "avatars")
os.makedirs(AVATAR_DIR, exist_ok=True)


def _calc_level(browse_count: int) -> int:
    if browse_count >= 100:
        return 4
    if browse_count >= 50:
        return 3
    if browse_count >= 20:
        return 2
    return 1


def _user_to_out(user: User, db: Session) -> UserOut:
    browse_count = db.query(BrowseHistory).filter(BrowseHistory.user_id == user.id).count()
    level = _calc_level(browse_count)
    return UserOut(
        id=user.id,
        username=user.username,
        email=user.email,
        avatar_url=user.avatar_url,
        level=level,
        browse_count=browse_count,
        created_at=user.created_at,
    )


@router.get("/me", response_model=UserOut)
def get_me(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return _user_to_out(current_user, db)


@router.patch("/me", response_model=UserOut)
def update_me(
    body: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if body.avatar_url is not None:
        current_user.avatar_url = body.avatar_url
    db.commit()
    db.refresh(current_user)
    return _user_to_out(current_user, db)


@router.post("/me/avatar", response_model=UserOut)
async def upload_avatar(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    allowed = {"image/jpeg", "image/png", "image/gif", "image/webp"}
    if file.content_type not in allowed:
        raise HTTPException(status_code=400, detail="Only JPEG/PNG/GIF/WEBP allowed")

    ext = file.filename.split(".")[-1] if "." in file.filename else "png"
    filename = f"{uuid.uuid4().hex}.{ext}"
    filepath = os.path.join(AVATAR_DIR, filename)

    contents = await file.read()
    if len(contents) > 2 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large (max 2MB)")

    with open(filepath, "wb") as f:
        f.write(contents)

    current_user.avatar_url = f"/static/avatars/{filename}"
    db.commit()
    db.refresh(current_user)
    return _user_to_out(current_user, db)


@router.get("/me/history", response_model=HistoryListResponse)
def get_history(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100, alias="pageSize"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = (
        db.query(BrowseHistory)
        .filter(BrowseHistory.user_id == current_user.id)
        .order_by(BrowseHistory.viewed_at.desc())
    )
    total = query.count()
    items = query.offset((page - 1) * page_size).limit(page_size).all()

    return HistoryListResponse(
        items=[
            BrowseHistoryItem(product_id=item.product_id, viewed_at=item.viewed_at)
            for item in items
        ],
        total=total,
        page=page,
        page_size=page_size,
    )
