"""
OPTIONAL SCRIPT: Sample recipe data for TESTING purposes only.

⚠️  IMPORTANT: This script is NOT required for the assignment!
    
Assignment Requirements State:
✅ Recipes are managed through the FRONTEND interface
✅ Users create/add recipes via the web UI
✅ No automatic dummy data population required

This Script Purpose:
- ONLY for quick testing without using frontend
- ONLY for demo/development purposes
- NOT part of the core application

Usage (Optional):
    python populate_data.py

Normal Operation:
- Start backend server
- Use frontend to add recipes
- Recipes are stored in MongoDB
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timezone
from config import settings

# Sample recipes for TESTING ONLY (matching assignment requirements)
SAMPLE_RECIPES = [
    {
        "name": "Paneer Butter Masala",
        "cuisine": "Indian",
        "is_vegetarian": True,
        "prep_time_minutes": 40,
        "ingredients": ["paneer", "tomato", "cream", "butter", "spices"],
        "difficulty": "medium",
        "instructions": "Step 1: Heat butter in a pan, add chopped onions and cook until golden. Step 2: Add tomato puree, cook for 10 minutes. Step 3: Add cream, spices and paneer cubes. Step 4: Simmer for 5 minutes and serve hot.",
        "tags": ["dinner", "party", "rich"]
    },
    {
        "name": "Chicken Biryani",
        "cuisine": "Indian",
        "is_vegetarian": False,
        "prep_time_minutes": 90,
        "ingredients": ["chicken", "rice", "yogurt", "onion", "spices"],
        "difficulty": "hard",
        "instructions": "Step 1: Marinate chicken with yogurt and spices. Step 2: Cook rice separately until 70% done. Step 3: Layer chicken and rice in a pot. Step 4: Cook on low heat for 25 minutes. Step 5: Serve hot with raita.",
        "tags": ["lunch", "dinner", "special"]
    },
    {
        "name": "Aloo Gobi",
        "cuisine": "Indian",
        "is_vegetarian": True,
        "prep_time_minutes": 30,
        "ingredients": ["potato", "cauliflower", "onion", "tomato", "spices"],
        "difficulty": "easy",
        "instructions": "Step 1: Cut potatoes and cauliflower into pieces. Step 2: Heat oil, add cumin seeds. Step 3: Add onions, ginger and tomatoes. Step 4: Add vegetables and spices. Step 5: Cook covered for 20 minutes.",
        "tags": ["lunch", "dinner", "simple"]
    },
    {
        "name": "Pasta Aglio e Olio",
        "cuisine": "Italian",
        "is_vegetarian": True,
        "prep_time_minutes": 20,
        "ingredients": ["pasta", "garlic", "olive oil", "chili flakes", "parsley"],
        "difficulty": "easy",
        "instructions": "Step 1: Cook pasta in salted water. Step 2: Heat olive oil, add sliced garlic. Step 3: Add chili flakes. Step 4: Toss cooked pasta in the oil. Step 5: Garnish with parsley and serve.",
        "tags": ["quick", "dinner", "italian"]
    },
    {
        "name": "Vegetable Fried Rice",
        "cuisine": "Chinese",
        "is_vegetarian": True,
        "prep_time_minutes": 25,
        "ingredients": ["rice", "vegetables", "soy sauce", "garlic", "ginger"],
        "difficulty": "easy",
        "instructions": "Step 1: Cook rice and let it cool. Step 2: Chop all vegetables. Step 3: Heat oil, add garlic and ginger. Step 4: Stir-fry vegetables on high heat. Step 5: Add rice and soy sauce, toss well.",
        "tags": ["dinner", "lunch", "quick"]
    }
]


async def populate_sample_data():
    """Populate database with sample recipes."""
    print("Connecting to MongoDB...")
    client = AsyncIOMotorClient(settings.mongodb_url)
    db = client[settings.database_name]
    collection = db.recipes
    
    # Check if data already exists
    count = await collection.count_documents({})
    if count > 0:
        print(f"Database already has {count} recipes.")
        response = input("Do you want to clear and add sample data? (yes/no): ")
        if response.lower() != 'yes':
            print("Cancelled.")
            client.close()
            return
        
        # Clear existing data
        await collection.delete_many({})
        print("Cleared existing recipes.")
    
    # Add timestamps to sample recipes
    for recipe in SAMPLE_RECIPES:
        recipe["created_at"] = datetime.now(timezone.utc)
        recipe["updated_at"] = datetime.now(timezone.utc)
    
    # Insert sample recipes
    result = await collection.insert_many(SAMPLE_RECIPES)
    print(f"\nSuccessfully added {len(result.inserted_ids)} sample recipes!")
    
    # Display added recipes
    print("\nAdded recipes:")
    for i, recipe in enumerate(SAMPLE_RECIPES, 1):
        print(f"{i}. {recipe['name']} - {recipe['cuisine']} ({recipe['difficulty']})")
    
    client.close()
    print("\nDatabase population complete!")


if __name__ == "__main__":
    asyncio.run(populate_sample_data())
