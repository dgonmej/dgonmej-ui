import { LitElement, html, css } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { hostBase, material } from '../../shared/styles.js';
import { renderIcon } from '../../shared/icons.js';
import { t as translate } from '../../shared/i18n.js';

const ICONS = { info: 'info', success: 'check-circle', warning: 'warning', danger: 'warning' };
let uid = 0;

/**
 * <dgonmej-ui-toast placement="top|bottom|top-start|top-end|bottom-start|bottom-end"></dgonmej-ui-toast>
 * top / bottom: centrado. *-start / *-end: esquinas (izquierda / derecha).
 * Se coloca una vez en la pagina y se usa con:
 *   toast.show('Cambios guardados', { variant: 'success', duration: 3000 });
 * variant: 'info' | 'success' | 'warning' | 'danger'. duration: ms (0 = no se cierra solo).
 * Los avisos 'danger' se anuncian de inmediato; el resto, de forma educada.
 * Parts: 'toast'
 */
export class DgonmejUiToast extends LitElement {
  static properties = {
    placement: { type: String, reflect: true },
    _items: { state: true },
  };

  static styles = [
    hostBase,
    material,
    css`
      :host {
        position: fixed;
        z-index: 1000;
        left: 50%;
        top: calc(env(safe-area-inset-top) + var(--ui-space-3, 12px));
        transform: translateX(-50%);
        display: grid;
        justify-items: center;
        gap: var(--ui-space-2, 8px);
        width: min(420px, calc(100vw - 2 * var(--ui-space-4, 16px)));
        pointer-events: none;
      }

      :host([placement^='bottom']) {
        top: auto;
        bottom: calc(env(safe-area-inset-bottom) + var(--ui-space-4, 16px));
      }

      /* Esquinas: alineados al lado correspondiente */
      :host([placement$='-start']),
      :host([placement$='-end']) {
        transform: none;
        width: min(380px, calc(100vw - 2 * var(--ui-space-4, 16px)));
      }

      :host([placement$='-start']) {
        left: calc(env(safe-area-inset-left) + var(--ui-space-4, 16px));
        justify-items: start;
      }

      :host([placement$='-end']) {
        left: auto;
        right: calc(env(safe-area-inset-right) + var(--ui-space-4, 16px));
        justify-items: end;
      }

      /* Abajo, el mas nuevo queda pegado al borde */
      :host([placement^='bottom']) {
        align-content: end;
      }

      .toast {
        display: flex;
        align-items: center;
        gap: var(--ui-space-2, 8px);
        max-width: 100%;
        min-height: 44px;
        padding: var(--ui-space-2, 8px) var(--ui-space-2, 8px) var(--ui-space-2, 8px) var(--ui-space-4, 16px);
        border-radius: var(--ui-radius-control, 999px);
        box-shadow: var(--ui-shadow-lg, 0 2px 6px rgb(0 0 0 / 0.06), 0 24px 48px -16px rgb(0 0 0 / 0.22));
        font-size: var(--ui-font-size-subhead, 0.9375rem);
        font-weight: 600;
        pointer-events: auto;
        animation: toast-in var(--_slow) var(--_ease) both;
      }

      .toast.leaving {
        animation: toast-out var(--_base) var(--_ease) both;
      }

      .toast .icon {
        flex: none;
      }

      .toast[data-variant='info'] .icon {
        color: var(--ui-color-primary-text, #0066cc);
      }
      .toast[data-variant='success'] .icon {
        color: var(--ui-color-success, #1a7030);
      }
      .toast[data-variant='warning'] .icon {
        color: var(--ui-color-warning, #9a4a00);
      }
      .toast[data-variant='danger'] .icon {
        color: var(--ui-color-danger, #c4001a);
      }

      .message {
        flex: 1;
        min-width: 0;
      }

      .close {
        display: grid;
        place-items: center;
        flex: none;
        width: 28px;
        height: 28px;
        padding: 0;
        border: 0;
        border-radius: 50%;
        color: inherit;
        background: var(--ui-color-fill, rgb(120 120 128 / 0.12));
        opacity: 0.7;
        cursor: pointer;
      }

      .close:focus-visible {
        outline: 2px solid var(--_focus);
        outline-offset: 2px;
      }

      @keyframes toast-in {
        from {
          opacity: 0;
          transform: translateY(var(--_from, -16px)) scale(0.96);
        }
      }

      @keyframes toast-out {
        to {
          opacity: 0;
          transform: scale(0.96);
        }
      }

      :host([placement^='bottom']) .toast {
        --_from: 16px;
      }

      @media (prefers-reduced-motion: reduce) {
        .toast {
          --_from: 0px;
        }
      }
    `,
  ];

  constructor() {
    super();
    this.placement = 'top';
    this._items = [];
  }

  /** Muestra un aviso y devuelve una funcion para cerrarlo antes de tiempo. */
  show(message, { variant = 'info', duration = 3500 } = {}) {
    const id = ++uid;
    this._items = [...this._items, { id, message, variant, leaving: false }];
    if (duration > 0) setTimeout(() => this.dismiss(id), duration);
    return () => this.dismiss(id);
  }

  dismiss(id) {
    if (!this._items.some((t) => t.id === id && !t.leaving)) return;
    this._items = this._items.map((t) => (t.id === id ? { ...t, leaving: true } : t));
  }

  render() {
    return html`
      ${repeat(
        this._items,
        (t) => t.id,
        (t) => html`
          <div
            class="toast material ${t.leaving ? 'leaving' : ''}"
            part="toast"
            data-variant=${t.variant}
            role=${t.variant === 'danger' ? 'alert' : 'status'}
            @animationend=${() => t.leaving && this._remove(t.id)}
          >
            ${renderIcon(ICONS[t.variant] || 'info', { size: 20 })}
            <span class="message">${t.message}</span>
            <button class="close" type="button" aria-label=${translate(this, 'toast.close')} @click=${() => this.dismiss(t.id)}>
              ${renderIcon('xmark', { size: 14 })}
            </button>
          </div>
        `
      )}
    `;
  }

  _remove(id) {
    this._items = this._items.filter((t) => t.id !== id);
  }
}

customElements.define('dgonmej-ui-toast', DgonmejUiToast);
