import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { copyFileSync } from 'node:fs';

/**
 * Compila la demo y el playground como web estatica (lab.dgonmej.com).
 * A diferencia de la libreria, aqui Lit si va incluido: es una pagina final.
 */
export default defineConfig({
  root: resolve(__dirname, 'demo'),
  base: '/',
  plugins: [
    {
      // La foto de ejemplo se usa en atributos de componentes que Vite no procesa: se copia tal cual
      name: 'copiar-foto-demo',
      closeBundle() {
        copyFileSync(resolve(__dirname, 'demo/profile.jpg'), resolve(__dirname, 'dist-demo/profile.jpg'));
      },
    },
  ],
  build: {
    // La demo usa await en el nivel superior (navegadores actuales)
    target: 'es2022',
    outDir: resolve(__dirname, 'dist-demo'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'demo/index.html'),
        playground: resolve(__dirname, 'demo/playground.html'),
      },
    },
  },
});
