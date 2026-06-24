from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..dependencies import get_current_user
from ..models.user import User
from ..models.browse_history import BrowseHistory

router = APIRouter(prefix="/api/products", tags=["products"])


@router.post("/{product_id}/view", status_code=status.HTTP_201_CREATED)
def record_view(
    product_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    entry = BrowseHistory(user_id=current_user.id, product_id=product_id)
    db.add(entry)
    db.commit()
    return {"message": "View recorded"}
