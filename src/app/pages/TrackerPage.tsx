import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Minus, Search } from 'lucide-react';
import { ingredients } from '../data/ingredients';
import PageHeader from '../components/PageHeader';

interface TrackerPageProps {
  onNavigate: (page: string) => void;
}

export default function TrackerPage({ onNavigate }: TrackerPageProps) {
  const { userProfile, dailyNutrition, addConsumedFood, removeConsumedFood, getTodayNutrition, isDarkMode } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');

  const nutrition = getTodayNutrition();

  // Calculate totals from consumed foods
  const totals = useMemo(() => {
    let proteins = 0;
    let carbs = 0;
    let fats = 0;

    nutrition.consumed.forEach((consumed) => {
      const ingredient = ingredients.find((i) => i.id === consumed.ingredientId);
      if (ingredient) {
        proteins += (ingredient.proteins * consumed.quantity) / 100;
        carbs += (ingredient.carbs * consumed.quantity) / 100;
        fats += (ingredient.fats * consumed.quantity) / 100;
      }
    });

    return {
      proteins: Math.round(proteins),
      carbs: Math.round(carbs),
      fats: Math.round(fats),
    };
  }, [nutrition.consumed]);

  const categories = ['Tous', ...Array.from(new Set(ingredients.map((i) => i.category)))];

  const filteredIngredients = ingredients.filter((ingredient) => {
    const matchesSearch = ingredient.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Tous' || ingredient.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getConsumedCount = (ingredientId: string) => {
    return nutrition.consumed.filter((c) => c.ingredientId === ingredientId).length;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pb-24">
      {/* Header */}
      <PageHeader title="Ma Nutrition" subtitle="Suivez vos macros du jour" />

      <div className="max-w-md mx-auto p-4">
        {/* Progress Rings */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-lg border border-gray-100 dark:border-gray-800 mb-5">
          <h2 className="text-lg mb-4 text-gray-900 dark:text-white">Objectif du jour</h2>
          <div className="grid grid-cols-3 gap-4">
            {/* Proteins */}
            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-2">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    fill="none"
                    stroke={isDarkMode ? "#1f2937" : "#f3f4f6"}
                    strokeWidth="8"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    fill="none"
                    stroke="url(#gradient-proteins)"
                    strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 34}`}
                    strokeDashoffset={`${2 * Math.PI * 34 * (1 - Math.min(totals.proteins / (userProfile?.nutritionGoals.proteins || 1), 1))}`}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="gradient-proteins" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#F57BFF" />
                      <stop offset="100%" stopColor="#FB8E76" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div>
                    <p className="text-base font-semibold text-gray-900 dark:text-white">{totals.proteins}g</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">/ {userProfile?.nutritionGoals.proteins}g</p>
                  </div>
                </div>
              </div>
              <p className="text-xs text-[#F57BFF]">Protéines</p>
            </div>

            {/* Carbs */}
            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-2">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    fill="none"
                    stroke={isDarkMode ? "#1f2937" : "#f3f4f6"}
                    strokeWidth="8"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    fill="none"
                    stroke="url(#gradient-carbs)"
                    strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 34}`}
                    strokeDashoffset={`${2 * Math.PI * 34 * (1 - Math.min(totals.carbs / (userProfile?.nutritionGoals.carbs || 1), 1))}`}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="gradient-carbs" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#00F65C" />
                      <stop offset="100%" stopColor="#C1FB00" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div>
                    <p className="text-base font-semibold text-gray-900 dark:text-white">{totals.carbs}g</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">/ {userProfile?.nutritionGoals.carbs}g</p>
                  </div>
                </div>
              </div>
              <p className="text-xs text-[#00F65C]">Glucides</p>
            </div>

            {/* Fats */}
            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-2">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    fill="none"
                    stroke={isDarkMode ? "#1f2937" : "#f3f4f6"}
                    strokeWidth="8"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    fill="none"
                    stroke="url(#gradient-fats)"
                    strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 34}`}
                    strokeDashoffset={`${2 * Math.PI * 34 * (1 - Math.min(totals.fats / (userProfile?.nutritionGoals.fats || 1), 1))}`}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="gradient-fats" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#C1FB00" />
                      <stop offset="100%" stopColor="#F57BFF" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div>
                    <p className="text-base font-semibold text-gray-900 dark:text-white">{totals.fats}g</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">/ {userProfile?.nutritionGoals.fats}g</p>
                  </div>
                </div>
              </div>
              <p className="text-xs text-[#C1FB00]">Lipides</p>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all text-sm ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-[#00F65C] to-[#C1FB00] text-[#292929] shadow-lg'
                  : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="mb-5 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher un aliment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00F65C] shadow-lg"
          />
        </div>

        {/* Ingredients List */}
        <div className="space-y-2.5">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Pour 100g</p>
          {filteredIngredients.map((ingredient) => {
            const count = getConsumedCount(ingredient.id);
            return (
              <div
                key={ingredient.id}
                className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{ingredient.name}</h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => removeConsumedFood(ingredient.id)}
                      disabled={count === 0}
                      className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 flex items-center justify-center transition-colors"
                    >
                      <Minus className="w-4 h-4 text-gray-900 dark:text-white" />
                    </button>
                    <span className="text-base w-6 text-center font-medium text-gray-900 dark:text-white">{count}</span>
                    <button
                      onClick={() =>
                        addConsumedFood({
                          ingredientId: ingredient.id,
                          quantity: 100,
                          timestamp: new Date(),
                        })
                      }
                      className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#00F65C] to-[#C1FB00] hover:opacity-90 flex items-center justify-center transition-opacity"
                    >
                      <Plus className="w-4 h-4 text-[#292929]" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Protéines: {ingredient.proteins}g • Glucides: {ingredient.carbs}g • Lipides: {ingredient.fats}g
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}