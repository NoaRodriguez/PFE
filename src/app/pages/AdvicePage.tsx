import React, { useState } from 'react';
import PageHeader from '../components/PageHeader';
import { nutritionCategories, dailyTip } from '../data/nutritionCategories';
import { X, ArrowRight, BookOpen, Clock, Flame, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdvicePage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [showTip, setShowTip] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const selectedCategory = nutritionCategories.find(c => c.id === selectedCategoryId);
  const dailyCategory = nutritionCategories.find(c => c.id === dailyTip.categoryLink);

  return (
    <div className="pb-24 px-4 max-w-md mx-auto min-h-screen bg-gray-50 dark:bg-gray-950 overflow-x-hidden">
      
      <PageHeader title="Centre Nutrition" subtitle="Performance & Santé" />

      <div className="space-y-8 relative z-0">
        
        {/* --- 1. CONSEIL DU JOUR --- */}
        <div 
          onClick={() => setShowTip(true)}
          className="relative overflow-hidden rounded-[23px] bg-[#121212] border border-gray-800 p-6 text-white shadow-xl cursor-pointer group active:scale-[0.98] transition-transform z-0"
        >
            {/* Fond SOMA Trouble */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#00F65C]/20 via-transparent to-[#F57BFF]/20 opacity-50 group-hover:opacity-80 transition-opacity pointer-events-none blur-xl" />
            
            <div className="relative z-10">
                 <div className="flex items-center gap-2 mb-3">
                    <span className="bg-[#C1FB00] text-black px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(193,251,0,0.4)]">
                      Tip du jour
                    </span>
                 </div>
                 <h3 className="text-xl font-bold text-white mb-2">
                    {dailyTip.title}
                 </h3>
                 <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">
                    {dailyTip.summary.replace(/\*\*/g, '')}
                 </p>
                 
                 <button className="mt-4 flex items-center gap-2 text-xs text-[#C1FB00] font-bold uppercase tracking-wider bg-white/5 border border-white/10 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors backdrop-blur-md">
                    Lire la suite <ArrowRight className="w-3 h-3" />
                 </button>
            </div>
        </div>

        {/* --- 2. LISTE DES PILIERS (Grandes Cartes) --- */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 pl-1 flex items-center gap-2">
            Les Piliers de la Nutrition
          </h3>
          
          <div className="space-y-4">
            {nutritionCategories.map((category) => (
              <motion.div 
                key={category.id}
                onClick={() => setSelectedCategoryId(category.id)}
                whileTap={{ scale: 0.98 }}
                className="cursor-pointer relative rounded-[2rem] bg-[#1A1A1A] border border-gray-800 z-10 overflow-hidden shadow-lg group"
              >
                  {/* Background SOMA Style */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-10 transition-opacity group-hover:opacity-20`} />
                  
                  <div className="relative p-6 z-10">
                    
                    {/* Header: Icon + Title */}
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <span className="text-4xl p-3 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/5 shadow-inner">
                                {category.icon}
                            </span>
                            <div>
                                <h4 className="font-bold text-xl text-white leading-tight">
                                    {category.title}
                                </h4>
                                <span className="text-[10px] font-bold tracking-widest uppercase opacity-90" style={{ color: category.themeColor }}>
                                    {category.subtitle}
                                </span>
                            </div>
                        </div>
                        {/* Chevron */}
                        <div className="p-2 bg-white/5 rounded-full text-gray-500 group-hover:bg-white/10 transition-colors">
                             <ChevronRight className="w-5 h-5" />
                        </div>
                    </div>

                    {/* Definition Body */}
                    <p className="text-gray-400 text-sm leading-relaxed mb-6 border-l-2 border-white/10 pl-3">
                        {category.definition}
                    </p>

                    {/* Footer: Ingredients Preview */}
                    <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center -space-x-3 pl-1">
                            {/* On affiche les 4 premiers ingrédients en mini bulles */}
                            {category.topIngredients.slice(0, 4).map((ing, i) => (
                                <div key={i} className="w-9 h-9 rounded-full border-2 border-[#1A1A1A] bg-gray-800 overflow-hidden relative shadow-md">
                                    {ing.image ? (
                                        <img src={ing.image} alt="" className="w-full h-full object-cover opacity-80" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[10px]">🍽️</div>
                                    )}
                                </div>
                            ))}
                            {category.topIngredients.length > 4 && (
                                <div className="w-9 h-9 rounded-full border-2 border-[#1A1A1A] bg-[#252525] flex items-center justify-center text-[10px] text-gray-400 font-bold shadow-md">
                                    +{category.topIngredients.length - 4}
                                </div>
                            )}
                        </div>
                        <span className="text-xs font-medium text-gray-600 group-hover:text-white transition-colors flex items-center gap-1">
                            Voir le détail <ArrowRight className="w-3 h-3" />
                        </span>
                    </div>

                  </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* --- MODALE 1 : TIP DU JOUR (Slide Right) --- */}
      <AnimatePresence>
        {showTip && (
          <motion.div 
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[100] bg-[#0a0a0a] text-white flex flex-col overflow-hidden"
          >
             <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black pointer-events-none" />
             
             {/* Header */}
             <div className="relative z-10 p-6 pt-8 flex items-center justify-between">
                <button 
                  onClick={() => setShowTip(false)}
                  className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors backdrop-blur-md border border-white/5"
                >
                  <ArrowRight className="w-6 h-6 rotate-180" />
                </button>
             </div>

             <div className="relative z-10 px-6 mt-4 flex-1 overflow-y-auto pb-24">
                <span className="text-6xl mb-6 block drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">💡</span>
                <span className="text-[#C1FB00] font-bold tracking-widest uppercase text-sm mb-2 block">
                    Le Conseil du jour
                </span>
                <h2 className="text-3xl font-bold leading-tight mb-8">
                    {dailyTip.title}
                </h2>
                
                <div className="bg-[#1A1A1A]/80 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl">
                    <p className="text-xl font-medium text-white mb-6 leading-relaxed border-b border-white/10 pb-6">
                       {dailyTip.summary.replace(/\*\*/g, '')}
                    </p>
                    <div 
                        className="text-gray-300 space-y-5 leading-relaxed text-lg"
                        dangerouslySetInnerHTML={{ __html: dailyTip.longContent }}
                    />
                </div>
             </div>

             {dailyCategory && (
               <div className="relative z-10 p-6 bg-gradient-to-t from-black via-black/90 to-transparent">
                 <button
                    onClick={() => { setShowTip(false); setSelectedCategoryId(dailyCategory.id); }}
                    className="w-full py-4 rounded-2xl font-bold text-black flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-[0_0_20px_rgba(0,0,0,0.4)]"
                    style={{ backgroundColor: dailyCategory.themeColor }}
                 >
                    {dailyCategory.icon} Voir {dailyCategory.title}
                 </button>
               </div>
             )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- MODALE 2 : DÉTAIL CATÉGORIE (Slide Right) --- */}
      <AnimatePresence>
        {selectedCategoryId && selectedCategory && (
            <motion.div 
                initial={{ opacity: 0, x: "100%" }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed inset-0 z-[110] bg-[#0a0a0a] flex flex-col overflow-hidden"
            >
                {/* Header */}
                <div className="relative p-6 pt-10 pb-8 shrink-0 border-b border-white/5 overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${selectedCategory.gradient} opacity-20 blur-2xl`} />
                    
                    <button 
                        onClick={() => setSelectedCategoryId(null)}
                        className="absolute top-8 right-6 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors backdrop-blur-md z-20"
                    >
                        <X className="w-6 h-6 text-white" />
                    </button>

                    <div className="relative z-10 flex items-center gap-5 mt-4">
                        <span className="text-6xl drop-shadow-lg">{selectedCategory.icon}</span>
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-1">
                                {selectedCategory.title}
                            </h2>
                            <p className="text-sm font-bold tracking-widest uppercase opacity-80" style={{ color: selectedCategory.themeColor }}>
                                {selectedCategory.subtitle}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 pb-24 space-y-8 bg-[#0a0a0a]">
                    
                    {/* Bloc Science */}
                    <div className="bg-[#161616] p-6 rounded-3xl border border-white/5 relative overflow-hidden">
                         <div className="absolute top-0 right-0 w-32 h-32 bg-[#F57BFF] opacity-5 blur-[80px] rounded-full pointer-events-none" />
                         <h3 className="flex items-center gap-2 font-bold text-[#F57BFF] mb-3 text-sm uppercase tracking-wide">
                            <BookOpen className="w-4 h-4" /> La Science
                         </h3>
                         <p className="text-gray-300 leading-relaxed text-sm">
                            {selectedCategory.details.science}
                         </p>
                    </div>

                    {/* Bloc Timing */}
                    <div className="bg-[#161616] p-6 rounded-3xl border border-white/5 relative overflow-hidden">
                         <div className="absolute top-0 right-0 w-32 h-32 bg-[#C1FB00] opacity-5 blur-[80px] rounded-full pointer-events-none" />
                         <h3 className="flex items-center gap-2 font-bold text-[#C1FB00] mb-3 text-sm uppercase tracking-wide">
                            <Clock className="w-4 h-4" /> Quand Manger ?
                         </h3>
                         <p className="text-gray-300 leading-relaxed text-sm">
                            {selectedCategory.details.timing}
                         </p>
                    </div>

                    {/* Liste Aliments */}
                    <div>
                         <div className="flex items-center justify-between mb-4 px-2">
                             <h3 className="flex items-center gap-2 font-bold text-[#00F65C] uppercase text-sm tracking-wide">
                                <Flame className="w-4 h-4" /> Les Aliments
                             </h3>
                             <span className="text-xs bg-[#1A1A1A] px-3 py-1 rounded-full text-gray-400 font-medium border border-white/10">
                                {selectedCategory.topIngredients.length} choix
                             </span>
                         </div>
                         
                         <div className="grid grid-cols-1 gap-3">
                            {selectedCategory.topIngredients.map((ing) => (
                                <div key={ing.id} className="flex items-center gap-4 p-3 bg-[#161616] rounded-2xl border border-white/5 shadow-sm hover:bg-[#1A1A1A] transition-colors">
                                    <div className="w-16 h-16 rounded-xl bg-gray-900 overflow-hidden flex-shrink-0 relative border border-white/5">
                                        {ing.image ? (
                                            <img src={ing.image} className="w-full h-full object-cover opacity-90" alt={ing.name}/>
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-2xl">🍽️</div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg text-white">{ing.name}</p>
                                        <div className="flex gap-3 text-xs text-gray-400 mt-1">
                                            <span>🔥 {ing.calories} kcal</span>
                                            {ing.proteins && <span>💪 {ing.proteins}g P</span>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                         </div>
                    </div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}