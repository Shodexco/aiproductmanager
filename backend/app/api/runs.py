from fastapi import APIRouter, HTTPException, BackgroundTasks
import structlog
from datetime import datetime
from typing import Optional
import asyncio
import os
from pydantic import BaseModel

from backend.services import storage
from core.models import RunStatus
from core.orchestration import orchestrator

logger = structlog.get_logger()

router = APIRouter()

class RunCreateRequest(BaseModel):
    idea: str

@router.post("/runs")
async def create_run(request: RunCreateRequest, background_tasks: BackgroundTasks):
    """Create a new run with a product idea."""
    if not request.idea or len(request.idea.strip()) == 0:
        raise HTTPException(status_code=400, detail="Idea cannot be empty")
    
    # Create run in storage
    run = storage.create_run(request.idea.strip())
    
    # Run agents in background
    background_tasks.add_task(run_agents_background, run.id)
    
    logger.info("Run created", run_id=run.id, idea=request.idea)
    
    return {
        "run_id": run.id,
        "status": run.status.value,
        "artifacts": run.artifacts
    }

@router.get("/runs/{run_id}")
async def get_run(run_id: str):
    """Get run details and artifacts."""
    run = storage.get_run(run_id)
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")
    
    return run.dict()

@router.get("/runs/{run_id}/download")
async def download_run(run_id: str):
    """Download zip bundle of run artifacts."""
    run = storage.get_run(run_id)
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")
    
    # Create bundle if it doesn't exist
    bundle_path = storage.create_bundle(run_id)
    if not bundle_path:
        raise HTTPException(status_code=500, detail="Failed to create bundle")
    
    # In a real implementation, we would return the file
    # For now, return the path
    return {
        "message": "Bundle created successfully",
        "run_id": run_id,
        "bundle_path": bundle_path,
        "download_url": f"/api/v1/runs/{run_id}/bundle/file"
    }

@router.get("/runs/{run_id}/artifacts/{artifact_type}")
async def get_artifact(run_id: str, artifact_type: str):
    """Get an artifact file for a run."""
    run = storage.get_run(run_id)
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")
    
    artifact_path = run.get_artifact_path(artifact_type)
    if not artifact_path or not os.path.exists(artifact_path):
        raise HTTPException(status_code=404, detail=f"Artifact {artifact_type} not found")
    
    # Determine content type and filename
    if artifact_type == "prd_markdown":
        media_type = "text/markdown"
        filename = "PRD.md"
    elif artifact_type == "prd_pdf":
        media_type = "application/pdf"
        filename = "PRD.pdf"
        # Check if it's actually a PDF or a placeholder text file
        if artifact_path.endswith('.txt'):
            media_type = "text/plain"
            filename = "PRD.txt"
    elif artifact_type == "conversation":
        media_type = "application/json"
        filename = "conversation.json"
    elif artifact_type == "mockup_json":
        media_type = "application/json"
        filename = "mockup.json"
    else:
        media_type = "application/octet-stream"
        filename = os.path.basename(artifact_path)
    
    # Read file
    try:
        with open(artifact_path, 'rb') as f:
            content = f.read()
        
        # For text files, decode for JSON response
        if artifact_type == "prd_markdown" or artifact_type == "conversation":
            content = content.decode('utf-8')
            return {
                "run_id": run_id,
                "artifact_type": artifact_type,
                "content": content,
                "filename": filename
            }
        else:
            # For binary files (PDF, etc.), return as FileResponse
            from fastapi.responses import FileResponse
            return FileResponse(
                path=artifact_path,
                media_type=media_type,
                filename=filename
            )
    except Exception as e:
        logger.error("Failed to read artifact", run_id=run_id, artifact_type=artifact_type, error=str(e))
        raise HTTPException(status_code=500, detail=f"Failed to read artifact: {str(e)}")

async def run_agents_background(run_id: str):
    """Run agents in background task."""
    try:
        await orchestrator.run_agents(run_id)
        logger.info("Background agents completed", run_id=run_id)
    except Exception as e:
        logger.error("Background agents failed", run_id=run_id, error=str(e))

@router.get("/runs")
async def list_runs(limit: int = 20, offset: int = 0):
    """List recent runs."""
    runs = storage.list_runs(limit=limit, offset=offset)
    return [run.dict() for run in runs]
