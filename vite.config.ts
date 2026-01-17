import { defineConfig } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url' // Ajoute cet import
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// Définir __dirname pour les modules ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  // ... le reste de ta config reste inchangé
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  envDir: './.env',
})