import { LitElement, html, css } from 'lit';
import { hostBase } from '../../shared/styles.js';
import { renderIcon } from '../../shared/icons.js';
import { t } from '../../shared/i18n.js';

const KIND_ICONS = {
  education: 'graduation',
  work: 'briefcase',
  travel: 'plane',
  milestone: 'star',
  start: 'flag',
  end: 'rocket',
};

/**
 * <dgonmej-ui-timeline label="Mi trayectoria" layout="alternate|left|right" static .items=${[
 *   { title, period, kind, description?, highlights?: [], links?: [{ label, href }], current?, side? },
 *   { milestone: true, kind: 'start', title, description? },
 * ]}>
 * Linea temporal vertical.
 * - layout 'alternate' (por defecto): en contenedores anchos alterna los lados; en estrechos,
 *   una sola columna con la linea a la izquierda (umbral: 600px) (container queries: se adapta a su caja).
 *   `side: 'left' | 'right'` en un elemento fuerza su lado.
 * - layout 'right': tarjetas a la derecha de la linea. 'left': a la izquierda (espejo).
 * - static: sin animacion de entrada.
 * kind: 'education' | 'work' | 'travel' | 'milestone' | 'start' | 'end' (elige el icono).
 * `current` resalta el elemento actual. `milestone` lo dibuja como hito centrado.
 * Las entradas aparecen suavemente al entrar en pantalla (salvo movimiento reducido).
 * Se adapta al ancho de su contenedor (container queries): dale ancho desde fuera
 * (bloque, grid o flex con `flex: 1`); en un flex que ajusta al contenido quedaria a 0.
 * Parts: 'timeline', 'item', 'card', 'marker'
 */
export class DgonmejUiTimeline extends LitElement {
  static properties = {
    items: { type: Array },
    label: { type: String },
    layout: { type: String, reflect: true },
    static: { type: Boolean, reflect: true },
  };

  static styles = [
    hostBase,
    css`
      :host {
        display: block;
        container-type: inline-size;
        --_line: 2px;
        --_marker: 36px;
      }

      ol {
        position: relative;
        display: grid;
        gap: var(--ui-space-6, 24px);
        margin: 0;
        padding: 0;
        list-style: none;
      }

      /* Linea vertical con desvanecido en los extremos */
      ol::before {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        left: calc(var(--_marker) / 2 - var(--_line) / 2);
        width: var(--_line);
        border-radius: var(--_line);
        background: linear-gradient(
          to bottom,
          transparent,
          var(--ui-color-fill-strong, rgb(120 120 128 / 0.22)) 6%,
          var(--ui-color-fill-strong, rgb(120 120 128 / 0.22)) 94%,
          transparent
        );
      }

      .item {
        position: relative;
        display: grid;
        grid-template-columns: var(--_marker) minmax(0, 1fr);
        column-gap: var(--ui-space-4, 16px);
        align-items: start;
      }

      .marker {
        position: relative;
        z-index: 1;
        display: grid;
        place-items: center;
        width: var(--_marker);
        height: var(--_marker);
        margin-top: var(--ui-space-4, 16px);
        border-radius: 50%;
        color: var(--ui-color-primary-text, #0066cc);
        background: var(--ui-color-surface, #fff);
        box-shadow:
          inset 0 0 0 1.5px var(--ui-color-primary-tint, rgb(0 113 227 / 0.12)),
          var(--ui-shadow-sm, 0 1px 2px rgb(0 0 0 / 0.06), 0 1px 1px rgb(0 0 0 / 0.04));
      }

      .current .marker {
        color: var(--ui-color-primary-contrast, #fff);
        background: var(--ui-gradient-primary, linear-gradient(180deg, #0071e3 0%, #005bbf 100%));
        box-shadow: 0 6px 16px -6px var(--ui-color-primary-glow, rgb(0 113 227 / 0.4));
      }

      /* Aro que late suavemente en el elemento actual */
      .current .marker::after {
        content: '';
        position: absolute;
        inset: -6px;
        border-radius: 50%;
        border: 2px solid var(--ui-color-primary, #0066cc);
        opacity: 0;
        animation: ring 2.4s var(--_ease) infinite;
      }

      @keyframes ring {
        0% {
          opacity: 0.5;
          transform: scale(0.85);
        }
        100% {
          opacity: 0;
          transform: scale(1.25);
        }
      }

      .card {
        padding: var(--ui-space-5, 20px);
        border-radius: var(--ui-radius-lg, 16px);
        color: var(--ui-color-text, #1d1d1f);
        background: var(--ui-color-surface, #fff);
        box-shadow: var(--ui-shadow-md, 0 1px 3px rgb(0 0 0 / 0.06), 0 8px 24px -8px rgb(0 0 0 / 0.14));
      }

      .current .card {
        box-shadow:
          inset 0 0 0 1.5px var(--ui-color-primary-tint, rgb(0 113 227 / 0.12)),
          var(--ui-shadow-lg, 0 2px 6px rgb(0 0 0 / 0.06), 0 24px 48px -16px rgb(0 0 0 / 0.22));
      }

      .period {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        color: var(--ui-color-primary-text, #0066cc);
        font-size: var(--ui-font-size-footnote, 0.8125rem);
        font-weight: 600;
        font-variant-numeric: tabular-nums;
      }

      .now {
        padding: 2px 8px;
        border-radius: var(--ui-radius-control, 999px);
        color: var(--ui-color-primary-contrast, #fff);
        background: var(--ui-gradient-primary, linear-gradient(180deg, #0071e3 0%, #005bbf 100%));
        font-size: var(--ui-font-size-caption, 0.75rem);
      }

      h3 {
        margin: var(--ui-space-1, 4px) 0 0;
        font-size: var(--ui-font-size-body, 1.0625rem);
        font-weight: 700;
        letter-spacing: -0.01em;
        line-height: 1.3;
      }

      p {
        margin: var(--ui-space-2, 8px) 0 0;
        color: var(--ui-color-text-muted, #6e6e73);
        font-size: var(--ui-font-size-subhead, 0.9375rem);
        line-height: var(--ui-line-height-body, 1.45);
      }

      ul {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin: var(--ui-space-3, 12px) 0 0;
        padding: 0;
        list-style: none;
      }

      ul li {
        display: block;
        padding: 4px 10px;
        border-radius: var(--ui-radius-control, 999px);
        color: var(--ui-color-text, #1d1d1f);
        background: var(--ui-color-fill, rgb(120 120 128 / 0.12));
        font-size: var(--ui-font-size-footnote, 0.8125rem);
      }

      .links {
        display: flex;
        flex-wrap: wrap;
        gap: var(--ui-space-3, 12px);
        margin-top: var(--ui-space-3, 12px);
      }

      .links a {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        color: var(--ui-color-primary-text, #0066cc);
        font-size: var(--ui-font-size-subhead, 0.9375rem);
        font-weight: 600;
        text-decoration: none;
        border-radius: 4px;
      }

      .links a:focus-visible {
        outline: 2px solid var(--_focus);
        outline-offset: 2px;
      }

      @media (hover: hover) {
        .links a:hover {
          text-decoration: underline;
        }
      }

      /* Hitos: tarjeta compacta centrada sobre la linea */
      .item.milestone .card {
        display: flex;
        align-items: center;
        gap: var(--ui-space-3, 12px);
        padding: var(--ui-space-3, 12px) var(--ui-space-5, 20px) var(--ui-space-3, 12px) var(--ui-space-3, 12px);
        border-radius: var(--ui-radius-control, 999px);
        justify-self: start;
      }

      .item.milestone .card .badge-icon {
        display: grid;
        place-items: center;
        flex: none;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        color: #fff;
        background: var(--ui-gradient-primary, linear-gradient(180deg, #0071e3 0%, #005bbf 100%));
      }

      .item.milestone h3 {
        margin: 0;
      }

      .item.milestone p {
        margin: 2px 0 0;
      }

      .item.milestone .marker {
        visibility: hidden;
      }

      /* Aparicion al entrar en pantalla */
      :host([animate]) .item {
        opacity: 0;
        transform: translateY(16px);
        transition:
          opacity var(--_slow) var(--_ease),
          transform var(--_slow) var(--_ease);
      }

      :host([animate]) .item.in,
      :host([static]) .item {
        opacity: 1;
        transform: none;
      }

      :host([static]) .item {
        transition: none;
      }

      /* Tarjetas a la izquierda de la linea (espejo de la vista estrecha) */
      :host([layout='left']) ol::before {
        left: auto;
        right: calc(var(--_marker) / 2 - var(--_line) / 2);
      }

      :host([layout='left']) .item {
        grid-template-columns: minmax(0, 1fr) var(--_marker);
      }

      :host([layout='left']) .item .marker {
        grid-column: 2;
        grid-row: 1;
      }

      :host([layout='left']) .item .card {
        grid-column: 1;
        grid-row: 1;
      }

      :host([layout='left']) .item.milestone .card {
        justify-self: end;
      }

      /* Contenedor ancho: linea centrada y tarjetas alternas */
      @container (min-width: 600px) {
        :host([layout='alternate']) ol::before {
          left: calc(50% - var(--_line) / 2);
        }

        :host([layout='alternate']) .item {
          grid-template-columns: minmax(0, 1fr) var(--_marker) minmax(0, 1fr);
        }

        :host([layout='alternate']) .item .marker {
          grid-column: 2;
          grid-row: 1;
        }

        :host([layout='alternate']) .item:not(.milestone) .card {
          grid-column: 3;
          grid-row: 1;
        }

        :host([layout='alternate']) .item.left:not(.milestone) .card {
          grid-column: 1;
        }

        :host([layout='alternate']) .item.milestone .card {
          grid-column: 1 / -1;
          grid-row: 1;
          justify-self: center;
        }

        :host([layout='alternate'][animate]) .item.left:not(.in) {
          transform: translateX(-16px);
        }

        :host([layout='alternate'][animate]) .item.right:not(.in) {
          transform: translateX(16px);
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .current .marker::after {
          animation: none;
          opacity: 0.4;
        }
      }
    `,
  ];

  constructor() {
    super();
    this.items = [];
    this.label = '';
    this.layout = 'alternate';
    this.static = false;
  }

  connectedCallback() {
    super.connectedCallback();
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if ('IntersectionObserver' in window && !reduce && !this.hasAttribute('static')) {
      this.setAttribute('animate', '');
      this._observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('in');
              this._observer.unobserve(entry.target);
            }
          });
        },
        { rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
      );
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._observer?.disconnect();
  }

  updated() {
    if (!this._observer) return;
    this.renderRoot.querySelectorAll('.item:not(.in)').forEach((li) => this._observer.observe(li));
  }

  render() {
    let side = 0;
    return html`
      <ol part="timeline" aria-label=${this.label || t(this, 'timeline.label')}>
        ${this.items.map((item) => {
          const icon = KIND_ICONS[item.kind] || (item.milestone ? 'star' : 'calendar');
          if (item.milestone) {
            return html`
              <li class="item milestone" part="item">
                <span class="marker" part="marker"></span>
                <div class="card" part="card">
                  <span class="badge-icon">${renderIcon(icon, { size: 20 })}</span>
                  <div>
                    <h3>${item.title}</h3>
                    ${item.description ? html`<p>${item.description}</p>` : ''}
                  </div>
                </div>
              </li>
            `;
          }
          const alternate = side++ % 2 === 0 ? 'right' : 'left';
          const position = this.layout === 'alternate' ? item.side || alternate : this.layout;
          return html`
            <li class="item ${position} ${item.current ? 'current' : ''}" part="item" aria-current=${item.current ? 'step' : 'false'}>
              <span class="marker" part="marker">${renderIcon(icon, { size: 18 })}</span>
              <article class="card" part="card">
                <span class="period">
                  ${item.period}${item.current ? html`<span class="now">${t(this, 'timeline.current')}</span>` : ''}
                </span>
                <h3>${item.title}</h3>
                ${item.description ? html`<p>${item.description}</p>` : ''}
                ${item.highlights?.length ? html`<ul>${item.highlights.map((h) => html`<li>${h}</li>`)}</ul>` : ''}
                ${item.links?.length
                  ? html`<div class="links">
                      ${item.links.map(
                        (l) => html`<a href=${l.href} target="_blank" rel="noopener noreferrer">
                          ${renderIcon('link', { size: 14 })}${l.label}
                        </a>`
                      )}
                    </div>`
                  : ''}
              </article>
            </li>
          `;
        })}
      </ol>
    `;
  }
}

customElements.define('dgonmej-ui-timeline', DgonmejUiTimeline);
