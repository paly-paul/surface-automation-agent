"""
database.py – SQLAlchemy setup and table definitions for ESIC portal clone.
"""

import os
from datetime import datetime

from sqlalchemy import (
    Boolean, Column, DateTime, Integer, String, create_engine
)
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./esic_portal.db")

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {},
    echo=False,
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


# ── Tables ───────────────────────────────────────────────────────────────────

class User(Base):
    __tablename__ = "users"

    id               = Column(Integer, primary_key=True, index=True)
    username         = Column(String(100), unique=True, index=True, nullable=False)
    email            = Column(String(255), unique=True, index=True, nullable=False)
    password_hash    = Column(String(255), nullable=False)
    employer_code    = Column(String(50), unique=True, nullable=True)
    is_active        = Column(Boolean, default=True)
    created_at       = Column(DateTime, default=datetime.utcnow)
    last_login       = Column(DateTime, nullable=True)
    password_changed = Column(DateTime, nullable=True)


class CaptchaSession(Base):
    __tablename__ = "captcha_sessions"

    id           = Column(Integer, primary_key=True, index=True)
    session_id   = Column(String(36), unique=True, index=True, nullable=False)
    captcha_text = Column(String(10), nullable=False)
    created_at   = Column(DateTime, default=datetime.utcnow)
    is_used      = Column(Boolean, default=False)


class LoginAttempt(Base):
    __tablename__ = "login_attempts"

    id           = Column(Integer, primary_key=True, index=True)
    username     = Column(String(100), nullable=False, index=True)
    ip_address   = Column(String(45), nullable=True)
    success      = Column(Boolean, default=False)
    attempted_at = Column(DateTime, default=datetime.utcnow)


# ── Helpers ──────────────────────────────────────────────────────────────────

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db() -> None:
    """Create tables and seed a default test user."""
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        from passlib.context import CryptContext

        pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")
        existing = db.query(User).filter(User.username == "test_employer").first()
        if not existing:
            db.add(User(
                username="test_employer",
                email="test@esic.gov.in",
                password_hash=pwd_ctx.hash("Test@1234"),
                employer_code="EMP001",
                is_active=True,
            ))
            db.commit()
    finally:
        db.close()
