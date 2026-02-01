import React, { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import { nutritionCategories, dailyTip, weeklyTip } from '../data/nutritionCategories';
import { 
  ArrowLeft, ArrowRight, BookOpen, Clock, Flame, ChevronRight, 
  Drumstick, Fish, Egg, Wheat, Carrot, Apple, Leaf, Milk, Droplets, Utensils,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const getIngredientIcon = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes('poulet') || lower.includes('dinde') || lower.includes('viande') || lower.includes('boeuf')) return Drumstick;
  if (lower.includes('poisson') || lower.includes('thon') || lower.includes('saumon') || lower.includes('sardine') || lower.includes('maquereau')) return Fish;
  if (lower.includes('oeuf')) return Egg;
  if (lower.includes('riz') || lower.includes('pates') || lower.includes('pâtes') || lower.includes('pain') || lower.includes('avoine') || lower.includes('quinoa') || lower.includes('blé')) return Wheat;
  if (lower.includes('lait') || lower.includes('fromage') || lower.includes('yaourt') || lower.includes('whey')) return Milk;
  if (lower.includes('carotte') || lower.includes('brocoli') || lower.includes('légume') || lower.includes('epinard') || lower.includes('concombre')) return Carrot;
  if (lower.includes('pomme') || lower.includes('banane') || lower.includes('fruit') || lower.includes('datte') || lower.includes('citron')) return Apple;
  if (lower.includes('huile') || lower.includes('eau')) return Droplets;
  if (lower.includes('avocat') || lower.includes('noix') || lower.includes('amande') || lower.includes('chia') || lower.includes('tofu')) return Leaf;
  return Utensils;
};

// AJOUT DE returnTo DANS LES PROPS
export default function AdvicePage({ onNavigate, initialCategoryId, returnTo }: { onNavigate: (page: string) => void, initialCategoryId?: string, returnTo?: string }) {
  const [showTip, setShowTip] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  useEffect(() => {
    if (initialCategoryId) {
      setSelectedCategoryId(initialCategoryId);
    }
  }, [initialCategoryId]);

  const selectedCategory = nutritionCategories.find(c => c.id === selectedCategoryId);
  const dailyCategory = nutritionCategories.find(c => c.id === dailyTip.categoryLink);

  // LOGIQUE DE RETOUR INTELLIGENTE
  const handleCloseModal = () => {
    // Si on vient du dashboard, on y retourne directement
    if (returnTo === 'dashboard') {
      onNavigate('dashboard');
    } else {
      // Sinon, comportement normal : on ferme juste la modale
      setSelectedCategoryId(null);
    }
  };

  return (
    <div className="pb-24 px-4 max-w-md mx-auto min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-white overflow-x-hidden transition-colors duration-300">
      
      <PageHeader title="Centre Nutrition" subtitle="Performance & Santé" />

      {/* ... (Reste de l'affichage principal inchangé) ... */}
      {/* Je ne remets pas tout le code du corps de page pour rester concis, 
          le seul changement important est dans le composant Modal ci-dessous */}

      <div className="space-y-8 mt-4 relative z-0">
        
        {/* CONSEIL SEMAINE */}
        <div className="relative overflow-hidden rounded-[2rem] bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-6 shadow-xl dark:shadow-2xl group transition-all">
           <div className="absolute -top-10 -right-10 w-48 h-48 bg-[#00F65C] opacity-10 dark:opacity-20 blur-[80px] rounded-full pointer-events-none group-hover:opacity-20 dark:group-hover:opacity-30 transition-opacity duration-500" />
           
           <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                 <weeklyTip.icon className="w-5 h-5 text-[#00F65C]" />
                 <span className="text-xs font-bold uppercase tracking-widest text-[#00F65C] bg-[#00F65C]/10 px-2 py-1 rounded">
                   {weeklyTip.subtitle}
                 </span>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
                 {weeklyTip.title}
              </h2>
              <p className="text-gray-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
                 {weeklyTip.content}
              </p>

              <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-slate-300 font-medium bg-gray-100 dark:bg-slate-800 w-fit px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700/50 shadow-sm">
                 Objectif : Régularité
              </div>
           </div>
        </div>

        {/* CONSEIL DU JOUR */}
        <div 
          onClick={() => setShowTip(true)}
          className="relative overflow-hidden rounded-[2rem] bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-6 shadow-lg dark:shadow-xl cursor-pointer group active:scale-[0.98] transition-all hover:border-[#C1FB00]/30"
        >
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#C1FB00] opacity-10 blur-[60px] rounded-full pointer-events-none group-hover:opacity-25 transition-opacity duration-500" />
            
            <div className="relative z-10">
                 <div className="flex items-center gap-2 mb-3">
                    <div className="bg-[#C1FB00]/10 p-2 rounded-lg border border-[#C1FB00]/20">
                        <Zap className="w-4 h-4 text-gray-900 dark:text-[#C1FB00]" />
                    </div>
                    <span className="text-gray-900 dark:text-[#C1FB00] text-xs font-bold uppercase tracking-widest">
                      Conseil du jour
                    </span>
                 </div>

                 <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
                    {dailyTip.title}
                 </h3>
                 
                 <p className="text-gray-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
                    {dailyTip.summary.replace(/\*\*/g, '')}
                 </p>
                 
                 <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-gray-100 dark:bg-[#C1FB00]/10 text-gray-900 dark:text-[#C1FB00] border border-gray-200 dark:border-[#C1FB00]/20 px-4 py-2.5 rounded-xl group-hover:bg-gray-200 dark:group-hover:bg-[#C1FB00]/20 transition-colors">
                    Lire la suite <ArrowRight className="w-3 h-3" />
                 </button>
            </div>
        </div>

        {/* LISTE DES PILIERS */}
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
                className="cursor-pointer relative rounded-[2rem] bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 z-10 overflow-hidden shadow-lg group hover:border-gray-300 dark:hover:border-slate-700 transition-all duration-300"
                style={{ borderColor: 'transparent' }} 
              >
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-5 transition-opacity group-hover:opacity-15`} />
                  <div 
                    className="absolute inset-0 border-2 border-transparent rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{ borderColor: `${category.themeColor}40` }}
                  />

                  <div className="relative p-6 z-10">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <span 
                                className="text-3xl p-3 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm transition-transform group-hover:scale-105 bg-gray-50 dark:bg-transparent"
                                style={{ backgroundColor: `rgba(var(--theme-rgb), 0.1)` }}
                            >
                                <category.icon 
                                    className="w-8 h-8" 
                                    style={{ color: category.themeColor }} 
                                    strokeWidth={1.5} 
                                />
                            </span>
                            <div>
                                <h4 className="font-bold text-lg text-gray-900 dark:text-white leading-tight">
                                    {category.title}
                                </h4>
                                <span 
                                    className="text-[10px] font-bold tracking-widest uppercase opacity-90" 
                                    style={{ color: category.themeColor }}
                                >
                                    {category.subtitle}
                                </span>
                            </div>
                        </div>
                        <div className="p-2 bg-gray-100 dark:bg-slate-800 rounded-full text-gray-500 dark:text-slate-500 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                             <ChevronRight className="w-5 h-5" />
                        </div>
                    </div>

                    <p className="text-gray-600 dark:text-slate-400 text-sm leading-relaxed mb-6 border-l-2 border-gray-200 dark:border-slate-800 pl-3 group-hover:border-gray-300 dark:group-hover:border-slate-700 transition-colors">
                        {category.definition}
                    </p>

                    <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center -space-x-2 pl-1">
                            {category.topIngredients.slice(0, 4).map((ing, i) => {
                                const Icon = getIngredientIcon(ing.name);
                                return (
                                    <div 
                                        key={i} 
                                        className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-gray-100 dark:bg-slate-800 flex items-center justify-center relative shadow-sm"
                                        style={{ color: category.themeColor }}
                                    >
                                        <Icon className="w-3.5 h-3.5 opacity-80" />
                                    </div>
                                );
                            })}
                            {category.topIngredients.length > 4 && (
                                <div className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-[9px] text-gray-500 dark:text-slate-400 font-bold shadow-sm">
                                    +{category.topIngredients.length - 4}
                                </div>
                            )}
                        </div>
                        <span 
                            className="text-xs font-medium text-gray-500 transition-colors flex items-center gap-1"
                            style={{ color: `${category.themeColor}` }}
                        >
                            Détails <ArrowRight className="w-3 h-3" />
                        </span>
                    </div>

                  </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showTip && (
          <motion.div 
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[100] bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-white flex flex-col overflow-hidden"
          >
             <div className="relative z-10 p-6 pt-8 flex items-center justify-between border-b border-gray-200 dark:border-slate-800/50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
                <button 
                  onClick={() => setShowTip(false)}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-slate-900 rounded-xl hover:bg-gray-200 dark:hover:bg-slate-800 transition-colors border border-gray-200 dark:border-slate-800 text-sm font-bold text-gray-700 dark:text-slate-300"
                >
                  <ArrowLeft className="w-4 h-4" /> Retour
                </button>
             </div>

             <div className="relative z-10 px-6 mt-6 flex-1 overflow-y-auto pb-24">
                <div className="flex items-center gap-3 mb-6">
                    <span className="text-4xl p-3 bg-[#C1FB00]/10 rounded-2xl border border-[#C1FB00]/20">💡</span>
                    <div>
                        <span className="text-[#C1FB00] font-bold tracking-widest uppercase text-xs mb-1 block">
                            Conseil du jour
                        </span>
                        <h2 className="text-2xl font-bold leading-tight text-gray-900 dark:text-white">
                            {dailyTip.title}
                        </h2>
                    </div>
                </div>
                
                <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-gray-200 dark:border-slate-800 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#C1FB00] opacity-5 blur-[60px] pointer-events-none" />
                    <p className="text-lg font-medium text-gray-900 dark:text-white mb-6 leading-relaxed border-b border-gray-100 dark:border-slate-800 pb-6">
                       {dailyTip.summary.replace(/\*\*/g, '')}
                    </p>
                    <div 
                        className="text-gray-600 dark:text-slate-400 space-y-5 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: dailyTip.longContent }}
                    />
                </div>
             </div>

             {dailyCategory && (
               <div className="relative z-10 p-6 bg-gradient-to-t from-white dark:from-slate-950 via-white/95 dark:via-slate-950/95 to-transparent">
                 <button
                    onClick={() => { setShowTip(false); setSelectedCategoryId(dailyCategory.id); }}
                    className="w-full py-4 rounded-2xl font-bold text-black flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg hover:brightness-110"
                    style={{ backgroundColor: dailyCategory.themeColor }}
                 >
                    <dailyCategory.icon className="w-5 h-5" /> Voir {dailyCategory.title}
                 </button>
               </div>
             )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedCategoryId && selectedCategory && (
            <motion.div 
                initial={{ opacity: 0, x: "100%" }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed inset-0 z-[110] bg-gray-50 dark:bg-slate-950 flex flex-col overflow-hidden"
            >
                <div className="relative p-6 pt-10 pb-6 shrink-0 border-b border-gray-200 dark:border-slate-800/50 bg-gray-50 dark:bg-slate-950 z-20 flex items-center justify-between">
                     {/* BOUTON RETOUR : Utilise la nouvelle logique */}
                     <button 
                        onClick={handleCloseModal}
                        className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-900 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors border border-gray-200 dark:border-slate-800 text-sm font-bold text-gray-700 dark:text-slate-300"
                    >
                        <ArrowLeft className="w-4 h-4" /> Retour
                    </button>
                    
                    <span 
                        className="text-[10px] font-bold tracking-widest uppercase px-2 py-1 bg-white dark:bg-slate-900 rounded border border-gray-200 dark:border-slate-800"
                        style={{ color: selectedCategory.themeColor }}
                    >
                        {selectedCategory.subtitle}
                    </span>
                </div>

                <div className="flex-1 overflow-y-auto p-6 pb-24 space-y-8 bg-gray-50 dark:bg-slate-950 relative">
                    <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${selectedCategory.gradient} opacity-10 blur-[80px] pointer-events-none`} />

                    <div>
                         <div className="flex items-center gap-4 mb-4">
                            <span 
                                className="text-5xl drop-shadow-lg p-3 rounded-3xl border border-gray-200 dark:border-white/5 bg-white dark:bg-transparent"
                            >
                                <selectedCategory.icon 
                                    className="w-10 h-10" 
                                    style={{ color: selectedCategory.themeColor }}
                                    strokeWidth={1.5} 
                                />
                            </span>
                            <h2 
                                className="text-3xl font-bold leading-tight text-gray-900 dark:text-white"
                            >
                                {selectedCategory.title}
                            </h2>
                         </div>
                         <p className="text-gray-600 dark:text-slate-400 leading-relaxed border-l-2 pl-4" style={{ borderColor: selectedCategory.themeColor }}>
                             {selectedCategory.definition}
                         </p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-gray-200 dark:border-slate-800 relative overflow-hidden shadow-sm">
                         <h3 className="flex items-center gap-2 font-bold text-[#F57BFF] mb-3 text-sm uppercase tracking-wide">
                            <BookOpen className="w-4 h-4" /> La Science
                         </h3>
                         <p className="text-gray-600 dark:text-slate-300 leading-relaxed text-sm">
                            {selectedCategory.details.science}
                         </p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-gray-200 dark:border-slate-800 relative overflow-hidden shadow-sm">
                         <h3 className="flex items-center gap-2 font-bold text-[#C1FB00] mb-3 text-sm uppercase tracking-wide">
                            <Clock className="w-4 h-4" /> Quand Manger ?
                         </h3>
                         <p className="text-gray-600 dark:text-slate-300 leading-relaxed text-sm">
                            {selectedCategory.details.timing}
                         </p>
                    </div>

                    <div>
                         <div className="flex items-center justify-between mb-4 px-1">
                             <h3 className="flex items-center gap-2 font-bold text-[#00F65C] uppercase text-sm tracking-wide">
                                <Flame className="w-4 h-4" /> Top Aliments
                             </h3>
                             <span className="text-xs bg-white dark:bg-slate-900 px-3 py-1 rounded-full text-gray-500 dark:text-slate-500 font-medium border border-gray-200 dark:border-slate-800">
                                {selectedCategory.topIngredients.length} choix
                             </span>
                         </div>
                         
                         <div className="grid grid-cols-1 gap-3">
                            {selectedCategory.topIngredients.map((ing) => {
                                const Icon = getIngredientIcon(ing.name);
                                return (
                                    <div key={ing.id} className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm hover:border-gray-300 dark:hover:border-slate-700 transition-colors">
                                        <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-slate-950 flex items-center justify-center flex-shrink-0 relative border border-gray-200 dark:border-slate-800">
                                            <Icon 
                                                className="w-7 h-7" 
                                                strokeWidth={1.5} 
                                                style={{ color: selectedCategory.themeColor }}
                                            />
                                        </div>
                                        
                                        <div className="flex-1">
                                            <p className="font-bold text-lg text-gray-900 dark:text-white mb-1">{ing.name}</p>
                                            
                                            <div className="flex items-center gap-3 text-xs font-medium text-gray-500 dark:text-slate-500">
                                                <span 
                                                    className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#00F65C]/10"
                                                    style={{ color: '#00F65C' }}
                                                >
                                                    P: {ing.proteins || 0}g
                                                </span>
                                                <span 
                                                    className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#C1FB00]/10"
                                                    style={{ color: '#A0D000' }}
                                                >
                                                    <span className="dark:text-[#C1FB00] text-[#7da300]">G: {ing.carbs || 0}g</span>
                                                </span>
                                                <span 
                                                    className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#F57BFF]/10"
                                                    style={{ color: '#F57BFF' }}
                                                >
                                                    <span className="dark:text-[#F57BFF] text-[#c04ec9]">L: {ing.fats || 0}g</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                         </div>
                    </div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}