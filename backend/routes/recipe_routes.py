"""
Recipe API routes.
Handles all recipe-related endpoints including CRUD and search operations.
"""
from fastapi import APIRouter, HTTPException, status, Depends
from models import RecipeCreate, RecipeUpdate, RecipeResponse, RecipeSearchFilters
from services.recipe_service import RecipeService
from database import get_db
from typing import List

router = APIRouter(prefix="/api/recipes", tags=["Recipes"])


async def get_recipe_service(db=Depends(get_db)) -> RecipeService:
    """Dependency to get recipe service instance."""
    return RecipeService(db)


@router.post("/", response_model=RecipeResponse, status_code=status.HTTP_201_CREATED)
async def create_recipe(
    recipe: RecipeCreate,
    service: RecipeService = Depends(get_recipe_service)
):
    """
    Create a new recipe.
    
    - **name**: Recipe name (required)
    - **cuisine**: Cuisine type (required)
    - **is_vegetarian**: Vegetarian flag (default: true)
    - **prep_time_minutes**: Preparation time in minutes (required)
    - **ingredients**: List of ingredients (required)
    - **difficulty**: Difficulty level - easy/medium/hard (required)
    - **instructions**: Cooking instructions (required)
    - **tags**: List of tags (optional)
    """
    try:
        created_recipe = await service.create_recipe(recipe)
        return created_recipe
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating recipe: {str(e)}"
        )


@router.get("/", response_model=List[RecipeResponse])
async def get_all_recipes(
    skip: int = 0,
    limit: int = 100,
    service: RecipeService = Depends(get_recipe_service)
):
    """
    Get all recipes with pagination.
    
    - **skip**: Number of recipes to skip (default: 0)
    - **limit**: Maximum number of recipes to return (default: 100)
    """
    try:
        recipes = await service.get_all_recipes(skip=skip, limit=limit)
        return recipes
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching recipes: {str(e)}"
        )


@router.get("/count")
async def get_recipes_count(service: RecipeService = Depends(get_recipe_service)):
    """Get total count of recipes in the database."""
    try:
        count = await service.get_recipes_count()
        return {"count": count}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error getting recipe count: {str(e)}"
        )


@router.get("/{recipe_id}", response_model=RecipeResponse)
async def get_recipe(
    recipe_id: str,
    service: RecipeService = Depends(get_recipe_service)
):
    """
    Get a specific recipe by ID.
    
    - **recipe_id**: Recipe ID
    """
    try:
        recipe = await service.get_recipe_by_id(recipe_id)
        if not recipe:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Recipe with ID '{recipe_id}' not found"
            )
        return recipe
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching recipe: {str(e)}"
        )


@router.put("/{recipe_id}", response_model=RecipeResponse)
async def update_recipe(
    recipe_id: str,
    recipe_update: RecipeUpdate,
    service: RecipeService = Depends(get_recipe_service)
):
    """
    Update an existing recipe.
    
    - **recipe_id**: Recipe ID
    - All fields are optional - only provided fields will be updated
    """
    try:
        updated_recipe = await service.update_recipe(recipe_id, recipe_update)
        if not updated_recipe:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Recipe with ID '{recipe_id}' not found"
            )
        return updated_recipe
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating recipe: {str(e)}"
        )


@router.delete("/{recipe_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_recipe(
    recipe_id: str,
    service: RecipeService = Depends(get_recipe_service)
):
    """
    Delete a recipe.
    
    - **recipe_id**: Recipe ID
    """
    try:
        deleted = await service.delete_recipe(recipe_id)
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Recipe with ID '{recipe_id}' not found"
            )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting recipe: {str(e)}"
        )


@router.post("/search", response_model=List[RecipeResponse])
async def search_recipes(
    filters: RecipeSearchFilters,
    service: RecipeService = Depends(get_recipe_service)
):
    """
    Search recipes with various filters.
    
    - **cuisine**: Filter by cuisine type
    - **is_vegetarian**: Filter by vegetarian flag
    - **max_prep_time**: Maximum preparation time in minutes
    - **difficulty**: Filter by difficulty level
    - **tags**: Filter by tags (recipes must have all provided tags)
    - **ingredients**: Filter by ingredients (recipes must have all provided ingredients)
    - **search_query**: Search in recipe name or ingredients
    
    All filters are optional and can be combined.
    """
    try:
        recipes = await service.search_recipes(filters)
        return recipes
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error searching recipes: {str(e)}"
        )
