import { css } from 'lit';

/*
 * Estilos compartidos entre componentes. Se combinan con los propios:
 *   static styles = [hostBase, material, css`...`];
 * Los fallbacks coinciden con el valor claro de src/tokens/tokens.css.
 */

/* Tipografia y variables de movimiento comunes */
export const hostBase = css`
  :host {
    font-family: var(--ui-font-family, -apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif);
    -webkit-font-smoothing: antialiased;
    --_ease: var(--ui-ease-standard, cubic-bezier(0.32, 0.72, 0, 1));
    --_fast: var(--ui-duration-fast, 160ms);
    --_base: var(--ui-duration-base, 260ms);
    --_slow: var(--ui-duration-slow, 400ms);
    --_focus: var(--ui-color-focus, #0071e3);
  }
  [hidden] {
    display: none !important;
  }
`;

/* Material translucido para controles flotantes, con fallback opaco */
export const material = css`
  .material {
    color: var(--ui-material-text, #1d1d1f);
    background: var(--ui-material-bg, rgb(250 250 252 / 0.94));
    border: 1px solid var(--ui-material-border, rgb(255 255 255 / 0.55));
  }
  @supports (backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)) {
    .material {
      background: var(--ui-material-bg-translucent, rgb(255 255 255 / 0.6));
      -webkit-backdrop-filter: var(--ui-material-blur, blur(20px) saturate(180%));
      backdrop-filter: var(--ui-material-blur, blur(20px) saturate(180%));
    }
  }
`;

/* Texto solo para lectores de pantalla */
export const srOnly = css`
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
    border: 0;
  }
`;
