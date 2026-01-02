from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import structlog

from backend.app.api import runs, health
from backend.app.core.config import settings

# Configure structured logging
logger = structlog.get_logger()

app = FastAPI(
    title="AI Product Manager API",
    description="API for generating PRDs using AutoGen agents",
    version="1.0.0",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict to specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(runs.router, prefix="/api/v1", tags=["runs"])
app.include_router(health.router, prefix="/api/v1", tags=["health"])

@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "message": "AI Product Manager API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/api/v1/health",
    }

@app.on_event("startup")
async def startup_event():
    """Initialize application on startup."""
    logger.info("Starting AI Product Manager API", version="1.0.0")

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown."""
    logger.info("Shutting down AI Product Manager API")
