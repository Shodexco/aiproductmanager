"""Tests for the AI Product Manager backend."""

import pytest
import json
import os
from pathlib import Path
from unittest.mock import Mock, AsyncMock, patch

from core.models import Run, RunStatus, AgentRole
from backend.services.storage import StorageService
from core.orchestration import Orchestrator


@pytest.fixture
def storage_service(tmp_path):
    """Create a storage service with temporary directory."""
    return StorageService(base_data_dir=str(tmp_path))


@pytest.fixture
def mock_llm_client():
    """Create a mock LLM client."""
    client = Mock()
    client.generate = AsyncMock()
    return client


@pytest.fixture
def orchestrator(mock_llm_client, storage_service):
    """Create an orchestrator with mock LLM client and test storage."""
    orchestrator = Orchestrator(llm_client=mock_llm_client)
    orchestrator.storage = storage_service
    return orchestrator


class TestStorageService:
    """Test storage service functionality."""
    
    def test_create_run(self, storage_service):
        """Test creating a new run."""
        idea = "Test product idea"
        run = storage_service.create_run(idea)
        
        assert run.idea == idea
        assert run.status == RunStatus.PENDING
        assert run.id is not None
        
        # Check that artifact paths are set
        assert "prd_markdown" in run.artifacts
        assert "prd_pdf" in run.artifacts
        assert "conversation" in run.artifacts
        assert "mockup_json" in run.artifacts
        assert "bundle" in run.artifacts
        
        # Check that run directory was created
        run_dir = Path(storage_service.runs_dir) / run.id
        assert run_dir.exists()
        assert (run_dir / "run.json").exists()
    
    def test_get_run(self, storage_service):
        """Test retrieving a run by ID."""
        idea = "Test product idea"
        created_run = storage_service.create_run(idea)
        
        retrieved_run = storage_service.get_run(created_run.id)
        assert retrieved_run is not None
        assert retrieved_run.id == created_run.id
        assert retrieved_run.idea == idea
    
    def test_save_artifact(self, storage_service):
        """Test saving an artifact."""
        run = storage_service.create_run("Test idea")
        artifact_content = "Test artifact content"
        
        success = storage_service.save_artifact(run.id, "prd_markdown", artifact_content)
        assert success is True
        
        # Check that artifact file was created
        artifact_path = Path(run.get_artifact_path("prd_markdown"))
        assert artifact_path.exists()
        assert artifact_path.read_text() == artifact_content
    
    def test_create_bundle(self, storage_service):
        """Test creating a bundle zip file."""
        run = storage_service.create_run("Test idea")
        
        # Create some artifacts
        storage_service.save_artifact(run.id, "prd_markdown", "# Test PRD")
        storage_service.save_artifact(run.id, "conversation", '{"test": "data"}')
        
        bundle_path = storage_service.create_bundle(run.id)
        assert bundle_path is not None
        assert Path(bundle_path).exists()
        assert bundle_path.endswith(".zip")


class TestOrchestrator:
    """Test orchestrator functionality."""
    
    @pytest.mark.asyncio
    async def test_run_agents(self, orchestrator, storage_service, mock_llm_client):
        """Test running the full agent workflow."""
        # Mock LLM responses
        mock_llm_client.generate.side_effect = [
            "Strategist response",
            "Architect response", 
            "UX Writer response",
            json.dumps({
                "product_name": "Test Product",
                "screens": [{"name": "Dashboard", "route": "/", "layout": "dashboard", "components": []}]
            }),
            "# Test PRD\n## Execution Plan\nTest execution plan"
        ]
        
        # Create a run
        run = storage_service.create_run("Test product idea")
        
        # Run agents
        result = await orchestrator.run_agents(run.id)
        
        # Check that run was completed
        assert result.status == RunStatus.COMPLETED
        assert len(result.messages) == 5
        
        # Check message roles
        roles = [msg.role for msg in result.messages]
        assert roles == [
            AgentRole.STRATEGIST,
            AgentRole.ARCHITECT,
            AgentRole.UX_WRITER,
            AgentRole.MOCKUP_DESIGNER,
            AgentRole.SYNTHESIZER
        ]
        
        # Check that artifacts were created
        run_dir = Path(storage_service.runs_dir) / run.id
        assert (run_dir / "PRD.md").exists()
        assert (run_dir / "mockup.json").exists()
        assert (run_dir / "conversation.json").exists()
        
        # Check that PRD contains execution plan
        prd_content = (run_dir / "PRD.md").read_text()
        assert "Execution Plan" in prd_content
        
        # Check that mockup.json is valid JSON
        mockup_content = (run_dir / "mockup.json").read_text()
        mockup_data = json.loads(mockup_content)
        assert "product_name" in mockup_data
        assert "screens" in mockup_data
    
    @pytest.mark.asyncio
    async def test_mockup_designer_invalid_json(self, orchestrator, storage_service, mock_llm_client):
        """Test mockup designer with invalid JSON response."""
        # Mock LLM responses with invalid JSON
        mock_llm_client.generate.side_effect = [
            "Strategist response",
            "Architect response",
            "UX Writer response",
            "Invalid JSON response",  # Mockup designer returns non-JSON
            "# Test PRD"
        ]
        
        # Create a run
        run = storage_service.create_run("Test product idea")
        
        # Run agents
        result = await orchestrator.run_agents(run.id)
        
        # Check that run was completed
        assert result.status == RunStatus.COMPLETED
        
        # Check that mockup.json was saved as text
        run_dir = Path(storage_service.runs_dir) / run.id
        assert (run_dir / "mockup.json").exists()
        
        mockup_content = (run_dir / "mockup.json").read_text()
        assert mockup_content == "Invalid JSON response"


def test_api_endpoints():
    """Test that API endpoints are properly configured."""
    # This is a placeholder for actual API endpoint tests
    # In a real test suite, we would use TestClient to test FastAPI endpoints
    pass


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
