import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ChefHat,
  Menu,
  X,
  Sparkles,
  Home,
  Plus
} from 'lucide-react';

interface NavbarProps {
  onAddRecipe?: () => void;
}

const Navbar = ({ onAddRecipe }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/ai-assistant', label: 'AI Assistant', icon: Sparkles }
  ];

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-indigo-200 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ================= TOP BAR ================= */}
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 blur-md opacity-40 group-hover:opacity-70 transition"></div>
              <div className="relative p-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg group-hover:scale-110 transition">
                <ChefHat className="h-6 w-6 text-white" />
              </div>
            </div>

            <div className="flex flex-col leading-tight">
              <span className="text-xl lg:text-2xl font-extrabold text-gray-900">
                Recipe Explorer
              </span>
              <span className="hidden sm:block text-xs font-semibold text-indigo-600">
                Smart AI Cooking
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-3 bg-white/60 backdrop-blur-md p-2 rounded-2xl border border-gray-200 shadow-inner">
            {navLinks.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`relative flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300
                  ${
                    isActive(path)
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-105'
                      : 'text-gray-700 hover:bg-white hover:text-indigo-600 hover:shadow-md'
                  }`}
              >
                <Icon className="h-5 w-5" />
                {label}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">

            {/* Add Recipe Desktop */}
            {onAddRecipe && location.pathname === '/' && (
              <button
                onClick={onAddRecipe}
                className="hidden md:flex items-center gap-2 px-6 py-3 rounded-xl font-bold
                bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg
                hover:from-emerald-600 hover:to-green-700 hover:scale-110 transition"
              >
                <Plus className="h-5 w-5" />
                Add Recipe
              </button>
            )}

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-3 rounded-xl text-gray-700 hover:bg-indigo-100 transition"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* ================= MOBILE MENU ================= */}
        <div
          className={`md:hidden transition-all duration-300 overflow-hidden ${
            isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="py-4 space-y-3 border-t border-gray-200">

            {navLinks.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-4 px-5 py-4 rounded-xl font-semibold transition
                  ${
                    isActive(path)
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                  }`}
              >
                <Icon className="h-6 w-6" />
                {label}
              </Link>
            ))}

            {/* Add Recipe Mobile */}
            {onAddRecipe && location.pathname === '/' && (
              <button
                onClick={() => {
                  onAddRecipe();
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-center gap-3 px-5 py-4 rounded-xl font-bold
                bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg
                hover:from-emerald-600 hover:to-green-700 transition"
              >
                <Plus className="h-6 w-6" />
                Add New Recipe
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
