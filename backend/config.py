"""
Configuration module for the Recipe Explorer application.
Manages environment variables and application settings.
"""
from pydantic_settings import BaseSettings
from typing import Optional
import os


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # MongoDB Configuration
    mongodb_url: str = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    database_name: str = os.getenv("DATABASE_NAME", "recipe_explorer")
    
    # Google Gemini API Configuration (Free tier)
    # Get your free API key from: https://makersuite.google.com/app/apikey
    gemini_api_key: Optional[str] = os.getenv("GEMINI_API_KEY")
    
    # Application Settings
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    
    # CORS Settings
    cors_origins: str = "*"
    
    class Config:
        env_file = ".env"
        case_sensitive = False
        extra = "allow"
    
    def get_cors_origins_list(self) -> list:
        """Parse CORS origins from comma-separated string."""
        if self.cors_origins == "*":
            return ["*"]
        return [origin.strip() for origin in self.cors_origins.split(",")]


# Global settings instance
settings = Settings()
