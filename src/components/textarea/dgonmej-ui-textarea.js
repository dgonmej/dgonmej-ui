import { LitElement, html, css } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { hostBase } from '../../shared/styles.js';
import { renderIcon } from '../../shared/icons.js';
import { t } from '../../shared/i18n.js';

let uid = 0;

/**
 * <dgonmej-ui-textarea label="Mensaje" name="message" placeholder="..." rows="3"
 *   helper="Texto de ayuda" error="Mensaje de error" maxlength="280"
 *   variant="filled|outlined" autoresize required disabled>
 * - autoresize: crece con el contenido (sin barra de scroll) hasta `max-rows`.
 * - maxlength: muestra un contador de caracteres.
 * Participa en <form> como un textarea nativo.
 * Eventos: 'ui-input' y 'ui-change' con detail = { value }
 * Parts: 'field', 'textarea'
 */
export class DgonmejUiTextarea extends LitElement {
  static formAssociated = true;

  static properties = {
    label: { type: String },
    name: { type: String, reflect: true },
    value: { type: String },
    placeholder: { type: String },
    helper: { type: String },
    error: { type: String },
    rows: { type: Number },
    maxRows: { type: Number, attribute: 'max-rows' },
    maxlength: { type: Number },
    autoresize: { type: Boolean, reflect: true },
    variant: { type: String, reflect: true },
    required: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
  };

  static styles = [
    hostBase,
    css`
      :host {
        display: block;
      }

      label {
        display: block;
        margin: 0 0 var(--ui-space-2, 8px) var(--ui-space-1, 4px);
        color: var(--ui-color-text, #1d1d1f);
        font-size: var(--ui-font-size-subhead, 0.9375rem);
        font-weight: 600;
      }

      .required {
        color: var(--ui-color-text-muted, #6e6e73);
        font-weight: 400;
      }

      .field {
        border-radius: var(--ui-radius-md, 10px);
        background: var(--ui-color-fill, rgb(120 120 128 / 0.12));
        box-shadow: inset 0 0 0 1px transparent;
        transition:
          box-shadow var(--_fast) var(--_ease),
          background-color var(--_fast) var(--_ease);
      }

      :host([variant='outlined']) .field {
        background: var(--ui-color-surface, #fff);
        box-shadow: inset 0 0 0 1px var(--ui-color-fill-strong, rgb(120 120 128 / 0.22));
      }

      /* Foco sutil con el acento */
      .field:focus-within {
        background: var(--ui-color-surface, #fff);
        box-shadow:
          inset 0 0 0 1px color-mix(in srgb, var(--_focus) 55%, transparent),
          0 0 0 3px color-mix(in srgb, var(--_focus) 14%, transparent);
      }

      :host([invalid]) .field,
      :host([invalid]) .field:focus-within {
        box-shadow:
          inset 0 0 0 1px var(--ui-color-danger, #c4001a),
          0 0 0 3px color-mix(in srgb, var(--ui-color-danger, #c4001a) 14%, transparent);
      }

      textarea {
        display: block;
        box-sizing: border-box;
        width: 100%;
        min-height: calc(var(--_rows, 3) * 1.45em + 2 * var(--ui-space-3, 12px));
        padding: var(--ui-space-3, 12px) var(--ui-space-4, 16px);
        border: 0;
        outline: none;
        background: transparent;
        color: var(--ui-color-text, #1d1d1f);
        caret-color: var(--ui-color-primary, #0066cc);
        font: inherit;
        font-size: var(--ui-font-size-body, 1.0625rem);
        line-height: 1.45;
        resize: vertical;
      }

      textarea::placeholder {
        color: var(--ui-color-text-muted, #6e6e73);
      }

      textarea::selection {
        background: var(--ui-color-primary-tint, rgb(0 113 227 / 0.12));
      }

      /* Crece con el contenido hasta max-rows */
      :host([autoresize]) textarea {
        field-sizing: content;
        max-height: calc(var(--_max-rows, 10) * 1.45em + 2 * var(--ui-space-3, 12px));
        resize: none;
      }

      .bottom {
        display: flex;
        justify-content: space-between;
        gap: var(--ui-space-2, 8px);
        margin: var(--ui-space-2, 8px) var(--ui-space-1, 4px) 0;
        color: var(--ui-color-text-muted, #6e6e73);
        font-size: var(--ui-font-size-footnote, 0.8125rem);
      }

      .message {
        display: flex;
        align-items: center;
        gap: var(--ui-space-1, 4px);
      }

      .message.error,
      .count.over {
        color: var(--ui-color-danger, #c4001a);
      }

      .count {
        margin-left: auto;
        font-variant-numeric: tabular-nums;
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
    this._id = `ui-ta-${++uid}`;
    this.label = '';
    this.value = '';
    this.placeholder = '';
    this.helper = '';
    this.error = '';
    this.rows = 3;
    this.maxRows = 10;
    this.autoresize = false;
    this.variant = 'filled';
    this.required = false;
    this.disabled = false;
  }

  updated(changed) {
    if (changed.has('value')) this._internals.setFormValue(this.value);
    if (changed.has('error')) this.toggleAttribute('invalid', Boolean(this.error));
    // Sin field-sizing (navegadores antiguos): ajustar la altura a mano
    if (this.autoresize && !CSS.supports?.('field-sizing', 'content')) {
      const ta = this.renderRoot.querySelector('textarea');
      ta.style.height = 'auto';
      ta.style.height = `${ta.scrollHeight}px`;
    }
  }

  formResetCallback() {
    this.value = '';
  }

  focus() {
    this.renderRoot.querySelector('textarea')?.focus();
  }

  render() {
    const messageId = `${this._id}-msg`;
    const message = this.error || this.helper;
    const count = this.value.length;
    return html`
      ${this.label
        ? html`<label for=${this._id}>
            ${this.label}${this.required ? html` <span class="required">(${t(this, 'field.required')})</span>` : ''}
          </label>`
        : ''}
      <div class="field" part="field" style="--_rows: ${this.rows}; --_max-rows: ${this.maxRows}">
        <textarea
          part="textarea"
          id=${this._id}
          rows=${this.rows}
          name=${ifDefined(this.name || undefined)}
          .value=${this.value}
          placeholder=${ifDefined(this.placeholder || undefined)}
          maxlength=${ifDefined(this.maxlength || undefined)}
          ?required=${this.required}
          ?disabled=${this.disabled}
          aria-invalid=${this.error ? 'true' : 'false'}
          aria-describedby=${ifDefined(message ? messageId : undefined)}
          @input=${this._onInput}
          @change=${this._onChange}
        ></textarea>
      </div>
      ${message || this.maxlength
        ? html`<div class="bottom">
            ${message
              ? html`<span id=${messageId} class="message ${this.error ? 'error' : ''}">
                  ${this.error ? renderIcon('warning', { size: 14 }) : ''}${message}
                </span>`
              : ''}
            ${this.maxlength
              ? html`<span class="count ${count >= this.maxlength ? 'over' : ''}" aria-live="polite">
                  ${count}/${this.maxlength}
                </span>`
              : ''}
          </div>`
        : ''}
    `;
  }

  _onInput(e) {
    this.value = e.target.value;
    this.dispatchEvent(new CustomEvent('ui-input', { detail: { value: this.value }, bubbles: true, composed: true }));
  }

  _onChange() {
    this.dispatchEvent(new CustomEvent('ui-change', { detail: { value: this.value }, bubbles: true, composed: true }));
  }
}

customElements.define('dgonmej-ui-textarea', DgonmejUiTextarea);
