import { LitElement, html, css } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { hostBase, srOnly } from '../../shared/styles.js';
import { renderIcon } from '../../shared/icons.js';

/**
 * <dgonmej-ui-segmented-control label="Vista" value="week"
 *   .options=${[{ value, label, icon?, hideLabel? }]}>
 * Control segmentado estilo iOS con un indicador que se desliza.
 * variant: 'neutral' (indicador claro, texto del acento) | 'filled' (indicador con el gradiente del acento).
 * Segmentos de igual ancho. Flechas del teclado para cambiar.
 * `hideLabel` muestra solo el icono y deja el texto para lectores de pantalla.
 * Participa en <form> si tiene `name`.
 * Evento: 'ui-change' con detail = { value }
 * Parts: 'control', 'segment', 'indicator'
 */
export class DgonmejUiSegmentedControl extends LitElement {
  static formAssociated = true;

  static properties = {
    label: { type: String },
    name: { type: String, reflect: true },
    value: { type: String },
    options: { type: Array },
    size: { type: String, reflect: true },
    variant: { type: String, reflect: true },
  };

  static styles = [
    hostBase,
    srOnly,
    css`
      :host {
        display: inline-block;
        max-width: 100%;
      }

      .control {
        position: relative;
        display: grid;
        grid-auto-columns: 1fr;
        grid-auto-flow: column;
        padding: 2px;
        border-radius: var(--ui-radius-control, 999px);
        background: var(--ui-color-fill, rgb(120 120 128 / 0.12));
      }

      .indicator {
        position: absolute;
        top: 2px;
        bottom: 2px;
        left: 2px;
        width: calc((100% - 4px) / var(--_count, 1));
        border-radius: max(0px, calc(var(--ui-radius-control, 999px) - 2px));
        background: var(--ui-color-surface, #fff);
        box-shadow:
          0 3px 8px rgb(0 0 0 / 0.12),
          0 1px 1px rgb(0 0 0 / 0.06);
        transform: translateX(calc(100% * var(--_index, 0)));
        transition: transform var(--_base) var(--_ease);
      }

      button {
        position: relative;
        z-index: 1;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        min-width: 0;
        min-height: 36px;
        padding: 0 var(--ui-space-4, 16px);
        border: 0;
        border-radius: max(0px, calc(var(--ui-radius-control, 999px) - 2px));
        background: transparent;
        color: var(--ui-color-text-muted, #6e6e73);
        font: inherit;
        font-size: var(--ui-font-size-subhead, 0.9375rem);
        font-weight: 600;
        white-space: nowrap;
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
        transition: color var(--_fast) ease-out;
      }

      :host([size='small']) button {
        min-height: 30px;
        padding: 0 var(--ui-space-3, 12px);
        font-size: var(--ui-font-size-footnote, 0.8125rem);
      }

      button[aria-checked='true'] {
        color: var(--ui-color-primary-text, #0066cc);
      }

      :host([variant='filled']) .indicator {
        background:
          var(--ui-gradient-sheen, linear-gradient(180deg, rgb(255 255 255 / 0.22) 0%, rgb(255 255 255 / 0) 55%)),
          var(--ui-gradient-primary, linear-gradient(180deg, #0071e3 0%, #005bbf 100%));
        box-shadow: 0 4px 12px -4px var(--ui-color-primary-glow, rgb(0 113 227 / 0.4));
      }

      :host([variant='filled']) button[aria-checked='true'] {
        color: var(--ui-color-primary-contrast, #fff);
      }

      button:focus-visible {
        outline: 2px solid var(--_focus);
        outline-offset: -2px;
      }

      @media (hover: hover) {
        button:not([aria-checked='true']):hover {
          color: var(--ui-color-text, #1d1d1f);
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .indicator {
          transition: none;
        }
      }
    `,
  ];

  constructor() {
    super();
    this._internals = this.attachInternals();
    this.label = '';
    this.value = '';
    this.options = [];
    this.variant = 'neutral';
  }

  updated(changed) {
    if (changed.has('value') && this.name) this._internals.setFormValue(this.value);
  }

  render() {
    const index = Math.max(0, this.options.findIndex((o) => o.value === this.value));
    return html`
      <div
        class="control"
        part="control"
        role="radiogroup"
        aria-label=${this.label || 'Opciones'}
        style="--_count: ${this.options.length || 1}; --_index: ${index}"
        @keydown=${this._onKeydown}
      >
        <span class="indicator" part="indicator"></span>
        ${this.options.map(
          (o, i) => html`
            <button
              type="button"
              part="segment"
              role="radio"
              aria-checked=${i === index ? 'true' : 'false'}
              aria-label=${ifDefined(o.label ? undefined : o.value)}
              title=${ifDefined(o.hideLabel ? o.label : undefined)}
              tabindex=${i === index ? '0' : '-1'}
              @click=${() => this._select(o.value)}
            >
              ${o.icon ? renderIcon(o.icon, { size: 16 }) : ''}${o.hideLabel ? html`<span class="sr-only">${o.label}</span>` : o.label || ''}
            </button>
          `
        )}
      </div>
    `;
  }

  _select(value) {
    if (value === this.value) return;
    this.value = value;
    this.dispatchEvent(new CustomEvent('ui-change', { detail: { value }, bubbles: true, composed: true }));
  }

  _onKeydown(e) {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!step || !this.options.length) return;
    e.preventDefault();
    const current = Math.max(0, this.options.findIndex((o) => o.value === this.value));
    const next = (current + step + this.options.length) % this.options.length;
    this._select(this.options[next].value);
    this.updateComplete.then(() => this.renderRoot.querySelectorAll('button')[next]?.focus());
  }
}

customElements.define('dgonmej-ui-segmented-control', DgonmejUiSegmentedControl);
