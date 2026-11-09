import { LitElement, html, css } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { hostBase } from '../../shared/styles.js';
import { renderIcon } from '../../shared/icons.js';

/**
 * <dgonmej-ui-checkbox name="terms" value="yes" checked disabled>Acepto las condiciones</dgonmej-ui-checkbox>
 * Usa un input nativo (accesible y con teclado) con apariencia propia.
 * Participa en <form>.
 * Evento: 'ui-change' con detail = { checked }
 * Parts: 'box'
 */
export class DgonmejUiCheckbox extends LitElement {
  static formAssociated = true;

  static properties = {
    checked: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    name: { type: String, reflect: true },
    value: { type: String },
  };

  static styles = [
    hostBase,
    css`
      :host {
        display: inline-block;
      }

      label {
        position: relative;
        display: inline-flex;
        align-items: center;
        gap: var(--ui-space-3, 12px);
        min-height: var(--ui-control-height, 44px);
        color: var(--ui-color-text, #1d1d1f);
        font-size: var(--ui-font-size-body, 1.0625rem);
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
      }

      input {
        position: absolute;
        opacity: 0;
        width: 1px;
        height: 1px;
        margin: 0;
      }

      .box {
        display: grid;
        place-items: center;
        flex: none;
        width: 22px;
        height: 22px;
        border-radius: var(--ui-radius-sm, 6px);
        color: var(--ui-color-primary-contrast, #fff);
        background: var(--ui-color-surface, #fff);
        box-shadow: inset 0 0 0 1.5px var(--ui-color-fill-strong, rgb(120 120 128 / 0.22));
        transition:
          background-color var(--_fast) var(--_ease),
          box-shadow var(--_fast) var(--_ease),
          transform var(--_fast) var(--_ease);
      }

      .box .icon {
        opacity: 0;
        transform: scale(0.5);
        transition:
          opacity var(--_fast) ease-out,
          transform var(--_base) var(--_ease);
      }

      input:checked + .box {
        background: var(--ui-gradient-primary, linear-gradient(180deg, #0071e3 0%, #005bbf 100%));
        box-shadow: none;
      }

      input:checked + .box .icon {
        opacity: 1;
        transform: scale(1);
      }

      label:active .box {
        transform: scale(0.92);
      }

      input:focus-visible + .box {
        outline: 2px solid var(--_focus);
        outline-offset: 3px;
      }

      :host([disabled]) label {
        opacity: 0.4;
        cursor: not-allowed;
      }

      @media (prefers-reduced-motion: reduce) {
        .box,
        .box .icon {
          transition: opacity var(--_fast) linear, background-color var(--_fast) linear;
          transform: none !important;
        }
      }
    `,
  ];

  constructor() {
    super();
    this._internals = this.attachInternals();
    this.checked = false;
    this.disabled = false;
    this.value = 'on';
  }

  updated(changed) {
    if (changed.has('checked') || changed.has('value')) {
      this._internals.setFormValue(this.checked ? this.value : null);
    }
  }

  render() {
    return html`
      <label>
        <input
          type="checkbox"
          name=${ifDefined(this.name || undefined)}
          .checked=${this.checked}
          ?disabled=${this.disabled}
          @change=${this._onChange}
        />
        <span class="box" part="box">${renderIcon('check', { size: 16 })}</span>
        <slot></slot>
      </label>
    `;
  }

  _onChange(e) {
    this.checked = e.target.checked;
    this.dispatchEvent(new CustomEvent('ui-change', { detail: { checked: this.checked }, bubbles: true, composed: true }));
  }
}

customElements.define('dgonmej-ui-checkbox', DgonmejUiCheckbox);
