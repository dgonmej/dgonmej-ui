import { LitElement, html, css } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

/**
 * <dgonmej-ui-button variant="primary|secondary|danger|ghost|glass" size="small|medium|large" block icon label="..." disabled>
 * - primary/danger: relleno con gradiente; secondary: tintado; ghost: solo texto;
 *   glass: material translucido para controles flotantes sobre contenido.
 * - size: small (32px, para zonas densas con puntero), medium (44px), large (52px).
 * - block: ocupa todo el ancho disponible.
 * - icon: boton circular para un solo icono (usar `label` como nombre accesible).
 * - href: se comporta como enlace (genera un <a>); `target` opcional. Con `disabled` el
 *   enlace queda inactivo. Sigue emitiendo 'ui-click'.
 * - current: se reenvia como aria-current (p. ej. current="page" en la navegacion).
 * - expanded / haspopup: se reenvian como aria-expanded / aria-haspopup al <button> interno
 *   (los usa dgonmej-ui-menu cuando el boton es su disparador).
 * Evento: 'ui-click' (CustomEvent, sin detail)
 * Parts: 'control'
 */
export class DgonmejUiButton extends LitElement {
  static properties = {
    variant: { type: String, reflect: true },
    disabled: { type: Boolean, reflect: true },
    icon: { type: Boolean, reflect: true },
    label: { type: String },
    size: { type: String, reflect: true },
    block: { type: Boolean, reflect: true },
    href: { type: String },
    target: { type: String },
    current: { type: String, reflect: true },
    expanded: { type: String },
    haspopup: { type: String },
  };

  static styles = css`
    :host {
      display: inline-block;
      font-family: var(--ui-font-family, -apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif);
      --_ease: var(--ui-ease-standard, cubic-bezier(0.32, 0.72, 0, 1));
      --_dur: var(--ui-duration-fast, 160ms);
    }

    .control {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--ui-space-2, 8px);
      box-sizing: border-box;
      min-height: var(--ui-control-height, 44px);
      padding: 0 var(--ui-space-5, 20px);
      font: inherit;
      font-size: var(--ui-font-size-body, 1.0625rem);
      font-weight: 600;
      letter-spacing: -0.01em;
      border-radius: var(--ui-radius-control, 999px);
      border: 1px solid transparent;
      color: var(--ui-color-primary, #0066cc);
      background: transparent;
      cursor: pointer;
      text-decoration: none;
      white-space: nowrap;
      -webkit-tap-highlight-color: transparent;
      transition:
        transform var(--_dur) var(--_ease),
        box-shadow var(--_dur) var(--_ease),
        background-color var(--_dur) var(--_ease),
        filter var(--_dur) var(--_ease),
        opacity var(--_dur) ease-out;
    }

    :host([block]) {
      display: block;
      width: 100%;
    }

    :host([block]) .control {
      width: 100%;
    }

    :host([size='small']) .control {
      min-height: 32px;
      padding: 0 var(--ui-space-3, 12px);
      font-size: var(--ui-font-size-subhead, 0.9375rem);
    }

    :host([size='large']) .control {
      min-height: 52px;
      padding: 0 var(--ui-space-6, 24px);
      font-size: var(--ui-font-size-title3, 1.25rem);
    }

    :host([icon]) .control {
      width: var(--ui-control-height, 44px);
      padding: 0;
    }

    :host([icon][size='small']) .control {
      width: 32px;
    }

    :host([icon][size='large']) .control {
      width: 52px;
    }

    /* Relleno con gradiente + brillo superior */
    :host([variant='primary']) .control,
    :host([variant='danger']) .control {
      color: var(--ui-color-primary-contrast, #fff);
      background:
        var(--ui-gradient-sheen, linear-gradient(180deg, rgb(255 255 255 / 0.22) 0%, rgb(255 255 255 / 0) 55%)),
        var(--ui-gradient-primary, linear-gradient(180deg, #0071e3 0%, #005bbf 100%));
      box-shadow:
        inset 0 1px 0 rgb(255 255 255 / 0.18),
        0 1px 2px rgb(0 0 0 / 0.12),
        0 6px 16px -6px var(--ui-color-primary-glow, rgb(0 113 227 / 0.4));
    }

    :host([variant='danger']) .control {
      background:
        var(--ui-gradient-sheen, linear-gradient(180deg, rgb(255 255 255 / 0.22) 0%, rgb(255 255 255 / 0) 55%)),
        var(--ui-gradient-danger, linear-gradient(180deg, #d92d24 0%, #b8131a 100%));
      box-shadow:
        inset 0 1px 0 rgb(255 255 255 / 0.18),
        0 1px 2px rgb(0 0 0 / 0.12),
        0 6px 16px -6px var(--ui-color-danger-glow, rgb(196 0 26 / 0.35));
    }

    /* Tintado: fondo del acento a baja opacidad */
    :host([variant='secondary']) .control {
      background: var(--ui-color-primary-tint, rgb(0 113 227 / 0.12));
    }

    :host([variant='ghost']) .control {
      padding-inline: var(--ui-space-3, 12px);
    }

    /* Material translucido (fallback opaco si no hay backdrop-filter) */
    :host([variant='glass']) .control {
      color: var(--ui-material-text, #1d1d1f);
      background: var(--ui-material-bg, rgb(250 250 252 / 0.94));
      border-color: var(--ui-material-border, rgb(255 255 255 / 0.55));
      box-shadow: var(--ui-shadow-md, 0 1px 3px rgb(0 0 0 / 0.06), 0 8px 24px -8px rgb(0 0 0 / 0.14));
    }
    @supports (backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)) {
      :host([variant='glass']) .control {
        background: var(--ui-material-bg-translucent, rgb(255 255 255 / 0.6));
        -webkit-backdrop-filter: var(--ui-material-blur, blur(20px) saturate(180%));
        backdrop-filter: var(--ui-material-blur, blur(20px) saturate(180%));
      }
    }

    @media (hover: hover) {
      :host([variant='primary']) .control:hover:not(:disabled),
      :host([variant='danger']) .control:hover:not(:disabled) {
        filter: brightness(1.06);
      }
      :host([variant='secondary']) .control:hover:not(:disabled),
      :host([variant='ghost']) .control:hover:not(:disabled) {
        background-color: var(--ui-color-fill, rgb(120 120 128 / 0.12));
      }
    }

    .control:active:not(:disabled) {
      transform: scale(0.97);
    }

    .control:focus-visible {
      outline: 2px solid var(--ui-color-focus, #0071e3);
      outline-offset: 3px;
    }

    .control:disabled,
    .control[aria-disabled='true'] {
      opacity: 0.4;
      cursor: not-allowed;
      box-shadow: none;
    }

    ::slotted(svg) {
      width: 20px;
      height: 20px;
      flex: none;
    }

    @media (prefers-reduced-motion: reduce) {
      .control {
        transition: background-color var(--_dur) linear, opacity var(--_dur) linear;
      }
      .control:active:not(:disabled) {
        transform: none;
      }
    }
  `;

  constructor() {
    super();
    this.variant = 'primary';
    this.size = 'medium';
    this.block = false;
    this.disabled = false;
    this.icon = false;
    this.label = '';
  }

  render() {
    if (this.href) {
      return html`
        <a
          class="control"
          part="control"
          href=${ifDefined(this.disabled ? undefined : this.href)}
          target=${ifDefined(this.target || undefined)}
          rel=${ifDefined(this.target === '_blank' ? 'noopener noreferrer' : undefined)}
          aria-label=${ifDefined(this.label || undefined)}
          aria-current=${ifDefined(this.current || undefined)}
          aria-disabled=${ifDefined(this.disabled ? 'true' : undefined)}
          role=${ifDefined(this.disabled ? 'link' : undefined)}
          @click=${this._onClick}
        >
          <slot></slot>
        </a>
      `;
    }
    return html`
      <button
        class="control"
        part="control"
        ?disabled=${this.disabled}
        aria-label=${ifDefined(this.label || undefined)}
        aria-expanded=${ifDefined(this.expanded || undefined)}
        aria-haspopup=${ifDefined(this.haspopup || undefined)}
        @click=${this._onClick}
      >
        <slot></slot>
      </button>
    `;
  }

  _onClick(e) {
    if (this.disabled) {
      e.stopImmediatePropagation();
      return;
    }
    this.dispatchEvent(new CustomEvent('ui-click', { bubbles: true, composed: true }));
  }
}

customElements.define('dgonmej-ui-button', DgonmejUiButton);
