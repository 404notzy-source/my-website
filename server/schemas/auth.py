from typing import Optional
from pydantic import BaseModel, Field
from .user import UserOut


class RegisterRequest(BaseModel):
    username: str = Field(min_length=3, max_length=32, pattern=r"^[a-zA-Z0-9_]+$")
    email: str = Field(max_length=255)
    password: str = Field(min_length=8, max_length=128)
    captcha_id: str
    captcha_answer: str


class CaptchaResponse(BaseModel):
    captcha_id: str
    image: str


class LoginRequest(BaseModel):
    username: str = Field(min_length=1)
    password: str = Field(min_length=1)
    captcha_id: str
    captcha_answer: str


class RefreshRequest(BaseModel):
    refresh_token: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: Optional[UserOut] = None


class AccessTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
