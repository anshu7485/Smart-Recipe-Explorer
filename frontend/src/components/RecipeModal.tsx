import { X, Clock, Utensils, ChefHat, Sparkles, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { aiAPI } from '../services/api';
import { type Recipe } from '../types';

interface RecipeModalProps {
  recipe: Recipe;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const RecipeModal = ({ recipe, onClose, onEdit, onDelete }: RecipeModalProps) => {
  const [isSimplifying, setIsSimplifying] = useState(false);
  const [simplifiedInstructions, setSimplifiedInstructions] = useState<string | null>(null);
  const [showSimplified, setShowSimplified] = useState(false);

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${recipe.name}"? This action cannot be undone.`)) {
      onDelete?.();
    }
  };

  const handleSimplify = async () => {
    setIsSimplifying(true);
    try {
      const response = await aiAPI.simplifyRecipe(recipe._id);
      if (response.success && response.data) {
        setSimplifiedInstructions(response.data);
        setShowSimplified(true);
      } else {
        alert(response.error || 'Failed to simplify recipe');
      }
    } catch (error) {
      console.error('Error simplifying recipe:', error);
      alert('Failed to simplify recipe. Please try again.');
    } finally {
      setIsSimplifying(false);
    }
  };

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-lg">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold mb-2">{recipe.name}</h2>
              <p className="text-indigo-100">{recipe.cuisine} Cuisine</p>
            </div>
            <div className="flex items-center space-x-2">
              {onEdit && (
                <button
                  onClick={onEdit}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
                  aria-label="Edit recipe"
                  title="Edit recipe"
                >
                  <Edit className="h-5 w-5" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={handleDelete}
                  className="text-white hover:bg-red-500 hover:bg-opacity-30 rounded-full p-2 transition-colors"
                  aria-label="Delete recipe"
                  title="Delete recipe"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              )}
              <button
                onClick={onClose}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
                aria-label="Close modal"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Quick Info */}
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>{recipe.prep_time_minutes} minutes</span>
            </div>
            <div className="flex items-center space-x-2">
              <Utensils className="h-5 w-5" />
              <span>{recipe.is_vegetarian ? 'Vegetarian' : 'Non-Vegetarian'}</span>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(recipe.difficulty)}`}>
              {recipe.difficulty}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Ingredients */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-3">
              <ChefHat className="h-6 w-6 text-indigo-600" />
              <h3 className="text-2xl font-bold text-gray-800">Ingredients</h3>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                  <span className="text-gray-700 capitalize">{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-2xl font-bold text-gray-800">Instructions</h3>
              <button
                onClick={handleSimplify}
                disabled={isSimplifying}
                className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Sparkles className="h-4 w-4" />
                <span>{isSimplifying ? 'Simplifying...' : 'Simplify for Beginners'}</span>
              </button>
            </div>

            {/* Toggle between original and simplified */}
            {simplifiedInstructions && (
              <div className="mb-3">
                <div className="inline-flex rounded-lg bg-gray-100 p-1">
                  <button
                    onClick={() => setShowSimplified(false)}
                    className={`px-4 py-2 rounded-md transition-colors ${
                      !showSimplified
                        ? 'bg-white text-indigo-600 font-semibold shadow'
                        : 'text-gray-600'
                    }`}
                  >
                    Original
                  </button>
                  <button
                    onClick={() => setShowSimplified(true)}
                    className={`px-4 py-2 rounded-md transition-colors ${
                      showSimplified
                        ? 'bg-white text-indigo-600 font-semibold shadow'
                        : 'text-gray-600'
                    }`}
                  >
                    AI Simplified ✨
                  </button>
                </div>
              </div>
            )}

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                {showSimplified && simplifiedInstructions ? simplifiedInstructions : recipe.instructions}
              </p>
            </div>
          </div>

          {/* Tags */}
          {recipe.tags.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {recipe.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeModal;
