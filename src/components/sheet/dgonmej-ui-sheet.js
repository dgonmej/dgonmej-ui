import { html, css } from 'lit';
import { DgonmejUiDialog } from '../dialog/dgonmej-ui-dialog.js';

/**
 * <dgonmej-ui-sheet heading="Filtros" light-dismiss> ... </dgonmej-ui-sheet>
 * Misma API que dgonmej-ui-dialog. En movil sube desde abajo (hoja estilo iOS)
 * y se puede cerrar arrastrando hacia abajo; en escritorio se muestra centrada.
 * Evento: 'ui-close' con detail = { returnValue }
 */
export class DgonmejUiSheet extends DgonmejUiDialog {
  static styles = [
    DgonmejUiDialog.styles,
    css`
      .grabber {
        display: none;
      }

      @media (max-width: 639px) {
        dialog {
          width: 100%;
          max-width: none;
          max-height: calc(100dvh - var(--ui-space-8, 32px) - env(safe-area-inset-top));
          margin: auto 0 0;
          border-radius: var(--ui-radius-lg, 16px) var(--ui-radius-lg, 16px) 0 0;
          padding-bottom: env(safe-area-inset-bottom);
          opacity: 1;
          transform: translateY(100%);
          transition: transform var(--_slow) var(--_ease);
        }

        dialog[data-state='open'] {
          transform: translateY(var(--_drag, 0px));
        }

        dialog.dragging {
          transition: none;
        }

        .grabber {
          display: flex;
          justify-content: center;
          padding: var(--ui-space-2, 8px) 0 0;
          touch-action: none;
          cursor: grab;
        }

        .grabber span {
          width: 36px;
          height: 5px;
          border-radius: var(--ui-radius-pill, 999px);
          background: var(--ui-color-fill-strong, rgb(120 120 128 / 0.22));
        }

        .header {
          padding-top: var(--ui-space-3, 12px);
        }

        @media (prefers-reduced-motion: reduce) {
          dialog {
            transform: none;
            opacity: 0;
            transition: opacity var(--_base) linear;
          }
          dialog[data-state='open'] {
            opacity: 1;
            transform: none;
          }
        }
      }
    `,
  ];

  _renderGrabber() {
    return html`<div
      class="grabber"
      aria-hidden="true"
      @pointerdown=${this._onDragStart}
      @pointermove=${this._onDragMove}
      @pointerup=${this._onDragEnd}
      @pointercancel=${this._onDragEnd}
    >
      <span></span>
    </div>`;
  }

  _onDragStart(e) {
    this._dragStartY = e.clientY;
    e.currentTarget.setPointerCapture(e.pointerId);
    this._dialog.classList.add('dragging');
  }

  _onDragMove(e) {
    if (this._dragStartY == null) return;
    const delta = Math.max(0, e.clientY - this._dragStartY);
    this._dialog.style.setProperty('--_drag', `${delta}px`);
  }

  _onDragEnd(e) {
    if (this._dragStartY == null) return;
    const delta = e.clientY - this._dragStartY;
    this._dragStartY = null;
    this._dialog.classList.remove('dragging');
    this._dialog.style.removeProperty('--_drag');
    if (delta > 100) this.close('dismiss');
  }
}

customElements.define('dgonmej-ui-sheet', DgonmejUiSheet);
