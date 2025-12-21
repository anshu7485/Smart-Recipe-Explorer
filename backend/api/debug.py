"""
Vercel serverless function - Debug version
"""
from http.server import BaseHTTPRequestHandler
import json
import sys
import os
import traceback

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        try:
            # Add parent directory to path
            parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            sys.path.insert(0, parent_dir)
            
            # Try importing main
            from main import app
            
            response = {
                "status": "ok",
                "message": "FastAPI imported successfully!",
                "app_title": app.title
            }
        except Exception as e:
            response = {
                "status": "error",
                "message": str(e),
                "traceback": traceback.format_exc(),
                "sys_path": sys.path[:5]
            }
        
        self.wfile.write(json.dumps(response, indent=2).encode())
        return
