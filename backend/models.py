"""
models.py – Pydantic request/response schemas.
"""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    username:           str
    password:           str
    captcha_text:       str
    captcha_session_id: str


class LoginResponse(BaseModel):
    success:       bool
    message:       str
    access_token:  Optional[str] = None
    token_type:    Optional[str] = None
    employer_code: Optional[str] = None
    username:      Optional[str] = None


class CaptchaResponse(BaseModel):
    session_id:     str
    captcha_image:  str  # base64 data-URI


class ForgotPasswordRequest(BaseModel):
    username: str
    email:    EmailStr


class ForgotPasswordResponse(BaseModel):
    success: bool
    message: str


class UserCreate(BaseModel):
    username:      str
    email:         EmailStr
    password:      str
    employer_code: Optional[str] = None


class UserResponse(BaseModel):
    id:            int
    username:      str
    email:         str
    employer_code: Optional[str]
    is_active:     bool
    created_at:    datetime

    model_config = {"from_attributes": True}
