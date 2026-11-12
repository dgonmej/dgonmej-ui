import { LitElement, html, css } from 'lit';
import { hostBase, material } from '../../shared/styles.js';

/**
 * <dgonmej-ui-nav-bar heading="Ajustes" large scroll-target="#contenedor">
 *   <dgonmej-ui-button slot="leading" variant="ghost">Atras</dgonmej-ui-button>
 *   <dgonmej-ui-button slot="trailing" variant="ghost">Editar</dgonmej-ui-button>
 * </dgonmej-ui-nav-bar>
 * Barra superior pegajosa estilo iOS: transparente arriba del todo y con material
 * translucido al hacer scroll. `large` muestra un titulo grande que se recoge al bajar.
 * Por defecto observa el scroll de la ventana; `scroll-target` acepta un selector.
 * `--ui-nav-bar-max-width` alinea su contenido con el de la pagina.
 * Parts: 'bar', 'title', 'large-title'
 */
export class DgonmejUiNavBar extends LitElement {
  static properties = {
    heading: { type: String },
    large: { type: Boolean, reflect: true },
    scrollTarget: { type: String, attribute: 'scroll-target' },
    _scrolled: { state: true },
  };

  static styles = [
    hostBase,
    material,
    css`
      :host {
        position: sticky;
        top: 0;
        z-index: 10;
        display: block;
      }

      /* --ui-nav-bar-max-width alinea la barra con el contenido de la pagina */
      .bar > *,
      .large-title {
        box-sizing: border-box;
      }

      .bar {
        --_inset: max(var(--ui-space-2, 8px), (100% - var(--ui-nav-bar-max-width, 100%)) / 2);
        display: grid;
        /* Cada lado toma al menos lo que necesita su contenido; el titulo queda centrado si cabe */
        grid-template-columns: minmax(max-content, 1fr) auto minmax(max-content, 1fr);
        align-items: center;
        gap: var(--ui-space-2, 8px);
        min-height: var(--ui-control-height, 44px);
        /* Aire vertical: el resaltado de los botones no llega al borde de la ventana */
        padding: calc(env(safe-area-inset-top) + 6px) var(--_inset) 6px;
        /* En horizontal, la isla dinamica ocupa un lateral: no meter controles debajo */
        padding-left: max(var(--_inset), calc(env(safe-area-inset-left) + var(--ui-space-2, 8px)));
        padding-right: max(var(--_inset), calc(env(safe-area-inset-right) + var(--ui-space-2, 8px)));
        border-width: 0 0 1px;
        transition:
          background-color var(--_base) var(--_ease),
          border-color var(--_base) var(--_ease);
      }

      /* Arriba del todo: sin material ni separador */
      :host(:not([scrolled])) .bar.material {
        background: transparent;
        border-color: transparent;
        -webkit-backdrop-filter: none;
        backdrop-filter: none;
      }

      :host([scrolled]) .bar.material {
        border-bottom-color: var(--ui-color-separator, rgb(60 60 67 / 0.14));
      }

      .leading {
        justify-self: start;
        display: flex;
        /* Controles de distinta altura quedan centrados entre si */
        align-items: center;
        gap: var(--ui-space-1, 4px);
      }

      .trailing {
        justify-self: end;
        display: flex;
        align-items: center;
        gap: var(--ui-space-1, 4px);
      }

      .title {
        overflow: hidden;
        max-width: 100%;
        color: var(--ui-color-text, #1d1d1f);
        font-size: var(--ui-font-size-body, 1.0625rem);
        font-weight: 600;
        text-overflow: ellipsis;
        white-space: nowrap;
        transition: opacity var(--_fast) ease-out;
      }

      :host([large]:not([scrolled])) .title {
        opacity: 0;
      }

      .large-title {
        margin: 0;
        padding: var(--ui-space-1, 4px) max(var(--ui-space-4, 16px), (100% - var(--ui-nav-bar-max-width, 100%)) / 2 + var(--ui-space-1, 4px)) var(--ui-space-2, 8px);
        padding-left: max(var(--ui-space-4, 16px), (100% - var(--ui-nav-bar-max-width, 100%)) / 2 + var(--ui-space-1, 4px), calc(env(safe-area-inset-left) + var(--ui-space-4, 16px)));
        color: var(--ui-color-text, #1d1d1f);
        font-family: var(--ui-font-family-display, -apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif);
        font-size: var(--ui-font-size-large-title, 2.125rem);
        font-weight: 700;
        letter-spacing: var(--ui-letter-spacing-tight, -0.02em);
        line-height: 1.1;
        transform-origin: left bottom;
        transition:
          opacity var(--_base) var(--_ease),
          transform var(--_base) var(--_ease);
      }

      :host([scrolled]) .large-title {
        opacity: 0;
        transform: scale(0.94);
        pointer-events: none;
      }

      /* El titulo grande no ocupa sitio en la barra pegajosa: se superpone al contenido */
      .large-wrap {
        position: absolute;
        left: 0;
        right: 0;
        top: 100%;
      }

      :host([large]) {
        margin-bottom: calc(var(--ui-font-size-large-title, 2.125rem) * 1.1 + var(--ui-space-6, 24px));
      }

      @media (prefers-reduced-motion: reduce) {
        .large-title {
          transform: none !important;
        }
      }
    `,
  ];

  constructor() {
    super();
    this.heading = '';
    this.large = false;
    this._scrolled = false;
    this._onScroll = this._onScroll.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    // Esperar a que el resto del documento exista para resolver scroll-target
    requestAnimationFrame(() => this._attach());
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._target?.removeEventListener('scroll', this._onScroll);
  }

  _attach() {
    this._target?.removeEventListener('scroll', this._onScroll);
    const root = this.getRootNode();
    this._target = (this.scrollTarget && root.querySelector?.(this.scrollTarget)) || window;
    this._target.addEventListener('scroll', this._onScroll, { passive: true });
    this._onScroll();
  }

  _onScroll() {
    const y = this._target === window ? window.scrollY : this._target.scrollTop;
    const scrolled = y > 4;
    if (scrolled !== this._scrolled) {
      this._scrolled = scrolled;
      this.toggleAttribute('scrolled', scrolled);
    }
  }

  render() {
    return html`
      <div class="bar material" part="bar">
        <div class="leading"><slot name="leading"></slot></div>
        <div class="title" part="title" aria-hidden=${this.large && !this._scrolled ? 'true' : 'false'}>${this.heading}</div>
        <div class="trailing"><slot name="trailing"></slot></div>
      </div>
      ${this.large
        ? html`<div class="large-wrap"><h1 class="large-title" part="large-title">${this.heading}</h1></div>`
        : ''}
    `;
  }
}

customElements.define('dgonmej-ui-nav-bar', DgonmejUiNavBar);
