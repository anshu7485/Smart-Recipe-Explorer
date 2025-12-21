"""
Data models for Recipe Explorer application.
Defines Pydantic models for request/response validation and MongoDB documents.
"""
from pydantic import BaseModel, Field, validator
from typing import List, Optional
from datetime import datetime


class RecipeBase(BaseModel):
    """Base recipe model with common fields."""
    name: str = Field(..., min_length=1, max_length=200, description="Recipe name")
    cuisine: str = Field(..., min_length=1, max_length=100, description="Cuisine type")
    is_vegetarian: bool = Field(default=True, description="Vegetarian flag")
    prep_time_minutes: int = Field(..., gt=0, description="Preparation time in minutes")
    ingredients: List[str] = Field(..., min_items=1, description="List of ingredients")
    difficulty: str = Field(..., description="Difficulty level")
    instructions: str = Field(..., min_length=10, description="Cooking instructions")
    tags: List[str] = Field(default=[], description="Recipe tags")
    
    @validator('difficulty')
    def validate_difficulty(cls, v):
        """Validate difficulty level."""
        allowed = ['easy', 'medium', 'hard']
        if v.lower() not in allowed:
            raise ValueError(f'Difficulty must be one of: {", ".join(allowed)}')
        return v.lower()
    
    @validator('ingredients')
    def validate_ingredients(cls, v):
        """Ensure ingredients are not empty strings."""
        if any(not ingredient.strip() for ingredient in v):
            raise ValueError('Ingredients cannot be empty strings')
        return [ingredient.strip().lower() for ingredient in v]
    
    @validator('tags')
    def validate_tags(cls, v):
        """Normalize tags to lowercase."""
        return [tag.strip().lower() for tag in v if tag.strip()]


class RecipeCreate(RecipeBase):
    """Model for creating a new recipe."""
    pass


class RecipeUpdate(BaseModel):
    """Model for updating an existing recipe (all fields optional)."""
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    cuisine: Optional[str] = Field(None, min_length=1, max_length=100)
    is_vegetarian: Optional[bool] = None
    prep_time_minutes: Optional[int] = Field(None, gt=0)
    ingredients: Optional[List[str]] = Field(None, min_items=1)
    difficulty: Optional[str] = None
    instructions: Optional[str] = Field(None, min_length=10)
    tags: Optional[List[str]] = None


class RecipeResponse(RecipeBase):
    """Model for recipe API responses."""
    id: str = Field(..., alias="_id", description="Recipe ID")
    created_at: datetime = Field(..., description="Creation timestamp")
    updated_at: datetime = Field(..., description="Last update timestamp")
    
    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "_id": "rec_101",
                "name": "Paneer Butter Masala",
                "cuisine": "Indian",
                "is_vegetarian": True,
                "prep_time_minutes": 40,
                "ingredients": ["paneer", "tomato", "cream", "butter", "spices"],
                "difficulty": "medium",
                "instructions": "Step 1: Heat butter... Step 2: Add tomatoes...",
                "tags": ["dinner", "party", "rich"],
                "created_at": "2025-12-19T10:00:00",
                "updated_at": "2025-12-19T10:00:00"
            }
        }


class RecipeSearchFilters(BaseModel):
    """Model for recipe search filters."""
    cuisine: Optional[str] = None
    is_vegetarian: Optional[bool] = None
    max_prep_time: Optional[int] = Field(None, gt=0, description="Maximum prep time in minutes")
    difficulty: Optional[str] = None
    tags: Optional[List[str]] = None
    ingredients: Optional[List[str]] = None
    search_query: Optional[str] = Field(None, description="Search in name or ingredients")


class AIRecipeSuggestionRequest(BaseModel):
    """Request model for AI recipe suggestions."""
    ingredients: List[str] = Field(..., min_items=1, description="Available ingredients")
    
    @validator('ingredients')
    def validate_ingredients(cls, v):
        """Ensure ingredients are not empty strings."""
        if any(not ingredient.strip() for ingredient in v):
            raise ValueError('Ingredients cannot be empty strings')
        return [ingredient.strip().lower() for ingredient in v]


class AIRecipeSimplifyRequest(BaseModel):
    """Request model for AI recipe simplification."""
    recipe_id: str = Field(..., description="Recipe ID to simplify")


class AIResponse(BaseModel):
    """Response model for AI operations."""
    success: bool = Field(..., description="Operation success status")
    data: Optional[str] = Field(None, description="AI generated response")
    error: Optional[str] = Field(None, description="Error message if any")
