"""
AI API routes.
Handles AI-powered recipe suggestions and simplification.
"""
from fastapi import APIRouter, HTTPException, status, Depends
from models import AIRecipeSuggestionRequest, AIRecipeSimplifyRequest, AIResponse
from services.ai_service import AIService
from services.recipe_service import RecipeService
from database import get_db

router = APIRouter(prefix="/api/ai", tags=["AI Features"])


async def get_ai_service() -> AIService:
    """Dependency to get AI service instance."""
    return AIService()


async def get_recipe_service(db=Depends(get_db)) -> RecipeService:
    """Dependency to get recipe service instance."""
    return RecipeService(db)


@router.post("/suggest-recipe", response_model=AIResponse)
async def suggest_recipe(
    request: AIRecipeSuggestionRequest,
    ai_service: AIService = Depends(get_ai_service)
):
    """
    Get AI-powered recipe suggestions based on available ingredients.
    
    - **ingredients**: List of available ingredients
    
    Returns a recipe suggestion with name, description, and simple steps.
    """
    try:
        suggestion = await ai_service.suggest_recipe(request.ingredients)
        
        if suggestion:
            return AIResponse(
                success=True,
                data=suggestion,
                error=None
            )
        else:
            return AIResponse(
                success=False,
                data=None,
                error="Failed to generate recipe suggestion. Please try again."
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating recipe suggestion: {str(e)}"
        )


@router.post("/simplify-recipe", response_model=AIResponse)
async def simplify_recipe(
    request: AIRecipeSimplifyRequest,
    ai_service: AIService = Depends(get_ai_service),
    recipe_service: RecipeService = Depends(get_recipe_service)
):
    """
    Get AI-powered simplified version of a recipe for beginners.
    
    - **recipe_id**: ID of the recipe to simplify
    
    Returns beginner-friendly instructions with helpful tips.
    """
    try:
        # Get the recipe from database
        recipe = await recipe_service.get_recipe_by_id(request.recipe_id)
        
        if not recipe:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Recipe with ID '{request.recipe_id}' not found"
            )
        
        # Simplify the recipe using AI
        simplified = await ai_service.simplify_recipe(
            recipe["name"],
            recipe["instructions"]
        )
        
        if simplified:
            return AIResponse(
                success=True,
                data=simplified,
                error=None
            )
        else:
            return AIResponse(
                success=False,
                data=None,
                error="Failed to simplify recipe. Please try again."
            )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error simplifying recipe: {str(e)}"
        )


@router.get("/health")
async def ai_health_check(ai_service: AIService = Depends(get_ai_service)):
    """
    Check if AI service is properly configured.
    
    Returns the configuration status of the Google Gemini API.
    """
    has_api_key = bool(ai_service.api_key)
    is_available = ai_service.api_available
    
    return {
        "configured": has_api_key,
        "available": is_available,
        "service": "Google Gemini API",
        "model": "gemini-2.5-flash",
        "free_tier": "60 requests/minute",
        "get_key_from": "https://makersuite.google.com/app/apikey",
        "message": "✅ AI service is configured and ready" if is_available else "⚠️ AI service will use fallback responses. Configure GEMINI_API_KEY in .env for full AI functionality."
    }
