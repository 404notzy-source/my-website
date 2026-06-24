from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from ..database import Base


class BrowseHistory(Base):
    __tablename__ = "browse_history"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    product_id = Column(String(128), nullable=False)
    viewed_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
