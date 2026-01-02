"""LLM client for AutoGen integration."""

import asyncio
import json
from typing import Dict, List, Optional, Any
import structlog
from enum import Enum

from backend.app.core.config import settings

logger = structlog.get_logger()

class LLMType(str, Enum):
    """Type of LLM to use."""
    STUB = "stub"
    OPENAI = "openai"
    AUTOGEN = "autogen"

class LLMClient:
    """Base LLM client interface."""
    
    def __init__(self, llm_type: LLMType = LLMType.STUB, seed: int = 42):
        self.llm_type = llm_type
        self.seed = seed
    
    async def generate(self, prompt: str, agent_name: str, **kwargs) -> str:
        """Generate a response."""
        raise NotImplementedError

class StubLLMClient(LLMClient):
    """Stub LLM client for testing without real API calls."""
    
    def __init__(self, seed: int = 42):
        super().__init__(LLMType.STUB, seed)
    
    async def generate(self, prompt: str, agent_name: str, **kwargs) -> str:
        """Generate a response using stub data."""
        logger.debug("Stub LLM generating response", agent_name=agent_name, prompt_length=len(prompt))
        
        # Simulate processing time
        await asyncio.sleep(0.5)
        
        # Import here to avoid circular imports
        from core.prompts import get_stub_response
        
        # Return stub response based on agent
        response = get_stub_response(agent_name)
        
        # Apply keyword replacement
        return self._apply_keyword_replacement(response, prompt)
    
    def _apply_keyword_replacement(self, response: str, prompt: str) -> str:
        """Apply keyword replacement to stub response based on prompt content."""
        # Check for fitness-related keywords
        if any(keyword in prompt.lower() for keyword in ["fitness", "workout", "exercise", "gym"]):
            response = response.replace("[problem domain]", "fitness tracking")
            response = response.replace("[main use case]", "workout planning")
            response = response.replace("[item]", "workout")
            response = response.replace("[Item]", "Workout")
            response = response.replace("[Product]", "Fitness Tracker")
            response = response.replace("[Product Name]", "Fitness Tracker")
        # Check for finance-related keywords
        elif any(keyword in prompt.lower() for keyword in ["finance", "budget", "money", "investment", "banking"]):
            response = response.replace("[problem domain]", "personal finance management")
            response = response.replace("[main use case]", "budget tracking")
            response = response.replace("[item]", "transaction")
            response = response.replace("[Item]", "Transaction")
            response = response.replace("[Product]", "Finance Manager")
            response = response.replace("[Product Name]", "Finance Manager")
        # Check for meditation-related keywords
        elif any(keyword in prompt.lower() for keyword in ["meditation", "mindfulness", "relax", "stress", "mental"]):
            response = response.replace("[problem domain]", "stress management and mental wellness")
            response = response.replace("[main use case]", "meditation practice")
            response = response.replace("[item]", "meditation session")
            response = response.replace("[Item]", "Meditation Session")
            response = response.replace("[Product]", "Mindfulness App")
            response = response.replace("[Product Name]", "Mindfulness App")
        # Check for productivity-related keywords
        elif any(keyword in prompt.lower() for keyword in ["productivity", "task", "todo", "schedule", "project", "team"]):
            response = response.replace("[problem domain]", "task management and productivity")
            response = response.replace("[main use case]", "task organization")
            response = response.replace("[item]", "task")
            response = response.replace("[Item]", "Task")
            response = response.replace("[Product]", "Productivity Manager")
            response = response.replace("[Product Name]", "Productivity Manager")
        # Default generic replacement
        else:
            response = response.replace("[problem domain]", "the problem domain")
            response = response.replace("[main use case]", "the main use case")
            response = response.replace("[item]", "item")
            response = response.replace("[Item]", "Item")
            response = response.replace("[Product]", "Product")
            response = response.replace("[Product Name]", "Product Name")
        
        return response

class AutoGenLLMClient(LLMClient):
    """AutoGen LLM client for real OpenAI API calls."""
    
    def __init__(self, seed: int = 42):
        super().__init__(LLMType.OPENAI, seed)
        self._client = None
        self._config_list = None
        
        # Check if AutoGen is available
        try:
            import autogen
            self._autogen_available = True
        except ImportError:
            self._autogen_available = False
            raise ImportError(
                "AutoGen is not installed. Install with: pip install pyautogen"
            )
    
    def _initialize_autogen(self):
        """Initialize AutoGen client."""
        if not self._autogen_available:
            raise ImportError("AutoGen is not available")
        
        import autogen
        
        # Create config list for OpenAI
        self._config_list = [
            {
                "model": settings.openai_model,
                "api_key": settings.openai_api_key,
                "base_url": settings.openai_base_url,
            }
        ]
        
        # Configure LLM
        llm_config = {
            "config_list": self._config_list,
            "seed": self.seed,
            "temperature": 0.7,
            "timeout": 120,
        }
        
        return autogen.AssistantAgent, autogen.UserProxyAgent, llm_config
    
    async def generate(self, prompt: str, agent_name: str, **kwargs) -> str:
        """Generate a response using AutoGen with OpenAI."""
        logger.debug("AutoGen LLM generating response", agent_name=agent_name, prompt_length=len(prompt))
        
        try:
            # Initialize AutoGen
            AssistantAgent, UserProxyAgent, llm_config = self._initialize_autogen()
            
            # Create agent based on role
            agent_config = {
                "name": agent_name,
                "system_message": f"You are a {agent_name}. {prompt}",
                "llm_config": llm_config,
            }
            
            agent = AssistantAgent(**agent_config)
            
            # Create user proxy agent
            user_proxy = UserProxyAgent(
                name="user_proxy",
                human_input_mode="NEVER",
                max_consecutive_auto_reply=1,
                code_execution_config=False,
            )
            
            # Start conversation
            user_proxy.initiate_chat(
                agent,
                message="Please provide your analysis based on your role and the system message.",
                clear_history=True,
            )
            
            # Get the last message from the agent
            if agent.chat_messages and user_proxy.name in agent.chat_messages:
                messages = agent.chat_messages[user_proxy.name]
                if messages:
                    # Return the last message content
                    return messages[-1]["content"]
            
            # If we get here, fall back to stub
            logger.warning("AutoGen agent returned no response, falling back to stub")
            from core.prompts import get_stub_response
            response = get_stub_response(agent_name)
            # Apply keyword replacement like StubLLMClient does
            return self._apply_keyword_replacement(response, prompt)
            
        except Exception as e:
            logger.error("AutoGen LLM generation failed, falling back to stub", agent_name=agent_name, error=str(e))
            # Fall back to stub response
            from core.prompts import get_stub_response
            response = get_stub_response(agent_name)
            # Apply keyword replacement like StubLLMClient does
            return self._apply_keyword_replacement(response, prompt)
    
    def _apply_keyword_replacement(self, response: str, prompt: str) -> str:
        """Apply keyword replacement to stub response based on prompt content."""
        # Check for fitness-related keywords
        if any(keyword in prompt.lower() for keyword in ["fitness", "workout", "exercise", "gym"]):
            response = response.replace("[problem domain]", "fitness tracking")
            response = response.replace("[main use case]", "workout planning")
            response = response.replace("[item]", "workout")
            response = response.replace("[Item]", "Workout")
            response = response.replace("[Product]", "Fitness Tracker")
            response = response.replace("[Product Name]", "Fitness Tracker")
        # Check for finance-related keywords
        elif any(keyword in prompt.lower() for keyword in ["finance", "budget", "money", "investment", "banking"]):
            response = response.replace("[problem domain]", "personal finance management")
            response = response.replace("[main use case]", "budget tracking")
            response = response.replace("[item]", "transaction")
            response = response.replace("[Item]", "Transaction")
            response = response.replace("[Product]", "Finance Manager")
            response = response.replace("[Product Name]", "Finance Manager")
        # Check for meditation-related keywords
        elif any(keyword in prompt.lower() for keyword in ["meditation", "mindfulness", "relax", "stress", "mental"]):
            response = response.replace("[problem domain]", "stress management and mental wellness")
            response = response.replace("[main use case]", "meditation practice")
            response = response.replace("[item]", "meditation session")
            response = response.replace("[Item]", "Meditation Session")
            response = response.replace("[Product]", "Mindfulness App")
            response = response.replace("[Product Name]", "Mindfulness App")
        # Check for productivity-related keywords
        elif any(keyword in prompt.lower() for keyword in ["productivity", "task", "todo", "schedule", "project", "team"]):
            response = response.replace("[problem domain]", "task management and productivity")
            response = response.replace("[main use case]", "task organization")
            response = response.replace("[item]", "task")
            response = response.replace("[Item]", "Task")
            response = response.replace("[Product]", "Productivity Manager")
            response = response.replace("[Product Name]", "Productivity Manager")
        # Default generic replacement
        else:
            response = response.replace("[problem domain]", "the problem domain")
            response = response.replace("[main use case]", "the main use case")
            response = response.replace("[item]", "item")
            response = response.replace("[Item]", "Item")
            response = response.replace("[Product]", "Product")
            response = response.replace("[Product Name]", "Product Name")
        
        return response

def get_llm_client() -> LLMClient:
    """Get appropriate LLM client based on configuration."""
    # Check if OpenAI API key is provided
    if settings.openai_api_key and settings.openai_api_key != "your_openai_api_key_here":
        try:
            # Try to create AutoGen client
            client = AutoGenLLMClient(seed=settings.agent_seed)
            logger.info("Using AutoGen LLM client with OpenAI")
            return client
        except ImportError:
            logger.warning("AutoGen not installed, falling back to stub LLM")
        except Exception as e:
            logger.warning(f"Failed to initialize AutoGen: {e}, falling back to stub LLM")
    
    # Fall back to stub
    logger.info("Using stub LLM client (no OpenAI API key or AutoGen unavailable)")
    return StubLLMClient(seed=settings.agent_seed)

# Global LLM client instance
llm_client = get_llm_client()
