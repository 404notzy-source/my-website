from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class UserOut(BaseModel):
    id: int
    username: str
    email: str
    avatar_url: Optional[str] = None
    level: int
    browse_count: int = 0
    created_at: datetime

    model_config = {"from_attributes": True}


class ProfileUpdate(BaseModel):
    avatar_url: Optional[str] = Field(default=None, max_length=512)


class BrowseHistoryItem(BaseModel):
    product_id: str
    viewed_at: datetime


class HistoryListResponse(BaseModel):
    items: list[BrowseHistoryItem]
    total: int
    page: int
    page_size: int
