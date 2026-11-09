import { LitElement, html, css } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { hostBase } from '../../shared/styles.js';

let uid = 0;

/**
 * <dgonmej-ui-dialog heading="Eliminar factura" description="..." size="small|medium|large" light-dismiss>
 *   Contenido opcional
 *   <dgonmej-ui-button slot="actions" variant="secondary" data-close>Cancelar</dgonmej-ui-button>
 *   <dgonmej-ui-button slot="actions" variant="danger" data-close="confirm">Eliminar</dgonmej-ui-button>
 * </dgonmej-ui-dialog>
 *
 * Usa <dialog> nativo en modo modal: foco atrapado, Esc para cerrar y capa superior.
 * Abrir: `el.show()` o `el.open = true`. Cerrar: `el.close(valor)`.
 * Cualquier elemento con `data-close` dentro lo cierra; su valor es el returnValue.
 * `light-dismiss`: cerrar tambien al pulsar fuera.
 * `inline`: se muestra abierto dentro de la pagina, sin modal ni fondo (para previsualizar o documentar).
 * Evento: 'ui-close' con detail = { returnValue }
 * Parts: 'dialog', 'header', 'body', 'actions'
 */
export class DgonmejUiDialog extends LitElement {
  static properties = {
    open: { type: Boolean, reflect: true },
    heading: { type: String },
    description: { type: String },
    lightDismiss: { type: Boolean, attribute: 'light-dismiss' },
    size: { type: String, reflect: true },
    inline: { type: Boolean, reflect: true },
  };

  static styles = [
    hostBase,
    css`
      dialog {
        box-sizing: border-box;
        width: min(420px, calc(100vw - 2 * var(--ui-space-4, 16px)));
        max-height: calc(100dvh - 2 * var(--ui-space-8, 32px));
        margin: auto;
        padding: 0;
        overflow: auto;
        border: 0;
        border-radius: var(--ui-radius-lg, 16px);
        color: var(--ui-color-text, #1d1d1f);
        background: var(--ui-color-surface, #fff);
        box-shadow: var(--ui-shadow-lg, 0 2px 6px rgb(0 0 0 / 0.06), 0 24px 48px -16px rgb(0 0 0 / 0.22));
        opacity: 0;
        transform: scale(0.96);
        transition:
          opacity var(--_base) var(--_ease),
          transform var(--_base) var(--_ease);
      }

      :host([size='small']) dialog {
        width: min(340px, calc(100vw - 2 * var(--ui-space-4, 16px)));
      }

      :host([size='large']) dialog {
        width: min(600px, calc(100vw - 2 * var(--ui-space-4, 16px)));
      }

      dialog::backdrop {
        background: var(--ui-color-backdrop, rgb(0 0 0 / 0.32));
        -webkit-backdrop-filter: blur(4px);
        backdrop-filter: blur(4px);
        opacity: 0;
        transition: opacity var(--_base) var(--_ease);
      }

      dialog[data-state='open'] {
        opacity: 1;
        transform: none;
      }

      :host([inline]) {
        display: block;
      }

      :host([inline]) dialog {
        position: static;
        max-height: none;
        opacity: 1;
        transform: none;
      }

      dialog[data-state='open']::backdrop {
        opacity: 1;
      }

      dialog:focus-visible {
        outline: none;
      }

      .header {
        padding: var(--ui-space-6, 24px) var(--ui-space-6, 24px) 0;
      }

      h2 {
        margin: 0;
        font-size: var(--ui-font-size-title3, 1.25rem);
        font-weight: 700;
        letter-spacing: -0.01em;
        line-height: 1.25;
      }

      .description {
        margin: var(--ui-space-2, 8px) 0 0;
        color: var(--ui-color-text-muted, #6e6e73);
        font-size: var(--ui-font-size-subhead, 0.9375rem);
        line-height: var(--ui-line-height-body, 1.45);
      }

      .body {
        padding: var(--ui-space-4, 16px) var(--ui-space-6, 24px) 0;
        font-size: var(--ui-font-size-body, 1.0625rem);
        line-height: var(--ui-line-height-body, 1.45);
      }

      .body:not(:has(*)) {
        padding-top: 0;
      }

      .actions {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-end;
        gap: var(--ui-space-2, 8px);
        padding: var(--ui-space-6, 24px);
      }

      /* En pantallas estrechas las acciones ocupan todo el ancho, como las alertas de iOS */
      @media (max-width: 479px) {
        .actions ::slotted(*) {
          flex: 1 1 auto;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        dialog {
          transform: none;
        }
      }
    `,
  ];

  constructor() {
    super();
    this._id = `ui-dialog-${++uid}`;
    this.open = false;
    this.heading = '';
    this.description = '';
    this.lightDismiss = false;
    this.size = 'medium';
    this._returnValue = '';
  }

  get _dialog() {
    return this.renderRoot.querySelector('dialog');
  }

  show() {
    this.open = true;
  }

  close(returnValue = '') {
    this._returnValue = returnValue;
    this.open = false;
  }

  updated(changed) {
    if (changed.has('inline')) {
      const dialog = this._dialog;
      if (this.inline) {
        if (dialog.open && dialog.matches(':modal')) dialog.close();
        dialog.show();
        dialog.setAttribute('data-state', 'open');
      } else if (!this.open && dialog.open) {
        dialog.close();
      }
    }
    if (changed.has('open') && !this.inline) {
      if (this.open) this._animateIn();
      else if (changed.get('open')) this._animateOut();
    }
  }

  _animateIn() {
    const dialog = this._dialog;
    if (!dialog || dialog.open) return;
    dialog.showModal();
    // Un frame despues para que la transicion arranque desde el estado cerrado
    requestAnimationFrame(() => dialog.setAttribute('data-state', 'open'));
  }

  _animateOut() {
    const dialog = this._dialog;
    if (!dialog || !dialog.open) return;
    dialog.removeAttribute('data-state');
    const duration = parseFloat(getComputedStyle(dialog).transitionDuration) * 1000 || 0;
    setTimeout(() => {
      dialog.close();
      this.dispatchEvent(
        new CustomEvent('ui-close', { detail: { returnValue: this._returnValue }, bubbles: true, composed: true })
      );
    }, duration);
  }

  _renderGrabber() {
    return '';
  }

  render() {
    const headingId = `${this._id}-heading`;
    const descriptionId = `${this._id}-description`;
    return html`
      <dialog
        part="dialog"
        aria-labelledby=${ifDefined(this.heading ? headingId : undefined)}
        aria-describedby=${ifDefined(this.description ? descriptionId : undefined)}
        @cancel=${this._onCancel}
        @click=${this._onClick}
      >
        ${this._renderGrabber()}
        ${this.heading || this.description
          ? html`<div class="header" part="header">
              ${this.heading ? html`<h2 id=${headingId}>${this.heading}</h2>` : ''}
              ${this.description ? html`<p id=${descriptionId} class="description">${this.description}</p>` : ''}
            </div>`
          : ''}
        <div class="body" part="body"><slot></slot></div>
        <div class="actions" part="actions"><slot name="actions"></slot></div>
      </dialog>
    `;
  }

  _onCancel(e) {
    e.preventDefault();
    this.close('cancel');
  }

  _onClick(e) {
    const closer = e.composedPath().find((el) => el instanceof Element && el.hasAttribute?.('data-close'));
    if (closer) {
      this.close(closer.getAttribute('data-close') || '');
      return;
    }
    if (this.lightDismiss && e.target === this._dialog) {
      const r = this._dialog.getBoundingClientRect();
      const outside = e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
      if (outside) this.close('dismiss');
    }
  }
}

customElements.define('dgonmej-ui-dialog', DgonmejUiDialog);
