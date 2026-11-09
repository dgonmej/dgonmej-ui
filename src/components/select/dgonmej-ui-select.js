import { LitElement, html, css } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { hostBase } from '../../shared/styles.js';
import { renderIcon } from '../../shared/icons.js';

let uid = 0;

/**
 * <dgonmej-ui-select label="Pais" name="country" value="es" placeholder="Elige uno"
 *   .options=${[{ value, label, disabled? }]} helper="..." size="small|medium|large"
 *   variant="filled|outlined" disabled required>
 * Usa un <select> nativo con apariencia propia: en movil abre el selector del sistema.
 * Participa en <form>.
 * Evento: 'ui-change' con detail = { value }
 * Parts: 'field', 'select'
 */
export class DgonmejUiSelect extends LitElement {
  static formAssociated = true;

  static properties = {
    label: { type: String },
    name: { type: String, reflect: true },
    value: { type: String },
    placeholder: { type: String },
    helper: { type: String },
    options: { type: Array },
    required: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    size: { type: String, reflect: true },
    variant: { type: String, reflect: true },
  };

  static styles = [
    hostBase,
    css`
      :host {
        --_h: var(--ui-control-height, 44px);
        --_fs: var(--ui-font-size-body, 1.0625rem);
        display: block;
      }

      :host([size='small']) {
        --_h: 36px;
        --_fs: var(--ui-font-size-subhead, 0.9375rem);
      }

      :host([size='large']) {
        --_h: 52px;
        --_fs: var(--ui-font-size-title3, 1.25rem);
      }

      :host([variant='outlined']) .field {
        background: var(--ui-color-surface, #fff);
        box-shadow: inset 0 0 0 1px var(--ui-color-fill-strong, rgb(120 120 128 / 0.22));
      }

      label {
        display: block;
        margin: 0 0 var(--ui-space-2, 8px) var(--ui-space-1, 4px);
        color: var(--ui-color-text, #1d1d1f);
        font-size: var(--ui-font-size-subhead, 0.9375rem);
        font-weight: 600;
      }

      .field {
        position: relative;
        border-radius: var(--ui-radius-md, 10px);
        background: var(--ui-color-fill, rgb(120 120 128 / 0.12));
        transition:
          box-shadow var(--_fast) var(--_ease),
          background-color var(--_fast) var(--_ease);
      }

      .field:focus-within {
        background: var(--ui-color-surface, #fff);
        box-shadow:
          inset 0 0 0 1px color-mix(in srgb, var(--_focus) 55%, transparent),
          0 0 0 3px color-mix(in srgb, var(--_focus) 14%, transparent);
      }

      select {
        appearance: none;
        -webkit-appearance: none;
        width: 100%;
        min-width: 0;
        min-height: var(--_h);
        padding: 0 calc(var(--ui-space-4, 16px) + 24px) 0 var(--ui-space-4, 16px);
        border: 0;
        border-radius: inherit;
        outline: none;
        background: transparent;
        color: var(--ui-color-text, #1d1d1f);
        font: inherit;
        font-size: var(--_fs);
        cursor: pointer;
      }

      select:invalid,
      select.placeholder {
        color: var(--ui-color-text-muted, #6e6e73);
      }

      .chevron {
        position: absolute;
        top: 50%;
        right: var(--ui-space-3, 12px);
        color: var(--ui-color-primary-text, #0066cc);
        transform: translateY(-50%);
        pointer-events: none;
      }

      .helper {
        margin: var(--ui-space-2, 8px) 0 0 var(--ui-space-1, 4px);
        color: var(--ui-color-text-muted, #6e6e73);
        font-size: var(--ui-font-size-footnote, 0.8125rem);
      }

      :host([disabled]) {
        opacity: 0.5;
        pointer-events: none;
      }

      @media (prefers-reduced-motion: reduce) {
        .field {
          transition: none;
        }
      }
    `,
  ];

  constructor() {
    super();
    this._internals = this.attachInternals();
    this._id = `ui-select-${++uid}`;
    this.label = '';
    this.value = '';
    this.placeholder = '';
    this.helper = '';
    this.options = [];
    this.required = false;
    this.disabled = false;
    this.size = 'medium';
    this.variant = 'filled';
  }

  updated(changed) {
    if (changed.has('value')) this._internals.setFormValue(this.value || null);
  }

  render() {
    const helperId = `${this._id}-helper`;
    return html`
      ${this.label ? html`<label for=${this._id}>${this.label}</label>` : ''}
      <div class="field" part="field">
        <select
          part="select"
          id=${this._id}
          class=${this.value ? '' : 'placeholder'}
          name=${ifDefined(this.name || undefined)}
          ?required=${this.required}
          ?disabled=${this.disabled}
          aria-describedby=${ifDefined(this.helper ? helperId : undefined)}
          @change=${this._onChange}
        >
          ${this.placeholder
            ? html`<option value="" disabled ?selected=${!this.value}>${this.placeholder}</option>`
            : ''}
          ${this.options.map(
            (o) => html`<option value=${o.value} ?disabled=${o.disabled} ?selected=${o.value === this.value}>
              ${o.label}
            </option>`
          )}
        </select>
        <span class="chevron">${renderIcon('chevron-down', { size: 16 })}</span>
      </div>
      ${this.helper ? html`<div id=${helperId} class="helper">${this.helper}</div>` : ''}
    `;
  }

  _onChange(e) {
    this.value = e.target.value;
    this.dispatchEvent(new CustomEvent('ui-change', { detail: { value: this.value }, bubbles: true, composed: true }));
  }
}

customElements.define('dgonmej-ui-select', DgonmejUiSelect);
