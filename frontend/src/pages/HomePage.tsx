import { useState, useEffect } from 'react';
import { Loader2, Plus, Sparkles } from 'lucide-react';
import RecipeCard from '../components/RecipeCard';
import RecipeModal from '../components/RecipeModal';
import RecipeForm from '../components/RecipeForm';
import SearchBar from '../components/SearchBar';
import AIChatWidget from '../components/AIChatWidget';
import { recipeAPI } from '../services/api';
import { type Recipe, type RecipeCreate, type SearchFilters } from '../types';

interface HomePageProps {
  showAddForm: boolean;
  setShowAddForm: (show: boolean) => void;
}

const HomePage = ({ showAddForm, setShowAddForm }: HomePageProps) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = async () => {
    try {
      setLoading(true);
      const data = await recipeAPI.getAllRecipes();
      setRecipes(data);
    } catch (error) {
      console.error('Error loading recipes:', error);
      alert('Failed to load recipes. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (filters: SearchFilters) => {
    try {
      setLoading(true);
      const data = await recipeAPI.searchRecipes(filters);
      setRecipes(data);
    } catch (error) {
      console.error('Error searching recipes:', error);
      alert('Failed to search recipes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRecipe = async (recipeData: RecipeCreate) => {
    try {
      const newRecipe = await recipeAPI.createRecipe(recipeData);
      setRecipes([newRecipe, ...recipes]);
      setShowAddForm(false);
      alert('Recipe created successfully! 🎉');
    } catch (error: any) {
      console.error('Error creating recipe:', error);
      throw error; // Re-throw to let form handle it
    }
  };

  const handleUpdateRecipe = async (recipeData: RecipeCreate) => {
    if (!editingRecipe) return;
    
    try {
      const updatedRecipe = await recipeAPI.updateRecipe(editingRecipe._id, recipeData);
      setRecipes(recipes.map(r => r._id === updatedRecipe._id ? updatedRecipe : r));
      setEditingRecipe(null);
      setSelectedRecipe(null);
      alert('Recipe updated successfully! ✓');
    } catch (error: any) {
      console.error('Error updating recipe:', error);
      throw error; // Re-throw to let form handle it
    }
  };

  const handleDeleteRecipe = async (recipeId: string) => {
    try {
      await recipeAPI.deleteRecipe(recipeId);
      setRecipes(recipes.filter(r => r._id !== recipeId));
      setSelectedRecipe(null);
      alert('Recipe deleted successfully');
    } catch (error) {
      console.error('Error deleting recipe:', error);
      alert('Failed to delete recipe. Please try again.');
    }
  };

  const handleEdit = () => {
    if (selectedRecipe) {
      setEditingRecipe(selectedRecipe);
      setSelectedRecipe(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute -top-12 -right-12 sm:-top-24 sm:-right-24 w-48 h-48 sm:w-96 sm:h-96 bg-white rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute -bottom-12 -left-12 sm:-bottom-24 sm:-left-24 w-48 h-48 sm:w-96 sm:h-96 bg-white rounded-full opacity-10 blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 lg:py-20">
          <div className="text-center">
       
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 sm:mb-6 leading-tight px-2">
              Discover Amazing Recipes
              <br className="hidden sm:block" />
              <span className="block sm:inline"> </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-orange-300">
                From Around The World
              </span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-indigo-100 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-4">
              Explore our curated collection of delicious recipes, from quick weeknight dinners to impressive gourmet dishes. 
              Start your culinary journey today!
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="flex items-center space-x-2 text-white">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 border-2 border-white flex items-center justify-center text-xs sm:text-sm font-bold">
                    👨‍🍳
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-pink-400 to-red-500 border-2 border-white flex items-center justify-center text-xs sm:text-sm font-bold">
                    👩‍🍳
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 border-2 border-white flex items-center justify-center text-xs sm:text-sm font-bold">
                    🧑‍🍳
                  </div>
                </div>
                <span className="text-xs sm:text-sm font-medium">Join 10,000+ home chefs</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-8 sm:h-12 md:h-16 lg:h-20 text-gray-50" preserveAspectRatio="none" viewBox="0 0 1440 74" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,32L60,37.3C120,43,240,53,360,56C480,59,600,53,720,48C840,43,960,37,1080,37.3C1200,37,1320,43,1380,45.3L1440,48L1440,74L1380,74C1320,74,1200,74,1080,74C960,74,840,74,720,74C600,74,480,74,360,74C240,74,120,74,60,74L0,74Z"></path>
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} />

        {/* Results Count */}
        <div className="mb-3 sm:mb-4">
          <p className="text-sm sm:text-base text-gray-600">
            {loading ? 'Loading...' : `${recipes.length} recipes found`}
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12 sm:py-16 md:py-20">
            <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 animate-spin text-indigo-600" />
          </div>
        )}

        {/* No Results */}
        {!loading && recipes.length === 0 && (
          <div className="text-center py-12 sm:py-16 md:py-20 px-4">
            <p className="text-lg sm:text-xl text-gray-600 mb-4">
              No recipes found. Try adjusting your search filters.
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg text-sm sm:text-base font-semibold hover:bg-indigo-700 transition-colors"
            >
              <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Add Your First Recipe</span>
            </button>
          </div>
        )}

        {/* Recipe Grid */}
        {!loading && recipes.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe._id}
                recipe={recipe}
                onClick={() => setSelectedRecipe(recipe)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Recipe Modal */}
      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          onEdit={handleEdit}
          onDelete={() => handleDeleteRecipe(selectedRecipe._id)}
        />
      )}

      {/* Add Recipe Form */}
      {showAddForm && (
        <RecipeForm
          onClose={() => setShowAddForm(false)}
          onSubmit={handleCreateRecipe}
        />
      )}

      {/* Edit Recipe Form */}
      {editingRecipe && (
        <RecipeForm
          recipe={editingRecipe}
          onClose={() => setEditingRecipe(null)}
          onSubmit={handleUpdateRecipe}
          isEdit={true}
        />
      )}

      {/* AI Chat Widget */}
      <AIChatWidget isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      {/* Floating AI Assistant Button */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 sm:p-4 rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 z-40 group"
          aria-label="Open AI Chat"
        >
          <Sparkles className="h-5 w-5 sm:h-6 sm:w-6" />
          <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs font-bold px-1.5 py-0.5 sm:px-2 rounded-full animate-pulse">
            AI
          </span>
          <div className="hidden sm:block absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
            Chat with AI Chef
            <div className="absolute top-full right-4 -mt-1 border-4 border-transparent border-t-gray-900"></div>
          </div>
        </button>
      )}
    </div>
  );
};

export default HomePage;
