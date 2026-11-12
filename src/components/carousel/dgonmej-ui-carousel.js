import { LitElement, html, css } from 'lit';
import '../button/dgonmej-ui-button.js';
import { renderIcon } from '../../shared/icons.js';
import { t } from '../../shared/i18n.js';

/**
 * <dgonmej-ui-carousel label="..." autoplay="5">
 *   <img src="..." alt="..." />
 *   <img src="..." alt="..." />
 * </dgonmej-ui-carousel>
 * Controles de vidrio flotando sobre el contenido (flechas solo con raton).
 * Navegable con flechas del teclado y con gesto de deslizar en pantallas tactiles.
 * autoplay: segundos entre diapositivas (0 = desactivado). Se pausa al pasar el raton o
 * enfocar, con el boton de pausa, y no arranca si el usuario prefiere movimiento reducido.
 * Evento: 'ui-change' con detail = { index }
 * Parts: 'viewport', 'dots'
 */
export class DgonmejUiCarousel extends LitElement {
  static properties = {
    index: { type: Number },
    label: { type: String },
    autoplay: { type: Number },
    _count: { state: true },
    _userPaused: { state: true },
  };

  static styles = css`
    :host {
      display: block;
      /* No imponer el ancho de las diapositivas a su contenedor */
      min-width: 0;
      font-family: var(--ui-font-family, -apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif);
      --_ease: var(--ui-ease-standard, cubic-bezier(0.32, 0.72, 0, 1));
      --_slow: var(--ui-duration-slow, 400ms);
      --_fast: var(--ui-duration-fast, 160ms);
    }

    .viewport {
      position: relative;
      overflow: hidden;
      border-radius: var(--ui-radius-lg, 16px);
      box-shadow: var(--ui-shadow-md, 0 1px 3px rgb(0 0 0 / 0.06), 0 8px 24px -8px rgb(0 0 0 / 0.14));
      touch-action: pan-y;
      /* Aisla el contexto de apilado para que el radio recorte bien en Safari */
      isolation: isolate;
    }

    .viewport:focus-visible {
      outline: 2px solid var(--ui-color-focus, #0071e3);
      outline-offset: 3px;
    }

    .track {
      display: flex;
      transition: transform var(--_slow) var(--_ease);
      will-change: transform;
    }

    ::slotted(*) {
      flex: 0 0 100%;
      width: 100%;
      min-width: 0;
      box-sizing: border-box;
      display: block;
    }

    .nav {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      transition: opacity var(--_fast) ease-out;
    }

    .nav.prev {
      left: var(--ui-space-3, 12px);
    }

    .nav.next {
      right: var(--ui-space-3, 12px);
    }

    /* Con raton, los controles aparecen al pasar por encima o al enfocar */
    @media (hover: hover) {
      .nav {
        opacity: 0;
      }
      .viewport:hover .nav,
      .viewport:focus-within .nav {
        opacity: 1;
      }
    }

    /* En tactil se navega deslizando y con los puntos, como en iOS */
    @media (hover: none) {
      .nav {
        display: none;
      }
    }

    .nav svg {
      width: 10px;
      height: 16px;
    }

    .dots {
      position: absolute;
      left: 50%;
      bottom: var(--ui-space-3, 12px);
      transform: translateX(-50%);
      display: flex;
      gap: 2px;
      padding: 2px var(--ui-space-1, 4px);
      border-radius: var(--ui-radius-pill, 999px);
      background: var(--ui-material-bg, rgb(250 250 252 / 0.94));
      border: 1px solid var(--ui-material-border, rgb(255 255 255 / 0.55));
    }

    @supports (backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)) {
      .dots {
        background: var(--ui-material-bg-translucent, rgb(255 255 255 / 0.6));
        -webkit-backdrop-filter: var(--ui-material-blur, blur(20px) saturate(180%));
        backdrop-filter: var(--ui-material-blur, blur(20px) saturate(180%));
      }
    }

    .dot {
      display: grid;
      place-items: center;
      width: 20px;
      height: 20px;
      padding: 0;
      border: 0;
      background: transparent;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
    }

    .dot::before {
      content: '';
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--ui-material-text, #1d1d1f);
      opacity: 0.3;
      transition:
        opacity var(--_fast) ease-out,
        transform var(--_fast) var(--_ease);
    }

    .dot[aria-current='true']::before {
      opacity: 0.9;
      transform: scale(1.15);
    }

    .pause {
      display: grid;
      place-items: center;
      width: 20px;
      height: 20px;
      margin-left: 2px;
      padding: 0;
      border: 0;
      border-radius: 50%;
      color: var(--ui-material-text, #1d1d1f);
      background: transparent;
      opacity: 0.75;
      cursor: pointer;
    }

    .pause:focus-visible,
    .dot:focus-visible {
      outline: 2px solid var(--ui-color-focus, #0071e3);
      outline-offset: -2px;
      border-radius: 50%;
    }

    @media (prefers-reduced-motion: reduce) {
      .track {
        transition: none;
      }
      .dot::before {
        transition: opacity var(--_fast) linear;
      }
      .dot[aria-current='true']::before {
        transform: none;
      }
    }
  `;

  constructor() {
    super();
    this.index = 0;
    this.label = '';
    this._count = 0;
    this._pointerStartX = null;
    this.autoplay = 0;
    this._userPaused = false;
    this._hoverPaused = false;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._stopTimer();
  }

  get _canAutoplay() {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    return this.autoplay > 0 && this._count > 1 && !reduce;
  }

  _syncTimer() {
    this._stopTimer();
    if (this._canAutoplay && !this._userPaused && !this._hoverPaused) {
      this._timer = setInterval(() => this._next(), this.autoplay * 1000);
    }
    // aria-live depende de si avanza solo
    const track = this.renderRoot?.querySelector('.track');
    track?.setAttribute('aria-live', this._timer ? 'off' : 'polite');
  }

  _stopTimer() {
    clearInterval(this._timer);
    this._timer = null;
  }

  _setHoverPaused(paused) {
    this._hoverPaused = paused;
    this._syncTimer();
  }

  updated(changed) {
    if (changed.has('index') || changed.has('_count')) {
      this._syncSlides();
    }
    if (changed.has('autoplay') || changed.has('_count') || changed.has('_userPaused')) {
      this._syncTimer();
    }
  }

  render() {
    const trackStyle = `transform: translateX(-${this.index * 100}%)`;
    return html`
      <div
        class="viewport"
        part="viewport"
        role="region"
        aria-roledescription=${t(this, 'carousel.roledescription')}
        aria-label=${this.label || t(this, 'carousel.label')}
        tabindex="0"
        @keydown=${this._onKeydown}
        @pointerdown=${this._onPointerDown}
        @pointerup=${this._onPointerUp}
        @pointercancel=${this._onPointerCancel}
        @pointerenter=${() => this._setHoverPaused(true)}
        @pointerleave=${() => this._setHoverPaused(false)}
        @focusin=${() => this._setHoverPaused(true)}
        @focusout=${() => this._setHoverPaused(false)}
      >
        <div class="track" style=${trackStyle} aria-live=${this._timer ? 'off' : 'polite'}>
          <slot @slotchange=${this._updateCount}></slot>
        </div>

        ${this._count > 1
          ? html`
              <dgonmej-ui-button class="nav prev" variant="glass" icon label=${t(this, 'carousel.prev')} @ui-click=${this._prev}>
                <svg viewBox="0 0 10 16" aria-hidden="true">
                  <path d="M8 2L2 8l6 6" fill="none" stroke="currentColor" stroke-width="2.2"
                    stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </dgonmej-ui-button>
              <dgonmej-ui-button class="nav next" variant="glass" icon label=${t(this, 'carousel.next')} @ui-click=${this._next}>
                <svg viewBox="0 0 10 16" aria-hidden="true">
                  <path d="M2 2l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.2"
                    stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </dgonmej-ui-button>
              <div class="dots" part="dots">
                ${Array.from({ length: this._count }, (_, i) => html`
                  <button
                    class="dot"
                    type="button"
                    aria-label=${t(this, 'carousel.goTo', { n: i + 1, total: this._count })}
                    aria-current=${i === this.index ? 'true' : 'false'}
                    @click=${() => this._goTo(i)}
                  ></button>
                `)}
                ${this._canAutoplay
                  ? html`<button
                      class="pause"
                      type="button"
                      aria-label=${t(this, this._userPaused ? 'carousel.resume' : 'carousel.pause')}
                      @click=${() => (this._userPaused = !this._userPaused)}
                    >
                      ${renderIcon(this._userPaused ? 'play' : 'pause', { size: 12 })}
                    </button>`
                  : ''}
              </div>
            `
          : ''}
      </div>
    `;
  }

  _slides() {
    const slot = this.renderRoot.querySelector('slot');
    return slot ? slot.assignedElements() : [];
  }

  // Se cuenta antes de renderizar (hijos en light DOM) para no provocar un segundo render
  willUpdate() {
    this._count = this.children.length;
  }

  _updateCount() {
    this.requestUpdate();
  }

  // Solo la diapositiva visible es accesible; el resto queda fuera del foco y del lector.
  _syncSlides() {
    this._slides().forEach((el, i) => {
      const active = i === this.index;
      el.toggleAttribute('inert', !active);
      el.setAttribute('aria-hidden', String(!active));
    });
  }

  _prev(e) {
    e?.stopPropagation();
    if (this._count === 0) return;
    this._goTo((this.index - 1 + this._count) % this._count);
  }

  _next(e) {
    e?.stopPropagation();
    if (this._count === 0) return;
    this._goTo((this.index + 1) % this._count);
  }

  _goTo(i) {
    if (i === this.index) return;
    this.index = i;
    this.dispatchEvent(new CustomEvent('ui-change', { detail: { index: i }, bubbles: true, composed: true }));
  }

  _onKeydown(e) {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      this._prev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      this._next();
    }
  }

  _onPointerDown(e) {
    if (e.pointerType === 'mouse') return;
    this._pointerStartX = e.clientX;
  }

  _onPointerUp(e) {
    if (this._pointerStartX === null) return;
    const delta = e.clientX - this._pointerStartX;
    this._pointerStartX = null;
    if (Math.abs(delta) < 40) return;
    delta < 0 ? this._next() : this._prev();
  }

  _onPointerCancel() {
    this._pointerStartX = null;
  }
}

customElements.define('dgonmej-ui-carousel', DgonmejUiCarousel);
