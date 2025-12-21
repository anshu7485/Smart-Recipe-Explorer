"""
AI service integration for recipe suggestions and simplification.
Uses Google Gemini API (Free tier with 60 requests/minute).
Get your free API key from: https://makersuite.google.com/app/apikey
"""
import google.generativeai as genai
from config import settings
from typing import List, Optional
import logging

logger = logging.getLogger(__name__)


class AIService:
    """Service class for AI operations using Google Gemini."""
    
    def __init__(self):
        self.api_key = settings.gemini_api_key
        self.api_available = False
        
        if self.api_key:
            try:
                genai.configure(api_key=self.api_key)
                self.model = genai.GenerativeModel('gemini-2.5-flash')
                self.api_available = True
                logger.info("✅ Google Gemini API configured successfully (gemini-2.5-flash)")
            except Exception as e:
                logger.error(f"❌ Failed to configure Gemini API: {e}")
                logger.warning("Using intelligent fallback system")
        else:
            logger.warning("No Gemini API key found. Using fallback responses.")
            logger.info("Get free API key from: https://makersuite.google.com/app/apikey")
    
    def _query_model(self, prompt: str) -> Optional[str]:
        """
        Query Google Gemini AI model with error handling.
        
        Args:
            prompt: The prompt to send to the AI model
            
        Returns:
            AI response text or None if error
        """
        if not self.api_available:
            return None
        
        try:
            response = self.model.generate_content(prompt)
            if response and response.text:
                return response.text.strip()
            return None
        except Exception as e:
            logger.error(f"Error querying Gemini API: {e}")
            return None
    
    async def suggest_recipe(self, ingredients: List[str]) -> Optional[str]:
        """
        Suggest a recipe based on available ingredients using Google Gemini AI.
        
        Args:
            ingredients: List of available ingredients
            
        Returns:
            Recipe suggestion as text or fallback if API unavailable
        """
        try:
            ingredients_str = ", ".join(ingredients)
            
            prompt = f"""You are a helpful cooking assistant. Based on the following ingredients, suggest ONE simple and delicious recipe.

Available ingredients: {ingredients_str}

Please provide:
1. Recipe name (catchy and descriptive)
2. Brief description (1-2 sentences)
3. Additional ingredients needed (if any)
4. Simple step-by-step instructions (maximum 6 steps)
5. Estimated prep and cook time
6. Difficulty level (Easy/Medium/Hard)

Keep the response well-formatted, concise, and practical for home cooking."""
            
            logger.info(f"Generating recipe suggestion for ingredients: {ingredients_str}")
            result = self._query_model(prompt)
            
            if result:
                logger.info("✅ Successfully generated AI recipe suggestion")
                return result
            else:
                logger.warning("AI API unavailable, using fallback")
                return self._fallback_suggestion(ingredients)
                
        except Exception as e:
            logger.error(f"Error in suggest_recipe: {e}")
            return self._fallback_suggestion(ingredients)
    
    async def simplify_recipe(self, recipe_name: str, instructions: str) -> Optional[str]:
        """
        Simplify recipe instructions for beginners using Google Gemini AI.
        
        Args:
            recipe_name: Name of the recipe
            instructions: Original recipe instructions
            
        Returns:
            Simplified instructions or fallback if API unavailable
        """
        try:
            prompt = f"""You are a friendly cooking teacher helping a complete beginner. Simplify these recipe instructions in an encouraging way.

Recipe: {recipe_name}

Original Instructions:
{instructions}

Please provide:
1. Simplified, beginner-friendly instructions with clear, simple language
2. Exact timing and measurements explained
3. Helpful tips and common mistakes to avoid
4. What to look for (visual and sensory cues)
5. Maximum 6 easy-to-follow steps

Make it encouraging and build confidence. Format clearly with proper structure."""
            
            logger.info(f"Simplifying recipe: {recipe_name}")
            result = self._query_model(prompt)
            
            if result:
                logger.info("✅ Successfully simplified recipe with AI")
                return result
            else:
                logger.warning("AI API unavailable, using fallback")
                return self._fallback_simplification(recipe_name, instructions)
                
        except Exception as e:
            logger.error(f"Error in simplify_recipe: {e}")
            return self._fallback_simplification(recipe_name, instructions)
    
    def _fallback_suggestion(self, ingredients: List[str]) -> str:
        """Enhanced recipe suggestion based on ingredient analysis."""
        if not ingredients:
            return "Please provide at least one ingredient for recipe suggestions."
        
        # Smart recipe mapping based on common ingredients
        ingredient_lower = [ing.lower() for ing in ingredients]
        
        # Indian cuisine recipes (common combinations)
        if any(ing in ingredient_lower for ing in ['paneer', 'cottage cheese']):
            if any(ing in ingredient_lower for ing in ['tomato', 'tomatoes']):
                return """Recipe: Paneer Butter Masala

**Ingredients:**
- Paneer (cottage cheese) - 250g, cubed
- Tomatoes - 4 medium, pureed
- Onion - 1 large, finely chopped
- Cream - 3 tbsp
- Butter - 2 tbsp
- Ginger-garlic paste - 1 tbsp
- Spices: Red chili powder, garam masala, kasuri methi

**Instructions:**
1. Heat butter in a pan, add ginger-garlic paste and sauté for 1 minute
2. Add onions and cook until golden brown (5-7 minutes)
3. Add tomato puree, salt, red chili powder and cook for 10 minutes
4. Add paneer cubes and garam masala, cook for 3-4 minutes
5. Add cream and kasuri methi, simmer for 2 minutes
6. Garnish with coriander and serve hot with naan or rice

**Prep Time:** 15 minutes | **Cook Time:** 25 minutes | **Difficulty:** Medium"""
            else:
                return """Recipe: Paneer Tikka

**Ingredients:**
- Paneer - 250g, cubed
- Yogurt - 1 cup
- Bell peppers - 1 each (red, yellow, green)
- Onion - 1 large
- Tikka masala - 2 tbsp
- Lemon juice - 2 tbsp
- Oil for grilling

**Instructions:**
1. Mix yogurt, tikka masala, lemon juice and salt to make marinade
2. Cut paneer and vegetables into 1-inch cubes
3. Marinate paneer and vegetables for 30 minutes
4. Thread paneer and vegetables alternately on skewers
5. Grill or bake at 200°C for 15-20 minutes, turning occasionally
6. Serve hot with mint chutney

**Prep Time:** 40 minutes | **Cook Time:** 20 minutes | **Difficulty:** Easy"""
        
        elif any(ing in ingredient_lower for ing in ['chicken', 'mutton', 'meat']):
            return """Recipe: Chicken Curry

**Ingredients:**
- Chicken - 500g, cut into pieces
- Onions - 2 large, sliced
- Tomatoes - 2 medium, chopped
- Ginger-garlic paste - 2 tbsp
- Curry powder - 2 tbsp
- Coconut milk - 1 cup
- Oil - 3 tbsp

**Instructions:**
1. Heat oil, add onions and cook until golden (8-10 minutes)
2. Add ginger-garlic paste, cook for 2 minutes
3. Add chicken pieces, cook until they change color
4. Add tomatoes and curry powder, cook for 5 minutes
5. Pour coconut milk, simmer covered for 20 minutes
6. Adjust salt and serve with rice

**Prep Time:** 15 minutes | **Cook Time:** 35 minutes | **Difficulty:** Medium"""
        
        elif any(ing in ingredient_lower for ing in ['potato', 'potatoes', 'aloo']):
            return """Recipe: Aloo Paratha (Potato Stuffed Flatbread)

**Ingredients:**
- Boiled potatoes - 3 large, mashed
- Whole wheat flour - 2 cups
- Spices: red chili, coriander powder, garam masala
- Fresh coriander - 2 tbsp, chopped
- Ghee/butter for cooking

**Instructions:**
1. Mix mashed potatoes with spices and coriander, set aside
2. Knead wheat flour with water to make soft dough, rest 15 minutes
3. Divide dough into balls, roll each into small circle
4. Place potato filling in center, seal and roll flat carefully
5. Cook on hot griddle with ghee until golden spots appear on both sides
6. Serve hot with yogurt and pickle

**Prep Time:** 25 minutes | **Cook Time:** 20 minutes | **Difficulty:** Easy"""
        
        elif any(ing in ingredient_lower for ing in ['rice', 'basmati']):
            return """Recipe: Vegetable Pulao

**Ingredients:**
- Basmati rice - 2 cups, washed
- Mixed vegetables - 2 cups (carrots, peas, beans)
- Onion - 1 large, sliced
- Whole spices: bay leaf, cinnamon, cardamom
- Ghee - 2 tbsp
- Water - 4 cups

**Instructions:**
1. Heat ghee, add whole spices and sliced onions
2. Sauté until onions are golden (5 minutes)
3. Add mixed vegetables, cook for 3-4 minutes
4. Add rice and water, bring to boil
5. Cover and simmer on low heat for 15-20 minutes
6. Fluff with fork and serve with raita

**Prep Time:** 15 minutes | **Cook Time:** 25 minutes | **Difficulty:** Easy"""
        
        elif any(ing in ingredient_lower for ing in ['dal', 'lentil', 'lentils']):
            return """Recipe: Dal Tadka (Tempered Lentils)

**Ingredients:**
- Yellow lentils (toor dal) - 1 cup
- Tomato - 1 large, chopped
- Onion - 1 medium, chopped
- Garlic - 4 cloves
- Cumin seeds - 1 tsp
- Turmeric, red chili powder
- Ghee - 2 tbsp
- Water - 3 cups

**Instructions:**
1. Pressure cook lentils with turmeric and salt for 3 whistles
2. Mash lightly and keep warm
3. Heat ghee, add cumin seeds and garlic
4. Add onions and tomatoes, cook until soft
5. Pour tadka over cooked dal and mix well
6. Garnish with coriander and serve with rice/roti

**Prep Time:** 10 minutes | **Cook Time:** 20 minutes | **Difficulty:** Easy"""
        
        # Default recipe for any ingredients
        ingredients_str = ", ".join(ingredients[:5])
        main_ingredient = ingredients[0].title()
        
        return f"""Recipe: Simple {main_ingredient} Stir-Fry

**Ingredients:**
- {ingredients_str}
- Oil - 2 tbsp
- Garlic - 3 cloves, minced
- Soy sauce - 2 tbsp (optional)
- Salt and pepper to taste
- Fresh herbs for garnish

**Instructions:**
1. Prepare all ingredients: wash, peel, and chop as needed
2. Heat oil in a large pan or wok over medium-high heat
3. Add minced garlic and sauté for 30 seconds until fragrant
4. Add main ingredients ({ingredients_str}) in order of cooking time
5. Stir-fry for 5-8 minutes until cooked but still crisp
6. Season with salt, pepper, and soy sauce if using
7. Garnish with fresh herbs and serve hot

**Prep Time:** 10 minutes | **Cook Time:** 10 minutes | **Difficulty:** Easy

**Note:** This is an intelligent fallback suggestion. For AI-powered personalized recipes, please integrate OpenAI or similar API."""
    
    def _fallback_simplification(self, recipe_name: str, instructions: str) -> str:
        """Enhanced simplification with beginner-friendly breakdown."""
        # Clean up instructions
        instructions_clean = instructions.strip()
        
        return f"""📚 Simplified Guide: {recipe_name}

**Original Instructions:**
{instructions_clean}

---

**Beginner-Friendly Breakdown:**

🔧 **Before You Start:**
- Read through all steps completely first
- Gather and measure all ingredients (mise en place)
- Prepare your cooking equipment and utensils
- Wash your hands and work surface

⏱️ **Cooking Tips:**
- Don't rush - good cooking takes time and practice
- Taste as you cook and adjust seasonings gradually
- Keep ingredients at room temperature (unless recipe says otherwise)
- If something starts burning, reduce heat immediately

📏 **Measurement Guide:**
- 1 cup = 240ml
- 1 tbsp = 15ml
- 1 tsp = 5ml
- A pinch = what you can hold between thumb and finger

🌡️ **Temperature Guide:**
- Low heat: You can hold your hand 5 inches above pan for 8+ seconds
- Medium heat: 5-6 seconds
- High heat: 3-4 seconds

✅ **Success Indicators:**
- Follow timing guidelines but also watch for visual cues
- Vegetables should be tender but not mushy
- Meat should reach safe internal temperatures
- Taste before serving and adjust seasonings

💡 **Common Mistakes to Avoid:**
- Don't overcrowd the pan (cook in batches if needed)
- Don't skip the resting time for meat dishes
- Don't add garlic too early (it burns quickly)
- Don't forget to season at multiple stages

**Note:** This is an enhanced fallback simplification. For AI-powered personalized simplifications, integrate OpenAI API or similar service."""
