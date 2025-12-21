import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { type SearchFilters } from '../types';

interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});

  const handleSearch = () => {
    onSearch({
      ...filters,
      search_query: searchQuery || undefined,
    });
  };

  const handleReset = () => {
    setSearchQuery('');
    setFilters({});
    onSearch({});
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 mb-4 sm:mb-6">
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-2 mb-3 sm:mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm sm:text-base"
          >
            <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Filters</span>
          </button>
          <button
            onClick={handleSearch}
            className="flex-1 sm:flex-none px-4 sm:px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm sm:text-base"
          >
            Search
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="border-t pt-3 sm:pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Cuisine Filter */}
            <div>
              <label htmlFor="cuisine-filter" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Cuisine
              </label>
              <select
                id="cuisine-filter"
                value={filters.cuisine || ''}
                onChange={(e) => handleFilterChange('cuisine', e.target.value)}
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Cuisines</option>
                <option value="Indian">Indian</option>
                <option value="Italian">Italian</option>
                <option value="Chinese">Chinese</option>
                <option value="American">American</option>
                <option value="Continental">Continental</option>
              </select>
            </div>

            {/* Dietary Preference */}
            <div>
              <label htmlFor="dietary-filter" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Dietary Preference
              </label>
              <select
                id="dietary-filter"
                value={
                  filters.is_vegetarian === undefined
                    ? ''
                    : filters.is_vegetarian
                    ? 'vegetarian'
                    : 'non-vegetarian'
                }
                onChange={(e) =>
                  handleFilterChange(
                    'is_vegetarian',
                    e.target.value === ''
                      ? undefined
                      : e.target.value === 'vegetarian'
                  )
                }
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="non-vegetarian">Non-Vegetarian</option>
              </select>
            </div>

            {/* Difficulty */}
            <div>
              <label htmlFor="difficulty-filter" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Difficulty
              </label>
              <select
                id="difficulty-filter"
                value={filters.difficulty || ''}
                onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Levels</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            {/* Max Prep Time */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Max Prep Time (min)
              </label>
              <input
                type="number"
                placeholder="e.g., 60"
                value={filters.max_prep_time || ''}
                onChange={(e) =>
                  handleFilterChange(
                    'max_prep_time',
                    e.target.value ? parseInt(e.target.value) : undefined
                  )
                }
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end mt-3 sm:mt-4 space-x-2">
            <button
              onClick={handleReset}
              className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
