"""
Unit tests for Recipe API endpoints.
Run with: pytest tests/test_recipe_api.py
"""
import pytest
from httpx import AsyncClient
from main import app


@pytest.mark.asyncio
async def test_root_endpoint():
    """Test root endpoint returns healthy status."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "Recipe Explorer API" in data["message"]


@pytest.mark.asyncio
async def test_health_endpoint():
    """Test health check endpoint."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/api/health")
        assert response.status_code == 200
        data = response.json()
        assert "status" in data
        assert "database" in data


@pytest.mark.asyncio
async def test_create_recipe():
    """Test creating a new recipe."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        recipe_data = {
            "name": "Test Recipe",
            "cuisine": "Test Cuisine",
            "is_vegetarian": True,
            "prep_time_minutes": 30,
            "ingredients": ["ingredient1", "ingredient2"],
            "difficulty": "easy",
            "instructions": "Test instructions for the recipe",
            "tags": ["test", "sample"]
        }
        
        response = await client.post("/api/recipes/", json=recipe_data)
        assert response.status_code == 201
        data = response.json()
        assert data["name"] == "Test Recipe"
        assert data["cuisine"] == "Test Cuisine"
        assert "_id" in data


@pytest.mark.asyncio
async def test_get_all_recipes():
    """Test getting all recipes."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/api/recipes/")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)


@pytest.mark.asyncio
async def test_search_recipes():
    """Test recipe search functionality."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        search_data = {
            "cuisine": "Indian",
            "is_vegetarian": True
        }
        
        response = await client.post("/api/recipes/search", json=search_data)
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)


@pytest.mark.asyncio
async def test_invalid_recipe_creation():
    """Test that invalid recipe data is rejected."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        invalid_recipe = {
            "name": "Test",
            "cuisine": "Test",
            # Missing required fields
        }
        
        response = await client.post("/api/recipes/", json=invalid_recipe)
        assert response.status_code == 422  # Validation error


@pytest.mark.asyncio
async def test_get_nonexistent_recipe():
    """Test getting a recipe that doesn't exist."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/api/recipes/nonexistent_id")
        assert response.status_code == 404


@pytest.mark.asyncio
async def test_ai_health_check():
    """Test AI service health check."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/api/ai/health")
        assert response.status_code == 200
        data = response.json()
        assert "configured" in data
        assert "service" in data
