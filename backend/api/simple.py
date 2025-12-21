"""
FastAPI for Vercel with full routes
"""
import sys
import os

# Add parent to path
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import routes
from routes import recipe_routes, ai_routes

# Create app
app = FastAPI(title="Recipe Explorer API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(recipe_routes.router)
app.include_router(ai_routes.router)

@app.get("/")
async def root():
    return {"status": "ok", "message": "Recipe Explorer API", "version": "1.0.0"}

@app.get("/health")
async def health():
    return {"status": "healthy", "message": "API is running"}

@app.get("/api/health")
async def api_health():
    return {"status": "healthy", "version": "1.0.0"}
