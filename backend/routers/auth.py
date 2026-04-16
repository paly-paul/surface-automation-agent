"""
routers/auth.py – Authentication endpoints for the ESIC portal clone.
"""

import os
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, Request
import base64
import hashlib
import hmac
import json
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from database import CaptchaSession, LoginAttempt, User, get_db
from captcha_utils import create_captcha_session
from models import (
    CaptchaResponse,
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    LoginRequest,
    LoginResponse,
    UserCreate,
    UserResponse,
)

router = APIRouter()

pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY  = os.getenv("SECRET_KEY",  "change-me-in-production")
ALGORITHM   = os.getenv("ALGORITHM",   "HS256")
TOKEN_EXP   = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))


def _make_token(data: dict) -> str:
    """Create a simple HMAC-signed token (header.payload.signature, base64url-encoded)."""
    payload = {**data, "exp": (datetime.utcnow() + timedelta(minutes=TOKEN_EXP)).isoformat()}
    header  = base64.urlsafe_b64encode(json.dumps({"alg": "HS256", "typ": "JWT"}).encode()).rstrip(b"=")
    body    = base64.urlsafe_b64encode(json.dumps(payload).encode()).rstrip(b"=")
    msg     = header + b"." + body
    sig     = base64.urlsafe_b64encode(
        hmac.new(SECRET_KEY.encode(), msg, hashlib.sha256).digest()  # type: ignore[attr-defined]
    ).rstrip(b"=")
    return (msg + b"." + sig).decode()


# ── Captcha ───────────────────────────────────────────────────────────────────

@router.get("/captcha", response_model=CaptchaResponse, tags=["Auth"])
async def get_captcha(db: Session = Depends(get_db)):
    """Generate a new CAPTCHA image; returns session_id + base64 data-URI."""
    data = create_captcha_session()
    db.add(CaptchaSession(
        session_id=data["session_id"],
        captcha_text=data["captcha_text"],
    ))
    db.commit()
    return CaptchaResponse(
        session_id=data["session_id"],
        captcha_image=data["captcha_image"],
    )


# ── Login ─────────────────────────────────────────────────────────────────────

@router.post("/login", response_model=LoginResponse, tags=["Auth"])
async def login(
    request: Request,
    body: LoginRequest,
    db: Session = Depends(get_db),
):
    """Validate CAPTCHA + credentials, return JWT on success."""
    client_ip = request.client.host if request.client else "unknown"

    # 1. Validate CAPTCHA session
    cap = db.query(CaptchaSession).filter(
        CaptchaSession.session_id == body.captcha_session_id,
        CaptchaSession.is_used.is_(False),
    ).first()

    if not cap:
        raise HTTPException(status_code=400, detail="Invalid or expired captcha session")

    cap.is_used = True
    db.commit()

    if cap.captcha_text.upper() != body.captcha_text.upper():
        raise HTTPException(status_code=400, detail="Incorrect captcha code")

    # 2. Validate user credentials
    user = db.query(User).filter(User.username == body.username).first()
    attempt = LoginAttempt(username=body.username, ip_address=client_ip)

    if not user or not pwd_ctx.verify(body.password, user.password_hash):
        db.add(attempt)
        db.commit()
        raise HTTPException(status_code=401, detail="Invalid username or password")

    if not user.is_active:
        db.add(attempt)
        db.commit()
        raise HTTPException(status_code=403, detail="Account is deactivated")

    # 3. Success
    attempt.success = True
    user.last_login = datetime.utcnow()
    db.add(attempt)
    db.commit()

    token = _make_token({"sub": user.username, "employer_code": user.employer_code})
    return LoginResponse(
        success=True,
        message="Login successful",
        access_token=token,
        token_type="bearer",
        employer_code=user.employer_code,
        username=user.username,
    )


# ── Forgot password ───────────────────────────────────────────────────────────

@router.post("/forgot-password", response_model=ForgotPasswordResponse, tags=["Auth"])
async def forgot_password(body: ForgotPasswordRequest, db: Session = Depends(get_db)):
    """Initiate a password-reset flow (email sending is a stub for now)."""
    # Always return success to prevent username enumeration
    user = db.query(User).filter(
        User.username == body.username,
        User.email    == body.email,
    ).first()

    if user:
        # TODO: send email with reset link
        pass

    return ForgotPasswordResponse(
        success=True,
        message=(
            "If the username and email match our records, "
            "password reset instructions will be sent to the registered email."
        ),
    )


# ── Registration (sign-up) ────────────────────────────────────────────────────

@router.post("/register", response_model=UserResponse, status_code=201, tags=["Auth"])
async def register(body: UserCreate, db: Session = Depends(get_db)):
    """Create a new employer account."""
    if db.query(User).filter(User.username == body.username).first():
        raise HTTPException(status_code=409, detail="Username already exists")
    if db.query(User).filter(User.email == body.email).first():
        raise HTTPException(status_code=409, detail="Email already registered")

    user = User(
        username=body.username,
        email=body.email,
        password_hash=pwd_ctx.hash(body.password),
        employer_code=body.employer_code,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


# ── Health ────────────────────────────────────────────────────────────────────

@router.get("/health", tags=["System"])
async def health():
    return {"status": "ok", "service": "ESIC Portal API"}
