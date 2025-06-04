import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { fileURLToPath } from 'url';
import path from 'path';

// Obtenez __dirname dans un module ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  // Obtenez le chemin absolu du répertoire de travail actuel
  const root = path.resolve(__dirname, '..');

  // Charger les variables d'environnement en fonction du mode
  const env = loadEnv(mode, root, '');

  return {
    plugins: [react()],
    base: env.VITE_BASE_PATH || '/PishaGaming',
  };
});
