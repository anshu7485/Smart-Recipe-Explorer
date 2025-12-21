// API configuration and types
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface Recipe {
  _id: string;
  name: string;
  cuisine: string;
  is_vegetarian: boolean;
  prep_time_minutes: number;
  ingredients: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  instructions: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface RecipeCreate {
  name: string;
  cuisine: string;
  is_vegetarian: boolean;
  prep_time_minutes: number;
  ingredients: string[];
  difficulty: string;
  instructions: string;
  tags: string[];
}

export interface SearchFilters {
  cuisine?: string;
  is_vegetarian?: boolean;
  max_prep_time?: number;
  difficulty?: string;
  tags?: string[];
  ingredients?: string[];
  search_query?: string;
}

export interface AIResponse {
  success: boolean;
  data?: string;
  error?: string;
}
