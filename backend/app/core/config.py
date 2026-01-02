from pydantic_settings import BaseSettings
from typing import Optional
import os

class Settings(BaseSettings):
    """Application settings."""
    
    # OpenAI Configuration
    openai_api_key: str = "your_openai_api_key_here"
    openai_model: str = "gpt-4-turbo-preview"
    openai_base_url: str = "https://api.openai.com/v1"
    
    # Application Configuration
    environment: str = "development"
    log_level: str = "INFO"
    secret_key: str = "your-secret-key-change-in-production"
    data_dir: str = "./data"
    
    # Redis Configuration
    redis_url: str = "redis://redis:6379"
    
    # PDF Generation
    pdf_generator: str = "reportlab"  # Options: reportlab, weasyprint, html
    
    # Agent Configuration
    agent_seed: int = 42
    max_strategist_questions: int = 5
    prd_template_path: str = "./core/prompts/templates.py"
    
    class Config:
        env_file = ".env"
        case_sensitive = False

# Global settings instance
settings = Settings()
