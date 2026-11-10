import { LitElement, html, css } from 'lit';
import { hostBase, material, srOnly } from '../../shared/styles.js';
import { renderIcon } from '../../shared/icons.js';
import { t } from '../../shared/i18n.js';

/**
 * <dgonmej-ui-tab-bar value="home" fixed icon-only label="Principal"
 *   .items=${[{ value, label, icon }]}>
 * Barra de pestanas flotante de vidrio (estilo iOS reciente), con un resaltado que se desliza.
 * `fixed` la fija abajo respetando la zona segura; sin el, se coloca en el flujo.
 * `icon` es un nombre del set de iconos (ver dgonmej-ui-icon).
 * Evento: 'ui-change' con detail = { value }
 * Parts: 'bar', 'tab', 'indicator'
 */
export class DgonmejUiTabBar extends LitElement {
  static properties = {
    value: { type: String },
    items: { type: Array },
    label: { type: String },
    fixed: { type: Boolean, reflect: true },
    iconOnly: { type: Boolean, attribute: 'icon-only', reflect: true },
  };

  static styles = [
    hostBase,
    material,
    srOnly,
    css`
      :host {
        display: flex;
        justify-content: center;
      }

      :host([fixed]) {
        position: fixed;
        z-index: 20;
        left: 0;
        right: 0;
        bottom: calc(env(safe-area-inset-bottom) + var(--ui-space-3, 12px));
        pointer-events: none;
      }

      nav {
        position: relative;
        display: grid;
        grid-auto-columns: minmax(64px, 1fr);
        grid-auto-flow: column;
        padding: 4px;
        border-radius: var(--ui-radius-control, 999px);
        box-shadow: var(--ui-shadow-lg, 0 2px 6px rgb(0 0 0 / 0.06), 0 24px 48px -16px rgb(0 0 0 / 0.22));
        pointer-events: auto;
      }

      .indicator {
        position: absolute;
        top: 4px;
        bottom: 4px;
        left: 4px;
        width: calc((100% - 8px) / var(--_count, 1));
        border-radius: max(0px, calc(var(--ui-radius-control, 999px) - 4px));
        background: var(--ui-color-primary-tint, rgb(0 113 227 / 0.12));
        transform: translateX(calc(100% * var(--_index, 0)));
        transition: transform var(--_slow) var(--_ease);
      }

      button {
        position: relative;
        z-index: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 2px;
        min-height: 52px;
        padding: 0 var(--ui-space-3, 12px);
        border: 0;
        border-radius: max(0px, calc(var(--ui-radius-control, 999px) - 4px));
        background: transparent;
        color: var(--ui-color-text-muted, #6e6e73);
        font: inherit;
        font-size: 0.6875rem;
        font-weight: 600;
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
        transition:
          color var(--_fast) ease-out,
          transform var(--_fast) var(--_ease);
      }

      :host([icon-only]) button {
        min-height: 44px;
      }

      button[aria-current='page'] {
        color: var(--ui-color-primary-text, #0066cc);
      }

      button:active {
        transform: scale(0.94);
      }

      button:focus-visible {
        outline: 2px solid var(--_focus);
        outline-offset: -2px;
      }

      @media (prefers-reduced-motion: reduce) {
        .indicator {
          transition: none;
        }
        button:active {
          transform: none;
        }
      }
    `,
  ];

  constructor() {
    super();
    this.value = '';
    this.items = [];
    this.label = '';
    this.fixed = false;
    this.iconOnly = false;
  }

  render() {
    const index = Math.max(0, this.items.findIndex((i) => i.value === this.value));
    return html`
      <nav
        class="material"
        part="bar"
        aria-label=${this.label || t(this, 'tabbar.label')}
        style="--_count: ${this.items.length || 1}; --_index: ${index}"
      >
        <span class="indicator" part="indicator"></span>
        ${this.items.map(
          (item, i) => html`
            <button
              type="button"
              part="tab"
              aria-current=${i === index ? 'page' : 'false'}
              @click=${() => this._select(item.value)}
            >
              ${renderIcon(item.icon, { size: 22 })}
              <span class=${this.iconOnly ? 'sr-only' : ''}>${item.label}</span>
            </button>
          `
        )}
      </nav>
    `;
  }

  _select(value) {
    if (value === this.value) return;
    this.value = value;
    this.dispatchEvent(new CustomEvent('ui-change', { detail: { value }, bubbles: true, composed: true }));
  }
}

customElements.define('dgonmej-ui-tab-bar', DgonmejUiTabBar);
