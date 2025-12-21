import { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { type Recipe, type RecipeCreate } from '../types';

interface RecipeFormProps {
  recipe?: Recipe | null;
  onClose: () => void;
  onSubmit: (recipe: RecipeCreate) => Promise<void>;
  isEdit?: boolean;
}

const RecipeForm = ({ recipe, onClose, onSubmit, isEdit = false }: RecipeFormProps) => {
  const [formData, setFormData] = useState<RecipeCreate>({
    name: '',
    cuisine: '',
    is_vegetarian: false,
    prep_time_minutes: 30,
    ingredients: [''],
    difficulty: 'medium',
    instructions: '',
    tags: [''],
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (recipe && isEdit) {
      setFormData({
        name: recipe.name,
        cuisine: recipe.cuisine,
        is_vegetarian: recipe.is_vegetarian,
        prep_time_minutes: recipe.prep_time_minutes,
        ingredients: recipe.ingredients.length > 0 ? recipe.ingredients : [''],
        difficulty: recipe.difficulty,
        instructions: recipe.instructions,
        tags: recipe.tags.length > 0 ? recipe.tags : [''],
      });
    }
  }, [recipe, isEdit]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Recipe name is required';
    }
    if (!formData.cuisine.trim()) {
      newErrors.cuisine = 'Cuisine is required';
    }
    if (formData.prep_time_minutes <= 0) {
      newErrors.prep_time_minutes = 'Preparation time must be greater than 0';
    }
    const validIngredients = formData.ingredients.filter(i => i.trim());
    if (validIngredients.length === 0) {
      newErrors.ingredients = 'At least one ingredient is required';
    }
    if (!formData.instructions.trim()) {
      newErrors.instructions = 'Instructions are required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Clean up empty ingredients and tags
      const cleanedData: RecipeCreate = {
        ...formData,
        ingredients: formData.ingredients.filter(i => i.trim()),
        tags: formData.tags.filter(t => t.trim()),
      };

      await onSubmit(cleanedData);
      onClose();
    } catch (error: any) {
      console.error('Error submitting recipe:', error);
      alert(error.response?.data?.detail || 'Failed to save recipe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleArrayFieldChange = (
    index: number,
    value: string,
    field: 'ingredients' | 'tags'
  ) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayField = (field: 'ingredients' | 'tags') => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const removeArrayField = (index: number, field: 'ingredients' | 'tags') => {
    if (formData[field].length > 1) {
      const newArray = formData[field].filter((_, i) => i !== index);
      setFormData({ ...formData, [field]: newArray });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold">
              {isEdit ? 'Edit Recipe' : 'Add New Recipe'}
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
              aria-label="Close form"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Recipe Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recipe Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., Paneer Butter Masala"
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
          </div>

          {/* Cuisine and Vegetarian (Row) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cuisine <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.cuisine}
                onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  errors.cuisine ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Indian, Italian, Chinese"
              />
              {errors.cuisine && <p className="mt-1 text-sm text-red-500">{errors.cuisine}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dietary Preference
              </label>
              <div className="flex items-center space-x-4 mt-3">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    checked={formData.is_vegetarian}
                    onChange={() => setFormData({ ...formData, is_vegetarian: true })}
                    className="mr-2 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-gray-700">Vegetarian</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    checked={!formData.is_vegetarian}
                    onChange={() => setFormData({ ...formData, is_vegetarian: false })}
                    className="mr-2 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-gray-700">Non-Vegetarian</span>
                </label>
              </div>
            </div>
          </div>

          {/* Prep Time and Difficulty (Row) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preparation Time (minutes) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={formData.prep_time_minutes}
                onChange={(e) =>
                  setFormData({ ...formData, prep_time_minutes: parseInt(e.target.value) || 0 })
                }
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  errors.prep_time_minutes ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., 40"
              />
              {errors.prep_time_minutes && (
                <p className="mt-1 text-sm text-red-500">{errors.prep_time_minutes}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty Level
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          {/* Ingredients */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ingredients <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {formData.ingredients.map((ingredient, index) => (
                <div key={index} className="flex space-x-2">
                  <input
                    type="text"
                    value={ingredient}
                    onChange={(e) => handleArrayFieldChange(index, e.target.value, 'ingredients')}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="e.g., paneer, tomato, cream"
                  />
                  {formData.ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayField(index, 'ingredients')}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      aria-label="Remove ingredient"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayField('ingredients')}
                className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 font-medium"
              >
                <Plus className="h-5 w-5" />
                <span>Add Ingredient</span>
              </button>
            </div>
            {errors.ingredients && <p className="mt-1 text-sm text-red-500">{errors.ingredients}</p>}
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instructions <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
              rows={6}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                errors.instructions ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Step 1: Heat oil in a pan...&#10;Step 2: Add spices and cook...&#10;Step 3: Add main ingredients..."
            />
            {errors.instructions && <p className="mt-1 text-sm text-red-500">{errors.instructions}</p>}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (Optional)
            </label>
            <div className="space-y-2">
              {formData.tags.map((tag, index) => (
                <div key={index} className="flex space-x-2">
                  <input
                    type="text"
                    value={tag}
                    onChange={(e) => handleArrayFieldChange(index, e.target.value, 'tags')}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="e.g., dinner, party, spicy"
                  />
                  {formData.tags.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayField(index, 'tags')}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      aria-label="Remove tag"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayField('tags')}
                className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 font-medium"
              >
                <Plus className="h-5 w-5" />
                <span>Add Tag</span>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : isEdit ? 'Update Recipe' : 'Add Recipe'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecipeForm;
