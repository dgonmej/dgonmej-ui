import { LitElement, html, css } from 'lit';
import { hostBase } from '../../shared/styles.js';

let uid = 0;

/**
 * <dgonmej-ui-radio-group label="Plan" name="plan" value="pro"
 *   .options=${[{ value, label, description? , disabled? }]}>
 * Radios nativos (flechas del teclado incluidas) con apariencia propia.
 * Participa en <form>.
 * Evento: 'ui-change' con detail = { value }
 * Parts: 'group', 'option'
 */
export class DgonmejUiRadioGroup extends LitElement {
  static formAssociated = true;

  static properties = {
    label: { type: String },
    name: { type: String, reflect: true },
    value: { type: String },
    options: { type: Array },
    disabled: { type: Boolean, reflect: true },
  };

  static styles = [
    hostBase,
    css`
      :host {
        display: block;
      }

      fieldset {
        margin: 0;
        padding: 0;
        border: 0;
        min-width: 0;
      }

      legend {
        margin: 0 0 var(--ui-space-2, 8px) var(--ui-space-1, 4px);
        padding: 0;
        color: var(--ui-color-text, #1d1d1f);
        font-size: var(--ui-font-size-subhead, 0.9375rem);
        font-weight: 600;
      }

      .options {
        display: grid;
        gap: var(--ui-space-2, 8px);
      }

      label {
        position: relative;
        display: flex;
        align-items: flex-start;
        gap: var(--ui-space-3, 12px);
        padding: var(--ui-space-3, 12px) var(--ui-space-4, 16px);
        border-radius: var(--ui-radius-md, 10px);
        background: var(--ui-color-surface, #fff);
        box-shadow:
          inset 0 0 0 1px var(--ui-color-border, rgb(0 0 0 / 0.08)),
          var(--ui-shadow-sm, 0 1px 2px rgb(0 0 0 / 0.06), 0 1px 1px rgb(0 0 0 / 0.04));
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
        transition: box-shadow var(--_fast) var(--_ease);
      }

      /* La opcion elegida se marca con el borde del acento */
      label:has(input:checked) {
        box-shadow:
          inset 0 0 0 2px var(--ui-color-primary, #0066cc),
          var(--ui-shadow-sm, 0 1px 2px rgb(0 0 0 / 0.06), 0 1px 1px rgb(0 0 0 / 0.04));
      }

      input {
        position: absolute;
        opacity: 0;
        width: 1px;
        height: 1px;
        margin: 0;
      }

      .dot {
        display: grid;
        place-items: center;
        flex: none;
        width: 22px;
        height: 22px;
        margin-top: 1px;
        border-radius: 50%;
        box-shadow: inset 0 0 0 1.5px var(--ui-color-fill-strong, rgb(120 120 128 / 0.22));
        transition:
          background-color var(--_fast) var(--_ease),
          box-shadow var(--_fast) var(--_ease);
      }

      .dot::after {
        content: '';
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #fff;
        transform: scale(0);
        transition: transform var(--_base) var(--_ease);
      }

      input:checked + .dot {
        background: var(--ui-gradient-primary, linear-gradient(180deg, #0071e3 0%, #005bbf 100%));
        box-shadow: none;
      }

      input:checked + .dot::after {
        transform: scale(1);
      }

      input:focus-visible + .dot {
        outline: 2px solid var(--_focus);
        outline-offset: 3px;
      }

      .text {
        min-width: 0;
      }

      .label {
        display: block;
        color: var(--ui-color-text, #1d1d1f);
        font-size: var(--ui-font-size-body, 1.0625rem);
        line-height: 1.35;
      }

      .description {
        display: block;
        margin-top: 2px;
        color: var(--ui-color-text-muted, #6e6e73);
        font-size: var(--ui-font-size-subhead, 0.9375rem);
        line-height: 1.35;
      }

      label:has(input:disabled) {
        opacity: 0.4;
        cursor: not-allowed;
      }

      @media (prefers-reduced-motion: reduce) {
        label,
        .dot,
        .dot::after {
          transition: none;
        }
      }
    `,
  ];

  constructor() {
    super();
    this._internals = this.attachInternals();
    this._name = `ui-radio-${++uid}`;
    this.label = '';
    this.value = '';
    this.options = [];
    this.disabled = false;
  }

  updated(changed) {
    if (changed.has('value')) this._internals.setFormValue(this.value || null);
  }

  render() {
    return html`
      <fieldset part="group" ?disabled=${this.disabled}>
        ${this.label ? html`<legend>${this.label}</legend>` : ''}
        <div class="options">
          ${this.options.map(
            (o) => html`
              <label part="option">
                <input
                  type="radio"
                  name=${this.name || this._name}
                  .value=${o.value}
                  .checked=${o.value === this.value}
                  ?disabled=${o.disabled}
                  @change=${() => this._select(o.value)}
                />
                <span class="dot"></span>
                <span class="text">
                  <span class="label">${o.label}</span>
                  ${o.description ? html`<span class="description">${o.description}</span>` : ''}
                </span>
              </label>
            `
          )}
        </div>
      </fieldset>
    `;
  }

  _select(value) {
    this.value = value;
    this.dispatchEvent(new CustomEvent('ui-change', { detail: { value }, bubbles: true, composed: true }));
  }
}

customElements.define('dgonmej-ui-radio-group', DgonmejUiRadioGroup);
