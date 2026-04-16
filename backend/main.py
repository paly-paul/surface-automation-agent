"""
main.py – FastAPI entry-point for the ESIC Employer Portal clone backend.

Run:
    pip install -r requirements.txt
    uvicorn main:app --reload --port 8000

Swagger UI: http://localhost:8000/docs
"""

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from database import init_db
from routers import auth as auth_router
from routers import employee as employee_router

load_dotenv()

# ── App factory ───────────────────────────────────────────────────────────────

app = FastAPI(
    title="ESIC Employer Portal API",
    description="REST API backend for the ESIC Employer Portal clone.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ── CORS ──────────────────────────────────────────────────────────────────────

_raw_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000")
allowed_origins = [o.strip() for o in _raw_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Lifecycle ─────────────────────────────────────────────────────────────────

@app.on_event("startup")
async def on_startup() -> None:
    init_db()


# ── Routes ────────────────────────────────────────────────────────────────────

app.include_router(auth_router.router,     prefix="/api")
app.include_router(employee_router.router, prefix="/api")


@app.get("/", tags=["System"])
async def root():
    return {
        "message": "ESIC Portal API is running",
        "docs":    "/docs",
        "health":  "/api/health",
    }


# ── Dev entry-point ───────────────────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
