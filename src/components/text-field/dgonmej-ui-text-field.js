import { LitElement, html, css } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { hostBase } from '../../shared/styles.js';
import { renderIcon } from '../../shared/icons.js';
import { t } from '../../shared/i18n.js';

let uid = 0;

/**
 * <dgonmej-ui-text-field label="Correo" name="email" type="email" placeholder="..."
 *   helper="Texto de ayuda" error="Mensaje de error" size="small|medium|large"
 *   variant="filled|outlined" min="..." max="..." step="..." required clearable disabled>
 * Participa en <form> como un input nativo.
 *
 * Icono a la derecha segun el tipo (sustituye al indicador nativo del navegador):
 * - search: lupa decorativa.
 * - date, month, week, datetime-local: calendario; time: reloj. Al pulsarlo se abre el
 *   selector nativo del sistema (showPicker), asi que en movil sigue saliendo la rueda de iOS/Android.
 * - year: campo numerico de 4 cifras (no existe como tipo nativo) con icono de calendario.
 * - password: boton para mostrar u ocultar la contrasena.
 * `no-icon` quita el icono automatico.
 * Eventos: 'ui-input' y 'ui-change' con detail = { value }
 * Parts: 'field', 'input'
 */
export class DgonmejUiTextField extends LitElement {
  static formAssociated = true;

  static properties = {
    label: { type: String },
    name: { type: String, reflect: true },
    value: { type: String },
    type: { type: String },
    placeholder: { type: String },
    helper: { type: String },
    error: { type: String },
    autocomplete: { type: String },
    required: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    clearable: { type: Boolean },
    noIcon: { type: Boolean, attribute: 'no-icon' },
    min: { type: String },
    max: { type: String },
    step: { type: String },
    size: { type: String, reflect: true },
    _reveal: { state: true },
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
        display: flex;
        align-items: center;
        min-height: var(--_h);
        padding: 0 var(--ui-space-2, 8px) 0 var(--ui-space-4, 16px);
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

      /* Anillo de foco suave del acento alrededor de todo el campo */
      .field:focus-within {
        background: var(--ui-color-surface, #fff);
        box-shadow:
          inset 0 0 0 1px color-mix(in srgb, var(--_focus) 55%, transparent),
          0 0 0 3px color-mix(in srgb, var(--_focus) 14%, transparent);
      }

      :host([invalid]) .field {
        box-shadow: inset 0 0 0 1px var(--ui-color-danger, #c4001a);
      }

      :host([invalid]) .field:focus-within {
        box-shadow:
          inset 0 0 0 1px var(--ui-color-danger, #c4001a),
          0 0 0 3px color-mix(in srgb, var(--ui-color-danger, #c4001a) 14%, transparent);
      }

      input {
        /* Ancho base 0: el input crece con flex y no impone su ancho nativo (~20 caracteres),
           asi el campo cabe en contenedores estrechos */
        flex: 1;
        width: 0;
        min-width: 0;
        height: var(--_h);
        padding: 0;
        border: 0;
        outline: none;
        background: transparent;
        color: var(--ui-color-text, #1d1d1f);
        font: inherit;
        font-size: var(--_fs);
      }

      /* Zona de iconos a la derecha: no se encoge, el texto si */
      .trailing {
        display: flex;
        flex: none;
        align-items: center;
        gap: 2px;
        margin-left: var(--ui-space-1, 4px);
      }

      .type-icon {
        display: grid;
        place-items: center;
        width: 32px;
        height: 32px;
        padding: 0;
        border: 0;
        border-radius: var(--ui-radius-sm, 6px);
        color: var(--ui-color-text-muted, #6e6e73);
        background: transparent;
        transition: color var(--_fast) ease-out;
      }

      button.type-icon {
        cursor: pointer;
      }

      button.type-icon:focus-visible {
        outline: 2px solid var(--_focus);
      }

      /* Con el foco, el icono toma el acento de forma sutil */
      .field:focus-within .type-icon {
        color: var(--ui-color-primary-text, #0066cc);
      }

      @media (hover: hover) {
        button.type-icon:hover {
          color: var(--ui-color-text, #1d1d1f);
        }
      }

      :host([size='small']) .type-icon,
      :host([size='small']) .clear {
        width: 28px;
        height: 28px;
      }

      /* Quitar los indicadores nativos: los sustituye nuestro icono */
      input::-webkit-calendar-picker-indicator {
        display: none;
      }
      input::-webkit-search-cancel-button,
      input::-webkit-search-decoration {
        -webkit-appearance: none;
        appearance: none;
      }
      input[type='search'] {
        -webkit-appearance: none;
        appearance: none;
      }
      /* Fechas y horas: alineadas a la izquierda y sin ancho minimo propio (Safari/iOS) */
      input[type='date'],
      input[type='time'],
      input[type='month'],
      input[type='week'],
      input[type='datetime-local'] {
        -webkit-appearance: none;
        appearance: none;
        text-align: left;
      }
      input::-webkit-date-and-time-value {
        text-align: left;
      }
      input::-webkit-datetime-edit {
        padding: 0;
      }
      input::-webkit-datetime-edit-fields-wrapper {
        padding: 0;
      }
      /* Sin valor, los campos de fecha se ven atenuados como un placeholder */
      :host([empty]) input::-webkit-datetime-edit {
        color: var(--ui-color-text-muted, #6e6e73);
      }
      /* Año: sin flechas de numero */
      input.year::-webkit-inner-spin-button,
      input.year::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
      input.year {
        -moz-appearance: textfield;
        font-variant-numeric: tabular-nums;
      }

      /* Cursor y seleccion con el color de acento, como en iOS */
      input {
        caret-color: var(--ui-color-primary, #0066cc);
      }

      input::selection {
        background: var(--ui-color-primary-tint, rgb(0 113 227 / 0.12));
      }

      input::placeholder {
        color: var(--ui-color-text-muted, #6e6e73);
      }

      .clear {
        display: grid;
        place-items: center;
        width: 32px;
        height: 32px;
        padding: 0;
        border: 0;
        border-radius: var(--ui-radius-sm, 6px);
        color: var(--ui-color-text-muted, #6e6e73);
        background: transparent;
        cursor: pointer;
        transition: opacity var(--_fast) ease-out;
      }

      .clear:focus-visible {
        outline: 2px solid var(--_focus);
      }

      .message {
        display: flex;
        align-items: center;
        gap: var(--ui-space-1, 4px);
        margin: var(--ui-space-2, 8px) 0 0 var(--ui-space-1, 4px);
        color: var(--ui-color-text-muted, #6e6e73);
        font-size: var(--ui-font-size-footnote, 0.8125rem);
      }

      .message.error {
        color: var(--ui-color-danger, #c4001a);
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
    this._id = `ui-tf-${++uid}`;
    this.label = '';
    this.value = '';
    this.type = 'text';
    this.placeholder = '';
    this.helper = '';
    this.error = '';
    this.required = false;
    this.disabled = false;
    this.clearable = false;
    this.noIcon = false;
    this._reveal = false;
    this.size = 'medium';
    this.variant = 'filled';
  }

  updated(changed) {
    if (changed.has('value')) this._internals.setFormValue(this.value);
    this.toggleAttribute('empty', !this.value);
    if (changed.has('type') && changed.get('type') === 'password') this._reveal = false;
    if (changed.has('error')) this.toggleAttribute('invalid', Boolean(this.error));
  }

  formResetCallback() {
    this.value = '';
  }

  focus() {
    this.renderRoot.querySelector('input')?.focus();
  }

  get _input() {
    return this.renderRoot.querySelector('input');
  }

  /** Tipo nativo del input (year y la contrasena visible no existen como tal). */
  get _nativeType() {
    if (this.type === 'year') return 'number';
    if (this.type === 'password' && this._reveal) return 'text';
    return this.type;
  }

  _renderTypeIcon() {
    if (this.noIcon) return '';
    const size = this.size === 'small' ? 16 : 18;
    if (this.type === 'search') {
      return html`<span class="type-icon" aria-hidden="true">${renderIcon('search', { size })}</span>`;
    }
    if (this.type === 'password') {
      return html`<button
        class="type-icon"
        type="button"
        aria-label=${t(this, this._reveal ? 'field.hidePassword' : 'field.showPassword')}
        aria-pressed=${this._reveal ? 'true' : 'false'}
        @click=${() => (this._reveal = !this._reveal)}
      >
        ${renderIcon(this._reveal ? 'eye-off' : 'eye', { size })}
      </button>`;
    }
    const picker = { date: 'calendar', month: 'calendar', week: 'calendar', 'datetime-local': 'calendar', time: 'clock' }[this.type];
    if (picker) {
      // tabindex -1: con teclado el selector se abre desde el propio campo (Alt+Abajo / Espacio)
      return html`<button
        class="type-icon"
        type="button"
        tabindex="-1"
        aria-label=${t(this, this.type === 'time' ? 'field.chooseTime' : 'field.openCalendar')}
        ?disabled=${this.disabled}
        @click=${this._openPicker}
      >
        ${renderIcon(picker, { size })}
      </button>`;
    }
    if (this.type === 'year') {
      return html`<span class="type-icon" aria-hidden="true">${renderIcon('calendar', { size })}</span>`;
    }
    return '';
  }

  _openPicker() {
    const input = this._input;
    input.focus();
    try {
      input.showPicker?.();
    } catch {
      /* algunos navegadores solo lo permiten con gesto del usuario: el foco ya basta */
    }
  }

  render() {
    const messageId = `${this._id}-msg`;
    const message = this.error || this.helper;
    const isYear = this.type === 'year';
    const typeIcon = this._renderTypeIcon();
    const showClear = this.clearable && this.value;
    return html`
      ${this.label
        ? html`<label for=${this._id}>
            ${this.label}${this.required ? html` <span class="required">(${t(this, 'field.required')})</span>` : ''}
          </label>`
        : ''}
      <div class="field" part="field">
        <input
          part="input"
          id=${this._id}
          class=${isYear ? 'year' : ''}
          type=${this._nativeType}
          name=${ifDefined(this.name || undefined)}
          .value=${this.value}
          placeholder=${ifDefined(this.placeholder || (isYear ? 'AAAA' : undefined))}
          autocomplete=${ifDefined(this.autocomplete || undefined)}
          inputmode=${ifDefined(isYear ? 'numeric' : undefined)}
          min=${ifDefined(this.min || (isYear ? '1000' : undefined))}
          max=${ifDefined(this.max || (isYear ? '9999' : undefined))}
          step=${ifDefined(this.step || (isYear ? '1' : undefined))}
          ?required=${this.required}
          ?disabled=${this.disabled}
          aria-invalid=${this.error ? 'true' : 'false'}
          aria-describedby=${ifDefined(message ? messageId : undefined)}
          @input=${this._onInput}
          @change=${this._onChange}
        />
        ${showClear || typeIcon
          ? html`<span class="trailing">
              ${showClear
                ? html`<button class="clear" type="button" aria-label=${t(this, 'field.clear')} @click=${this._clear}>
                    ${renderIcon('xmark', { size: 16 })}
                  </button>`
                : ''}
              ${typeIcon}
            </span>`
          : ''}
      </div>
      ${message
        ? html`<div id=${messageId} class="message ${this.error ? 'error' : ''}">
            ${this.error ? renderIcon('warning', { size: 14 }) : ''}${message}
          </div>`
        : ''}
    `;
  }

  _onInput(e) {
    // Año: como maximo 4 cifras
    if (this.type === 'year' && e.target.value?.length > 4) e.target.value = e.target.value.slice(0, 4);
    this.value = e.target.value;
    this.dispatchEvent(new CustomEvent('ui-input', { detail: { value: this.value }, bubbles: true, composed: true }));
  }

  _onChange() {
    this.dispatchEvent(new CustomEvent('ui-change', { detail: { value: this.value }, bubbles: true, composed: true }));
  }

  _clear() {
    this.value = '';
    this.focus();
    this._onInput({ target: { value: '' } });
    this._onChange();
  }
}

customElements.define('dgonmej-ui-text-field', DgonmejUiTextField);
