"""
Vercel serverless function entry point - Working version
"""
import sys
import os

# Setup path
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

# Import FastAPI app directly
from main import app

# Mangum wrapper for AWS Lambda/Vercel compatibility
from mangum import Mangum

# Create handler
handler = Mangum(app, lifespan="off")

# Export both for compatibility
__all__ = ['app', 'handler']
