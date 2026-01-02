from fastapi import APIRouter, Depends
import structlog
from datetime import datetime

logger = structlog.get_logger()

router = APIRouter()

@router.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "ai-product-manager-api",
    }
