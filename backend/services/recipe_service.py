"""
Recipe service layer.
Handles business logic for recipe CRUD operations and search/filter functionality.
"""
from motor.motor_asyncio import AsyncIOMotorDatabase
from models import RecipeCreate, RecipeUpdate, RecipeSearchFilters
from typing import List, Optional, Dict, Any
from datetime import datetime
from bson import ObjectId
import logging

logger = logging.getLogger(__name__)


class RecipeService:
    """Service class for recipe operations."""
    
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.collection = db.recipes
    
    async def create_recipe(self, recipe_data: RecipeCreate) -> Dict[str, Any]:
        """Create a new recipe."""
        try:
            recipe_dict = recipe_data.model_dump()
            recipe_dict["created_at"] = datetime.utcnow()
            recipe_dict["updated_at"] = datetime.utcnow()
            
            result = await self.collection.insert_one(recipe_dict)
            
            created_recipe = await self.collection.find_one({"_id": result.inserted_id})
            created_recipe["_id"] = str(created_recipe["_id"])
            
            logger.info(f"Created recipe: {created_recipe['name']}")
            return created_recipe
        except Exception as e:
            logger.error(f"Error creating recipe: {e}")
            raise
    
    async def get_recipe_by_id(self, recipe_id: str) -> Optional[Dict[str, Any]]:
        """Get a recipe by ID."""
        try:
            if not ObjectId.is_valid(recipe_id):
                # Try to find by custom ID
                recipe = await self.collection.find_one({"_id": recipe_id})
            else:
                recipe = await self.collection.find_one({"_id": ObjectId(recipe_id)})
            
            if recipe:
                recipe["_id"] = str(recipe["_id"])
            
            return recipe
        except Exception as e:
            logger.error(f"Error getting recipe by ID: {e}")
            raise
    
    async def get_all_recipes(self, skip: int = 0, limit: int = 100) -> List[Dict[str, Any]]:
        """Get all recipes with pagination."""
        try:
            cursor = self.collection.find().skip(skip).limit(limit)
            recipes = await cursor.to_list(length=limit)
            
            for recipe in recipes:
                recipe["_id"] = str(recipe["_id"])
            
            return recipes
        except Exception as e:
            logger.error(f"Error getting all recipes: {e}")
            raise
    
    async def update_recipe(self, recipe_id: str, recipe_data: RecipeUpdate) -> Optional[Dict[str, Any]]:
        """Update a recipe."""
        try:
            # Get update data excluding None values
            update_dict = {k: v for k, v in recipe_data.model_dump().items() if v is not None}
            
            if not update_dict:
                return await self.get_recipe_by_id(recipe_id)
            
            update_dict["updated_at"] = datetime.utcnow()
            
            # Try ObjectId first, then custom ID
            if ObjectId.is_valid(recipe_id):
                result = await self.collection.update_one(
                    {"_id": ObjectId(recipe_id)},
                    {"$set": update_dict}
                )
            else:
                result = await self.collection.update_one(
                    {"_id": recipe_id},
                    {"$set": update_dict}
                )
            
            if result.matched_count == 0:
                return None
            
            return await self.get_recipe_by_id(recipe_id)
        except Exception as e:
            logger.error(f"Error updating recipe: {e}")
            raise
    
    async def delete_recipe(self, recipe_id: str) -> bool:
        """Delete a recipe."""
        try:
            if ObjectId.is_valid(recipe_id):
                result = await self.collection.delete_one({"_id": ObjectId(recipe_id)})
            else:
                result = await self.collection.delete_one({"_id": recipe_id})
            
            return result.deleted_count > 0
        except Exception as e:
            logger.error(f"Error deleting recipe: {e}")
            raise
    
    async def search_recipes(self, filters: RecipeSearchFilters) -> List[Dict[str, Any]]:
        """Search recipes with filters."""
        try:
            query = {}
            
            # Filter by cuisine
            if filters.cuisine:
                query["cuisine"] = {"$regex": filters.cuisine, "$options": "i"}
            
            # Filter by vegetarian
            if filters.is_vegetarian is not None:
                query["is_vegetarian"] = filters.is_vegetarian
            
            # Filter by max prep time
            if filters.max_prep_time:
                query["prep_time_minutes"] = {"$lte": filters.max_prep_time}
            
            # Filter by difficulty
            if filters.difficulty:
                query["difficulty"] = filters.difficulty.lower()
            
            # Filter by tags
            if filters.tags:
                query["tags"] = {"$in": [tag.lower() for tag in filters.tags]}
            
            # Filter by ingredients
            if filters.ingredients:
                query["ingredients"] = {"$all": [ing.lower() for ing in filters.ingredients]}
            
            # Search query in name or ingredients
            if filters.search_query:
                query["$or"] = [
                    {"name": {"$regex": filters.search_query, "$options": "i"}},
                    {"ingredients": {"$regex": filters.search_query, "$options": "i"}}
                ]
            
            cursor = self.collection.find(query)
            recipes = await cursor.to_list(length=100)
            
            for recipe in recipes:
                recipe["_id"] = str(recipe["_id"])
            
            logger.info(f"Search found {len(recipes)} recipes")
            return recipes
        except Exception as e:
            logger.error(f"Error searching recipes: {e}")
            raise
    
    async def get_recipes_count(self) -> int:
        """Get total count of recipes."""
        try:
            count = await self.collection.count_documents({})
            return count
        except Exception as e:
            logger.error(f"Error getting recipe count: {e}")
            raise
