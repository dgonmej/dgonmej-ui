import { LitElement, html, css } from 'lit';

/**
 * Plantilla de referencia para componentes de dgonmej-ui.
 * Copiar a src/components/<nombre>/dgonmej-ui-<nombre>.js y renombrar.
 * Ejemplo real y completo: src/components/button/dgonmej-ui-button.js.
 * Los fallbacks de var() coinciden con el valor claro de src/tokens/tokens.css.
 *
 * <dgonmej-ui-example variant="filled|tinted|glass" disabled>
 * Evento: 'ui-press' (CustomEvent, sin detail)
 * Parts: 'control'
 */
export class DgonmejUiExample extends LitElement {
  static properties = {
    variant: { type: String, reflect: true },
    disabled: { type: Boolean, reflect: true },
  };

  static styles = css`
    :host {
      display: inline-block;
      font-family: var(--ui-font-family, -apple-system, BlinkMacSystemFont, system-ui, sans-serif);
      /* Tokens de movimiento con fallback: curva tipo iOS */
      --_ease: var(--ui-ease-standard, cubic-bezier(0.32, 0.72, 0, 1));
      --_dur: var(--ui-duration-fast, 160ms);
    }

    .control {
      font: inherit;
      font-size: var(--ui-font-size-body, 1.0625rem);
      font-weight: 600;
      letter-spacing: -0.01em;
      min-height: var(--ui-control-height, 44px); /* objetivo tactil minimo */
      padding: 0 var(--ui-space-4, 16px);
      border-radius: var(--ui-radius-pill, 999px);
      border: 1px solid transparent;
      cursor: pointer;
      transition:
        transform var(--_dur) var(--_ease),
        box-shadow var(--_dur) var(--_ease),
        background-color var(--_dur) var(--_ease),
        opacity var(--_dur) ease-out;
    }

    /* filled: acento con gradiente sutil de colores vecinos y brillo superior */
    :host([variant='filled']) .control {
      color: var(--ui-color-primary-contrast, #fff);
      background:
        linear-gradient(180deg, rgb(255 255 255 / 0.18), rgb(255 255 255 / 0) 55%),
        var(--ui-gradient-primary, linear-gradient(180deg, #0071e3 0%, #005bbf 100%));
      box-shadow:
        0 1px 2px rgb(0 0 0 / 0.12),
        0 6px 16px -6px var(--ui-color-primary-glow, rgb(0 113 227 / 0.4));
    }

    /* tinted: fondo del acento a baja opacidad */
    :host([variant='tinted']) .control {
      color: var(--ui-color-primary, #0066cc);
      background: var(--ui-color-primary-tint, rgb(0 113 227 / 0.12));
    }

    /* glass: material translucido para controles flotantes sobre contenido */
    :host([variant='glass']) .control {
      color: var(--ui-material-text, #1d1d1f);
      background: var(--ui-material-bg, rgb(250 250 252 / 0.94));
      border-color: var(--ui-material-border, rgb(255 255 255 / 0.55));
      box-shadow: 0 8px 24px -8px rgb(0 0 0 / 0.2);
    }
    @supports (backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)) {
      :host([variant='glass']) .control {
        background: var(--ui-material-bg-translucent, rgb(255 255 255 / 0.6));
        -webkit-backdrop-filter: blur(20px) saturate(180%);
        backdrop-filter: blur(20px) saturate(180%);
      }
    }

    @media (hover: hover) {
      .control:hover:not(:disabled) {
        transform: translateY(-1px);
      }
    }

    .control:active:not(:disabled) {
      transform: scale(0.97);
    }

    .control:focus-visible {
      outline: 2px solid var(--ui-color-focus, #0071e3);
      outline-offset: 3px;
    }

    .control:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    @media (prefers-reduced-motion: reduce) {
      .control {
        transition: background-color var(--_dur) linear, opacity var(--_dur) linear;
      }
      .control:hover:not(:disabled),
      .control:active:not(:disabled) {
        transform: none;
      }
    }
  `;

  constructor() {
    super();
    this.variant = 'filled';
    this.disabled = false;
  }

  render() {
    return html`
      <button part="control" class="control" ?disabled=${this.disabled} @click=${this._onPress}>
        <slot></slot>
      </button>
    `;
  }

  _onPress(e) {
    if (this.disabled) {
      e.stopImmediatePropagation();
      return;
    }
    this.dispatchEvent(new CustomEvent('ui-press', { bubbles: true, composed: true }));
  }
}

customElements.define('dgonmej-ui-example', DgonmejUiExample);
