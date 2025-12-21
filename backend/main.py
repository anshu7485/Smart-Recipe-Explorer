"""
Main FastAPI application - Serverless compatible version for Vercel.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum
import logging
import os

from config import settings
from routes import recipe_routes, ai_routes

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create FastAPI application WITHOUT lifespan for serverless
app = FastAPI(
    title="Recipe Explorer API",
    description="Smart Recipe Management with AI Features",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.get_cors_origins_list(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(recipe_routes.router)
app.include_router(ai_routes.router)


@app.get("/", tags=["Health"])
async def root():
    """Root endpoint - API health check."""
    return {
        "status": "healthy",
        "message": "Recipe Explorer API is running",
        "version": "1.0.0",
        "docs": "/api/docs"
    }


@app.get("/health", tags=["Health"])
async def health_simple():
    """Simple health check without dependencies."""
    return {
        "status": "ok",
        "service": "Recipe Explorer API",
        "version": "1.0.0"
    }


@app.get("/api/health", tags=["Health"])
async def health_check():
    """Simplified health check for serverless."""
    return {
        "status": "healthy",
        "message": "API is running",
        "version": "1.0.0"
    }


# Vercel serverless function handler with Mangum
handler = Mangum(app, lifespan="off")

if __name__ == "__main__":
    import uvicorn
    from database import Database
    
    # Only for local development
    logger.info(f"Starting server on {settings.api_host}:{settings.api_port}")
    uvicorn.run(
        "main:app",
        host=settings.api_host,
        port=settings.api_port,
        reload=True
    )
