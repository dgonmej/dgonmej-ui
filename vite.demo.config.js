import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { copyFileSync, mkdirSync } from 'node:fs';

/**
 * Compila la demo y el playground como web estatica (ui.dgonmej.com).
 * A diferencia de la libreria, aqui Lit si va incluido: es una pagina final.
 */
export default defineConfig({
  root: resolve(__dirname, 'demo'),
  base: '/',
  plugins: [
    {
      // Los recursos de ejemplo (avatar, audio y portada) se usan en atributos de componentes que
      // Vite no procesa: se copian tal cual
      name: 'copiar-recursos-demo',
      closeBundle() {
        const out = resolve(__dirname, 'dist-demo');
        mkdirSync(resolve(out, 'audio'), { recursive: true });
        for (const f of ['avatar.png', 'audio/sample.m4a', 'audio/cover.jpg']) copyFileSync(resolve(__dirname, 'demo', f), resolve(out, f));
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
