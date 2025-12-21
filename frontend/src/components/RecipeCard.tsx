import { Clock, ChefHat, Utensils } from 'lucide-react';
import { type Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
  onClick: () => void;
}

const RecipeCard = ({ recipe, onClick }: RecipeCardProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden transform hover:-translate-y-1"
    >
      {/* Card Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 sm:p-4">
        <h3 className="text-lg sm:text-xl font-bold text-white truncate">{recipe.name}</h3>
        <p className="text-indigo-100 text-xs sm:text-sm">{recipe.cuisine}</p>
      </div>

      {/* Card Body */}
      <div className="p-3 sm:p-4">
        {/* Info Row */}
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <div className="flex items-center space-x-1.5 sm:space-x-2 text-gray-600">
            <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="text-xs sm:text-sm">{recipe.prep_time_minutes} min</span>
          </div>
          <span
            className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold ${getDifficultyColor(
              recipe.difficulty
            )}`}
          >
            {recipe.difficulty}
          </span>
        </div>

        {/* Dietary Info */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 mb-2 sm:mb-3">
          <Utensils className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-500" />
          <span className="text-xs sm:text-sm text-gray-600">
            {recipe.is_vegetarian ? '🌱 Vegetarian' : '🍖 Non-Vegetarian'}
          </span>
        </div>

        {/* Ingredients Count */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 mb-3 sm:mb-4">
          <ChefHat className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-500" />
          <span className="text-xs sm:text-sm text-gray-600">
            {recipe.ingredients.length} ingredients
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {recipe.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-indigo-50 text-indigo-600 rounded text-[10px] sm:text-xs"
            >
              {tag}
            </span>
          ))}
          {recipe.tags.length > 3 && (
            <span className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-gray-50 text-gray-600 rounded text-[10px] sm:text-xs">
              +{recipe.tags.length - 3} more
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
