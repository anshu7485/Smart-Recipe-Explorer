// API service for making HTTP requests to backend
import axios from 'axios';
import { API_BASE_URL, type Recipe, type RecipeCreate, type SearchFilters, type AIResponse } from '../types';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const recipeAPI = {
  // Get all recipes
  getAllRecipes: async (): Promise<Recipe[]> => {
    const response = await api.get('/api/recipes/');
    return response.data;
  },

  // Get single recipe by ID
  getRecipe: async (id: string): Promise<Recipe> => {
    const response = await api.get(`/api/recipes/${id}`);
    return response.data;
  },

  // Create new recipe
  createRecipe: async (recipe: RecipeCreate): Promise<Recipe> => {
    const response = await api.post('/api/recipes/', recipe);
    return response.data;
  },

  // Update recipe
  updateRecipe: async (id: string, recipe: Partial<RecipeCreate>): Promise<Recipe> => {
    const response = await api.put(`/api/recipes/${id}`, recipe);
    return response.data;
  },

  // Delete recipe
  deleteRecipe: async (id: string): Promise<void> => {
    await api.delete(`/api/recipes/${id}`);
  },

  // Search recipes
  searchRecipes: async (filters: SearchFilters): Promise<Recipe[]> => {
    const response = await api.post('/api/recipes/search', filters);
    return response.data;
  },

  // Get recipe count
  getRecipeCount: async (): Promise<number> => {
    const response = await api.get('/api/recipes/count');
    return response.data.count;
  },
};

export const aiAPI = {
  // Get recipe suggestion based on ingredients
  suggestRecipe: async (ingredients: string[]): Promise<AIResponse> => {
    const response = await api.post('/api/ai/suggest-recipe', { ingredients });
    return response.data;
  },

  // Simplify recipe instructions
  simplifyRecipe: async (recipeId: string): Promise<AIResponse> => {
    const response = await api.post('/api/ai/simplify-recipe', { recipe_id: recipeId });
    return response.data;
  },

  // Check AI service health
  checkAIHealth: async () => {
    const response = await api.get('/api/ai/health');
    return response.data;
  },
};

export default api;
