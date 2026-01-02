"""Agent orchestration for the AI Product Manager."""

import asyncio
import json
from typing import Dict, List, Optional, Any
import structlog
from datetime import datetime

from core.models import Run, RunStatus, AgentRole, Message
from core.prompts import get_agent_prompt, get_prd_template
from core.llm_client import get_llm_client, LLMClient
from backend.services import storage, pdf_generator
from backend.app.core.config import settings

logger = structlog.get_logger()

class Orchestrator:
    """Orchestrates the 4-agent workflow."""
    
    def __init__(self, llm_client: Optional[LLMClient] = None):
        self.llm_client = llm_client or get_llm_client()
        self.storage = storage
    
    async def run_agents(self, run_id: str) -> Run:
        """Run the 5-agent workflow for a given run."""
        logger.info("Starting agent workflow", run_id=run_id)
        
        # Get the run
        run = self.storage.get_run(run_id)
        if not run:
            raise ValueError(f"Run not found: {run_id}")
        
        # Update status to running
        run.update_status(RunStatus.RUNNING)
        self.storage.update_run(run)
        
        try:
            # Step 1: Strategist
            await self._run_strategist(run)
            
            # Step 2: Architect
            await self._run_architect(run)
            
            # Step 3: UX Writer
            await self._run_ux_writer(run)
            
            # Step 4: Mockup Designer
            await self._run_mockup_designer(run)
            
            # Step 5: PRD Synthesizer
            await self._run_synthesizer(run)
            
            # Update status to completed
            run.update_status(RunStatus.COMPLETED)
            self.storage.update_run(run)
            
            # Save conversation as artifact
            self._save_conversation_artifact(run)
            
            logger.info("Agent workflow completed", run_id=run_id)
            return run
            
        except Exception as e:
            logger.error("Agent workflow failed", run_id=run_id, error=str(e))
            run.update_status(RunStatus.FAILED)
            self.storage.update_run(run)
            raise
    
    async def _run_strategist(self, run: Run):
        """Run the strategist agent."""
        logger.debug("Running strategist agent", run_id=run.id)
        
        # Create prompt
        prompt = get_agent_prompt(
            "strategist",
            idea=run.idea,
            max_questions=settings.max_strategist_questions
        )
        
        # Generate response
        response = await self.llm_client.generate(prompt, "strategist")
        
        # Add message to conversation
        run.add_message(
            role=AgentRole.STRATEGIST,
            content=response,
            step=1,
            metadata={"agent": "strategist", "prompt_length": len(prompt)}
        )
        
        # Update run
        self.storage.update_run(run)
    
    async def _run_architect(self, run: Run):
        """Run the architect agent."""
        logger.debug("Running architect agent", run_id=run.id)
        
        # Get strategist's analysis (last strategist message)
        strategist_messages = [m for m in run.messages if m.role == AgentRole.STRATEGIST]
        strategist_analysis = strategist_messages[-1].content if strategist_messages else ""
        
        # Create prompt
        prompt = get_agent_prompt(
            "architect",
            idea=run.idea,
            strategist_analysis=strategist_analysis,
            user_answers=json.dumps(run.user_answers)
        )
        
        # Generate response
        response = await self.llm_client.generate(prompt, "architect")
        
        # Add message to conversation
        run.add_message(
            role=AgentRole.ARCHITECT,
            content=response,
            step=2,
            metadata={"agent": "architect", "prompt_length": len(prompt)}
        )
        
        # Update run
        self.storage.update_run(run)
    
    async def _run_ux_writer(self, run: Run):
        """Run the UX writer agent."""
        logger.debug("Running UX writer agent", run_id=run.id)
        
        # Get architect's analysis (last architect message)
        architect_messages = [m for m in run.messages if m.role == AgentRole.ARCHITECT]
        architect_analysis = architect_messages[-1].content if architect_messages else ""
        
        # Create prompt
        prompt = get_agent_prompt(
            "ux_writer",
            idea=run.idea,
            architect_analysis=architect_analysis
        )
        
        # Generate response
        response = await self.llm_client.generate(prompt, "ux_writer")
        
        # Add message to conversation
        run.add_message(
            role=AgentRole.UX_WRITER,
            content=response,
            step=3,
            metadata={"agent": "ux_writer", "prompt_length": len(prompt)}
        )
        
        # Update run
        self.storage.update_run(run)
    
    async def _run_mockup_designer(self, run: Run):
        """Run the mockup designer agent."""
        logger.debug("Running mockup designer agent", run_id=run.id)
        
        # Get UX writer's analysis (last UX writer message)
        ux_writer_messages = [m for m in run.messages if m.role == AgentRole.UX_WRITER]
        ux_writer_analysis = ux_writer_messages[-1].content if ux_writer_messages else ""
        
        # Get architect's analysis (last architect message)
        architect_messages = [m for m in run.messages if m.role == AgentRole.ARCHITECT]
        architect_analysis = architect_messages[-1].content if architect_messages else ""
        
        # Create prompt
        prompt = get_agent_prompt(
            "mockup_designer",
            idea=run.idea,
            architect_analysis=architect_analysis,
            ux_writer_analysis=ux_writer_analysis
        )
        
        # Generate response
        response = await self.llm_client.generate(prompt, "mockup_designer")
        
        # Add message to conversation
        run.add_message(
            role=AgentRole.MOCKUP_DESIGNER,
            content=response,
            step=4,
            metadata={"agent": "mockup_designer", "prompt_length": len(prompt)}
        )
        
        # Save mockup.json as artifact
        try:
            # Try to parse as JSON to validate
            mockup_data = json.loads(response)
            self.storage.save_artifact(run.id, "mockup_json", json.dumps(mockup_data, indent=2))
        except json.JSONDecodeError:
            # If not valid JSON, save as text
            logger.warning("Mockup designer response is not valid JSON, saving as text", run_id=run.id)
            self.storage.save_artifact(run.id, "mockup_json", response)
        
        # Update run
        self.storage.update_run(run)
    
    async def _run_synthesizer(self, run: Run):
        """Run the PRD synthesizer agent."""
        logger.debug("Running PRD synthesizer agent", run_id=run.id)
        
        # Build conversation history
        conversation_history = self._format_conversation_history(run)
        
        # Get PRD template
        prd_template = get_prd_template()
        
        # Create prompt
        prompt = get_agent_prompt(
            "synthesizer",
            conversation_history=conversation_history,
            prd_template=prd_template
        )
        
        # Generate response
        response = await self.llm_client.generate(prompt, "synthesizer")
        
        # Add message to conversation
        run.add_message(
            role=AgentRole.SYNTHESIZER,
            content=response,
            step=5,
            metadata={"agent": "synthesizer", "prompt_length": len(prompt)}
        )
        
        # Save PRD as artifact
        self.storage.save_artifact(run.id, "prd_markdown", response)
        
        # Generate PDF from PRD
        self._generate_pdf(run, response)
        
        # Update run
        self.storage.update_run(run)
    
    def _format_conversation_history(self, run: Run) -> str:
        """Format conversation history for the synthesizer."""
        lines = []
        for i, message in enumerate(run.messages):
            lines.append(f"=== {message.role.value.upper()} (Step {message.step}) ===")
            lines.append(message.content)
            lines.append("")  # Empty line between messages
        
        return "\n".join(lines)
    
    def _generate_pdf(self, run: Run, prd_content: str):
        """Generate PDF from PRD content."""
        try:
            pdf_path = run.get_artifact_path("prd_pdf")
            if pdf_path:
                success = pdf_generator.generate_from_markdown(prd_content, pdf_path)
                if success:
                    logger.info("PDF generated successfully", run_id=run.id, pdf_path=pdf_path)
                else:
                    logger.warning("PDF generation failed or created placeholder", run_id=run.id)
        except Exception as e:
            logger.error("Failed to generate PDF", run_id=run.id, error=str(e))
    
    def _save_conversation_artifact(self, run: Run):
        """Save conversation as JSON artifact."""
        conversation_data = {
            "run_id": run.id,
            "idea": run.idea,
            "status": run.status.value,
            "created_at": run.created_at.isoformat(),
            "completed_at": run.completed_at.isoformat() if run.completed_at else None,
            "messages": [
                {
                    "id": msg.id,
                    "role": msg.role.value,
                    "content": msg.content,
                    "timestamp": msg.timestamp.isoformat(),
                    "step": msg.step,
                    "metadata": msg.metadata
                }
                for msg in run.messages
            ],
            "user_answers": run.user_answers,
            "assumptions": run.assumptions,
            "artifacts": run.artifacts
        }
        
        self.storage.save_artifact(
            run.id,
            "conversation",
            json.dumps(conversation_data, indent=2)
        )

# Global orchestrator instance
orchestrator = Orchestrator()
