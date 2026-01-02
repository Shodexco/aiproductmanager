from pydantic import BaseModel, Field
from datetime import datetime
from typing import Dict, List, Optional, Any
from enum import Enum
from uuid import uuid4

class RunStatus(str, Enum):
    """Status of a run."""
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"

class AgentRole(str, Enum):
    """Roles of agents in the conversation."""
    STRATEGIST = "strategist"
    ARCHITECT = "architect"
    UX_WRITER = "ux_writer"
    MOCKUP_DESIGNER = "mockup_designer"
    SYNTHESIZER = "synthesizer"
    USER = "user"
    SYSTEM = "system"

class Message(BaseModel):
    """A message in the conversation."""
    id: str = Field(default_factory=lambda: str(uuid4()))
    role: AgentRole
    content: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    step: int = 0
    metadata: Dict[str, Any] = Field(default_factory=dict)

class Run(BaseModel):
    """A run representing a product idea through the agent workflow."""
    id: str = Field(default_factory=lambda: str(uuid4()))
    idea: str
    status: RunStatus = RunStatus.PENDING
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None
    
    # Agent conversation
    messages: List[Message] = Field(default_factory=list)
    
    # User answers to strategist questions
    user_answers: Dict[str, str] = Field(default_factory=dict)
    
    # Assumptions made by agents
    assumptions: List[str] = Field(default_factory=list)
    
    # Artifact paths (relative to data directory)
    artifacts: Dict[str, str] = Field(default_factory=dict)
    
    # Metadata
    metadata: Dict[str, Any] = Field(default_factory=dict)
    
    def add_message(self, role: AgentRole, content: str, step: int = 0, metadata: Optional[Dict] = None) -> Message:
        """Add a message to the conversation."""
        message = Message(
            role=role,
            content=content,
            step=step,
            metadata=metadata or {}
        )
        self.messages.append(message)
        self.updated_at = datetime.utcnow()
        return message
    
    def update_status(self, status: RunStatus):
        """Update the run status."""
        self.status = status
        self.updated_at = datetime.utcnow()
        if status == RunStatus.COMPLETED:
            self.completed_at = datetime.utcnow()
    
    def get_artifact_path(self, artifact_type: str) -> str:
        """Get the path for an artifact type."""
        return self.artifacts.get(artifact_type, "")
    
    def set_artifact_path(self, artifact_type: str, path: str):
        """Set the path for an artifact type."""
        self.artifacts[artifact_type] = path
        self.updated_at = datetime.utcnow()
