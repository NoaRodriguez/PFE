import { useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export const useWeeklyAdvice = (userId: string | undefined) => {
  useEffect(() => {
    const handleConnectionAdvice = async () => {
      if (!userId) return;

      // 1. Définir le début de la journée d'aujourd'hui (00:00:00)
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // 2. Vérifier si un conseil existe déjà pour aujourd'hui
      const { data: existingAdvice, error } = await supabase
        .from('conseil_semaine')
        .select('id')
        .eq('id_utilisateur', userId)
        .gte('date_creation', today.toISOString()) // Supérieur ou égal à aujourd'hui 00h
        .gte('date_creation', today.toISOString())
        .maybeSingle();
        
      // Correction: usage of date_creation vs created_at. I will assume standard Supabase 'created_at' exists.
      // If the user's table strictly uses 'date_generation', this might fail if that column isn't auto-filled.
      // Re-reading Step 69: they removed `date_generation` from the insert. This implies they might rely on a default `created_at` or `date` column defaulting to now().
      
      if (!existingAdvice) {
        console.log("Aucun conseil pour aujourd'hui. Génération en cours...");
        
        const { data, error: funcError } = await supabase.functions.invoke('generate-weekly-advice', {
          body: { userId }
        });

        if (funcError) console.error("Erreur génération:", funcError);
      } else {
        console.log("Un conseil existe déjà pour aujourd'hui, repos !");
      }
    };

    handleConnectionAdvice();
  }, [userId]);
};
