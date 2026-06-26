import os

JWT_SECRET = os.getenv("JWT_SECRET", "dev-secret-key-change-in-production")
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
os.makedirs(DATA_DIR, exist_ok=True)

DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{os.path.join(DATA_DIR, 'app.db')}")

CORS_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:4173",
    "https://404notzy-source.github.io",
]

# Railway 部署时通过环境变量追加额外 origin
_extra_origin = os.getenv("CORS_EXTRA_ORIGIN")
if _extra_origin:
    CORS_ORIGINS.append(_extra_origin)
