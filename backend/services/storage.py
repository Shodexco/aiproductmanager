import json
import os
import shutil
from pathlib import Path
from typing import Optional, List
import structlog
from datetime import datetime

from core.models import Run, RunStatus

logger = structlog.get_logger()

class StorageService:
    """Service for storing and retrieving runs and their artifacts."""
    
    def __init__(self, base_data_dir: str = "./data"):
        self.base_data_dir = Path(base_data_dir)
        self.runs_dir = self.base_data_dir / "runs"
        self.runs_dir.mkdir(parents=True, exist_ok=True)
        
        # In-memory cache of runs
        self._runs_cache = {}
    
    def create_run(self, idea: str) -> Run:
        """Create a new run with the given idea."""
        run = Run(idea=idea)
        
        # Create run directory
        run_dir = self.runs_dir / run.id
        run_dir.mkdir(parents=True, exist_ok=True)
        
        # Set artifact paths
        run.set_artifact_path("prd_markdown", str(run_dir / "PRD.md"))
        run.set_artifact_path("prd_pdf", str(run_dir / "PRD.pdf"))
        run.set_artifact_path("conversation", str(run_dir / "conversation.json"))
        run.set_artifact_path("mockup_json", str(run_dir / "mockup.json"))
        run.set_artifact_path("bundle", str(run_dir / "bundle.zip"))
        
        # Save initial run state
        self._save_run(run)
        
        logger.info("Run created", run_id=run.id, idea=idea)
        return run
    
    def get_run(self, run_id: str) -> Optional[Run]:
        """Get a run by ID."""
        # Check cache first
        if run_id in self._runs_cache:
            return self._runs_cache[run_id]
        
        # Load from disk
        run_path = self.runs_dir / run_id / "run.json"
        if not run_path.exists():
            return None
        
        try:
            with open(run_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            run = Run(**data)
            self._runs_cache[run_id] = run
            return run
        except Exception as e:
            logger.error("Failed to load run", run_id=run_id, error=str(e))
            return None
    
    def update_run(self, run: Run) -> bool:
        """Update a run."""
        try:
            self._save_run(run)
            self._runs_cache[run.id] = run
            return True
        except Exception as e:
            logger.error("Failed to update run", run_id=run.id, error=str(e))
            return False
    
    def list_runs(self, limit: int = 20, offset: int = 0) -> List[Run]:
        """List runs, sorted by creation date (newest first)."""
        runs = []
        
        # Get all run directories
        for run_dir in self.runs_dir.iterdir():
            if not run_dir.is_dir():
                continue
            
            run = self.get_run(run_dir.name)
            if run:
                runs.append(run)
        
        # Sort by creation date (newest first)
        runs.sort(key=lambda r: r.created_at, reverse=True)
        
        # Apply pagination
        return runs[offset:offset + limit]
    
    def save_artifact(self, run_id: str, artifact_type: str, content: str) -> bool:
        """Save an artifact for a run."""
        run = self.get_run(run_id)
        if not run:
            return False
        
        artifact_path = Path(run.get_artifact_path(artifact_type))
        if not artifact_path:
            return False
        
        try:
            artifact_path.parent.mkdir(parents=True, exist_ok=True)
            
            if artifact_type == "conversation":
                # For JSON, parse and pretty-print
                data = json.loads(content) if isinstance(content, str) else content
                with open(artifact_path, 'w', encoding='utf-8') as f:
                    json.dump(data, f, indent=2, default=str)
            else:
                # For text/binary, write as-is
                with open(artifact_path, 'w', encoding='utf-8') as f:
                    f.write(content)
            
            logger.info("Artifact saved", run_id=run_id, artifact_type=artifact_type, path=str(artifact_path))
            return True
        except Exception as e:
            logger.error("Failed to save artifact", run_id=run_id, artifact_type=artifact_type, error=str(e))
            return False
    
    def create_bundle(self, run_id: str) -> Optional[str]:
        """Create a zip bundle of all artifacts for a run."""
        run = self.get_run(run_id)
        if not run:
            return None
        
        bundle_path = Path(run.get_artifact_path("bundle"))
        if not bundle_path:
            return None
        
        try:
            run_dir = self.runs_dir / run_id
            
            # Create zip file
            import zipfile
            with zipfile.ZipFile(bundle_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
                # Add all files in run directory
                for file_path in run_dir.rglob("*"):
                    if file_path.is_file() and file_path != bundle_path:
                        arcname = file_path.relative_to(run_dir)
                        zipf.write(file_path, arcname)
            
            logger.info("Bundle created", run_id=run_id, bundle_path=str(bundle_path))
            return str(bundle_path)
        except Exception as e:
            logger.error("Failed to create bundle", run_id=run_id, error=str(e))
            return None
    
    def _save_run(self, run: Run):
        """Save run to disk."""
        run_path = self.runs_dir / run.id / "run.json"
        run_path.parent.mkdir(parents=True, exist_ok=True)
        
        # Convert to dict and handle datetime serialization
        run_dict = run.dict()
        run_dict["created_at"] = run.created_at.isoformat()
        run_dict["updated_at"] = run.updated_at.isoformat()
        if run.completed_at:
            run_dict["completed_at"] = run.completed_at.isoformat()
        
        with open(run_path, 'w', encoding='utf-8') as f:
            json.dump(run_dict, f, indent=2, default=str)
        
        logger.debug("Run saved", run_id=run.id, path=str(run_path))

# Global storage service instance
storage = StorageService()
