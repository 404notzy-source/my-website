import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .config import CORS_ORIGINS
from .database import engine, Base
from .models import User, BrowseHistory
from .routers import auth, users, products

Base.metadata.create_all(bind=engine)

app = FastAPI(title="MyWebsite API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

avatars_dir = os.path.join(os.path.dirname(__file__), "data", "avatars")
os.makedirs(avatars_dir, exist_ok=True)
app.mount("/static/avatars", StaticFiles(directory=avatars_dir), name="avatars")

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(products.router)


@app.get("/api/health")
def health():
    return {"status": "ok"}
