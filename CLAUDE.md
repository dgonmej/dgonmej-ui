# dgonmej-ui

Libreria de Web Components con Lit. Ver README.md para la arquitectura (Shadow DOM, tokens `--ui-*`, prefijo `dgonmej-ui-`, eventos `ui-*`).

- Demo: `npm run dev` y abrir `/demo/` (config de preview: `dgonmej-ui-demo`).
- Direccion visual: skill global `ui-design`.
- Para crear o modificar un componente: skill `ui-component`.

## Reglas del proyecto

- Todo valor visual sale de `src/tokens/tokens.css` via `var(--ui-*, fallback)`. Nada de colores, tamanos, radios ni duraciones sueltos en los componentes.
- Si falta un token, se anade a `tokens.css` con su variante oscura (tanto en `[data-theme="dark"]` como en `prefers-color-scheme: dark`), no se inventa en el componente.
- Los fallbacks de `var()` deben coincidir con el valor claro del token, para que la libreria funcione sin importar `tokens.css`.
- Familias de tokens: `--ui-color-*`, `--ui-gradient-*`, `--ui-material-*`, `--ui-space-*`, `--ui-font-*`, `--ui-radius-*`, `--ui-shadow-*`, `--ui-ease-*`, `--ui-duration-*`.
