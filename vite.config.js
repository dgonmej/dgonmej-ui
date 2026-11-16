import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      formats: ['es'],
      fileName: () => 'dgonmej-ui.js',
    },
    rollupOptions: {
      // Lit no se empaqueta: es una dependencia y la resuelve quien instala la libreria,
      // asi una web que tambien use Lit no lo carga dos veces.
      external: [/^lit(\/|$)/, /^@lit\//],
    },
  },
});
