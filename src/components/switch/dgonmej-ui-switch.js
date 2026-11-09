import { LitElement, html, css } from 'lit';
import { hostBase } from '../../shared/styles.js';

/**
 * <dgonmej-ui-switch name="wifi" size="small|medium" checked disabled>Wi-Fi</dgonmej-ui-switch>
 * Interruptor estilo iOS. El texto del slot es su etiqueta.
 * Participa en <form>: envia "on" cuando esta activado.
 * Evento: 'ui-change' con detail = { checked }
 * Parts: 'track', 'thumb'
 */
export class DgonmejUiSwitch extends LitElement {
  static formAssociated = true;

  static properties = {
    checked: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    name: { type: String, reflect: true },
    size: { type: String, reflect: true },
  };

  static styles = [
    hostBase,
    css`
      :host {
        --_w: 51px;
        --_t: 27px;
        display: inline-block;
      }

      :host([size='small']) {
        --_w: 40px;
        --_t: 20px;
      }

      button {
        display: inline-flex;
        align-items: center;
        gap: var(--ui-space-3, 12px);
        min-height: var(--ui-control-height, 44px);
        padding: 0;
        border: 0;
        background: transparent;
        color: var(--ui-color-text, #1d1d1f);
        font: inherit;
        font-size: var(--ui-font-size-body, 1.0625rem);
        text-align: left;
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
      }

      .track {
        position: relative;
        flex: none;
        width: var(--_w);
        height: calc(var(--_t) + 4px);
        border-radius: var(--ui-radius-control, 999px);
        background: var(--ui-color-fill-strong, rgb(120 120 128 / 0.22));
        transition: background-color var(--_base) var(--_ease);
      }

      :host([checked]) .track {
        background: var(--ui-gradient-primary, linear-gradient(180deg, #0071e3 0%, #005bbf 100%));
      }

      .thumb {
        position: absolute;
        top: 2px;
        left: 2px;
        width: var(--_t);
        height: var(--_t);
        border-radius: max(0px, calc(var(--ui-radius-control, 999px) - 2px));
        background: #fff;
        box-shadow:
          0 3px 8px rgb(0 0 0 / 0.15),
          0 1px 1px rgb(0 0 0 / 0.16);
        transition: transform var(--_base) var(--_ease);
      }

      :host([checked]) .thumb {
        transform: translateX(calc(var(--_w) - var(--_t) - 4px));
      }

      /* Al pulsar, el pulgar se estira como en iOS */
      button:active .thumb {
        transform: scaleX(1.15);
        transform-origin: left center;
      }

      :host([checked]) button:active .thumb {
        transform: translateX(calc(var(--_w) - var(--_t) - 4px)) scaleX(1.15);
        transform-origin: right center;
      }

      button:focus-visible .track {
        outline: 2px solid var(--_focus);
        outline-offset: 3px;
      }

      :host([disabled]) button {
        opacity: 0.4;
        cursor: not-allowed;
      }

      @media (prefers-reduced-motion: reduce) {
        .track,
        .thumb {
          transition-duration: 0s;
        }
        button:active .thumb {
          transform: none;
        }
        :host([checked]) button:active .thumb {
          transform: translateX(calc(var(--_w) - var(--_t) - 4px));
        }
      }
    `,
  ];

  constructor() {
    super();
    this._internals = this.attachInternals();
    this.checked = false;
    this.disabled = false;
    this.size = 'medium';
  }

  updated(changed) {
    if (changed.has('checked')) this._internals.setFormValue(this.checked ? 'on' : null);
  }

  render() {
    return html`
      <button
        type="button"
        role="switch"
        aria-checked=${this.checked ? 'true' : 'false'}
        ?disabled=${this.disabled}
        @click=${this._toggle}
      >
        <span class="track" part="track"><span class="thumb" part="thumb"></span></span>
        <slot></slot>
      </button>
    `;
  }

  _toggle() {
    if (this.disabled) return;
    this.checked = !this.checked;
    this.dispatchEvent(new CustomEvent('ui-change', { detail: { checked: this.checked }, bubbles: true, composed: true }));
  }
}

customElements.define('dgonmej-ui-switch', DgonmejUiSwitch);
