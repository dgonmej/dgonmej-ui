import { LitElement, html, css } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { hostBase } from '../../shared/styles.js';

/**
 * <dgonmej-ui-card elevation="flat|raised|floating" layout="vertical|horizontal"
 *   padding="compact|regular|spacious" glass href="/detalle" interactive>
 *   <img slot="media" src="..." alt="..." />
 *   <div slot="header"><dgonmej-ui-avatar ...></dgonmej-ui-avatar> Titulo</div>
 *   Contenido
 *   <div slot="footer">Acciones</div>
 * </dgonmej-ui-card>
 * - elevation: profundidad de la sombra (por defecto 'raised').
 * - layout: 'horizontal' pone la imagen al lado (vuelve a vertical si la tarjeta es estrecha).
 * - padding: aire interior.
 * - glass: material translucido (solo sobre contenido o fondos con color).
 * - href: toda la tarjeta es un enlace. interactive: respuesta al pasar y pulsar sin ser enlace.
 * Las zonas media, header y footer solo aparecen si tienen contenido.
 * Se adapta al ancho de su contenedor (container queries): dale ancho desde fuera
 * (bloque, grid o flex con `flex: 1`); en un flex que ajusta al contenido quedaria a 0.
 * Parts: 'card', 'media', 'header', 'body', 'footer'
 */
export class DgonmejUiCard extends LitElement {
  static properties = {
    elevation: { type: String, reflect: true },
    layout: { type: String, reflect: true },
    padding: { type: String, reflect: true },
    glass: { type: Boolean, reflect: true },
    interactive: { type: Boolean, reflect: true },
    href: { type: String },
    target: { type: String },
    _filled: { state: true },
  };

  static styles = [
    hostBase,
    css`
      :host {
        --_pad: var(--ui-space-5, 20px);
        display: block;
        container-type: inline-size;
      }

      :host([padding='compact']) {
        --_pad: var(--ui-space-3, 12px);
      }

      :host([padding='spacious']) {
        --_pad: var(--ui-space-8, 32px);
      }

      .card {
        display: flex;
        flex-direction: column;
        height: 100%;
        overflow: hidden;
        border-radius: var(--ui-radius-lg, 16px);
        color: var(--ui-color-text, #1d1d1f);
        background: var(--ui-color-surface, #fff);
        box-shadow: var(--ui-shadow-md, 0 1px 3px rgb(0 0 0 / 0.06), 0 8px 24px -8px rgb(0 0 0 / 0.14));
        text-decoration: none;
        transition:
          transform var(--_base) var(--_ease),
          box-shadow var(--_base) var(--_ease);
      }

      :host([elevation='flat']) .card {
        box-shadow: inset 0 0 0 1px var(--ui-color-border, rgb(0 0 0 / 0.08));
      }

      :host([elevation='floating']) .card {
        box-shadow: var(--ui-shadow-lg, 0 2px 6px rgb(0 0 0 / 0.06), 0 24px 48px -16px rgb(0 0 0 / 0.22));
      }

      /* Vidrio: fondo translucido + desenfoque de lo que hay detras + borde de luz.
         Sin soporte de backdrop-filter, cae a un material casi opaco. */
      :host([glass]) .card {
        --ui-color-text-muted: color-mix(in srgb, var(--ui-material-text, #1d1d1f) 72%, transparent);
        color: var(--ui-material-text, #1d1d1f);
        background: var(--ui-material-bg, rgb(250 250 252 / 0.94));
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 0.35),
          inset 0 0 0 1px var(--ui-material-border, rgb(255 255 255 / 0.55)),
          var(--ui-shadow-lg, 0 2px 6px rgb(0 0 0 / 0.06), 0 24px 48px -16px rgb(0 0 0 / 0.22));
      }

      @supports (backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)) {
        :host([glass]) .card {
          background:
            linear-gradient(160deg, rgb(255 255 255 / 0.18), rgb(255 255 255 / 0) 60%),
            var(--ui-material-bg-translucent, rgb(255 255 255 / 0.6));
          -webkit-backdrop-filter: var(--ui-material-blur, blur(20px) saturate(180%));
          backdrop-filter: var(--ui-material-blur, blur(20px) saturate(180%));
        }
      }

      @media (hover: hover) {
        :host([interactive]) .card:hover,
        a.card:hover {
          transform: translateY(-2px);
          box-shadow: var(--ui-shadow-lg, 0 2px 6px rgb(0 0 0 / 0.06), 0 24px 48px -16px rgb(0 0 0 / 0.22));
        }
      }

      :host([interactive]) .card {
        cursor: pointer;
      }

      :host([interactive]) .card:active,
      a.card:active {
        transform: scale(0.98);
      }

      a.card:focus-visible {
        outline: 2px solid var(--_focus);
        outline-offset: 3px;
      }

      .media ::slotted(*) {
        display: block;
        width: 100%;
        aspect-ratio: 16 / 9;
        object-fit: cover;
      }

      .content {
        display: flex;
        flex: 1;
        flex-direction: column;
        min-width: 0;
      }

      .header {
        display: flex;
        align-items: center;
        gap: var(--ui-space-3, 12px);
        padding: var(--_pad) var(--_pad) 0;
        font-weight: 600;
      }

      .body {
        flex: 1;
        padding: var(--_pad);
        font-size: var(--ui-font-size-subhead, 0.9375rem);
        line-height: var(--ui-line-height-body, 1.45);
      }

      .header:not([hidden]) + .body {
        padding-top: var(--ui-space-3, 12px);
      }

      .footer {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: var(--ui-space-2, 8px);
        padding: 0 var(--_pad) var(--_pad);
      }

      /* Imagen al lado en tarjetas anchas */
      @container (min-width: 480px) {
        :host([layout='horizontal']) .card {
          flex-direction: row;
        }
        :host([layout='horizontal']) .media {
          flex: 0 0 40%;
        }
        :host([layout='horizontal']) .media ::slotted(*) {
          height: 100%;
          aspect-ratio: auto;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .card {
          transition: box-shadow var(--_base) linear;
          transform: none !important;
        }
      }
    `,
  ];

  constructor() {
    super();
    this.elevation = 'raised';
    this.layout = 'vertical';
    this.padding = 'regular';
    this.glass = false;
    this.interactive = false;
    this._filled = {};
  }

  render() {
    const slot = (name) => html`<slot name=${name} @slotchange=${this._onSlotChange}></slot>`;
    const inner = html`
      <div class="media" part="media" ?hidden=${!this._filled.media}>${slot('media')}</div>
      <div class="content">
        <div class="header" part="header" ?hidden=${!this._filled.header}>${slot('header')}</div>
        <div class="body" part="body"><slot></slot></div>
        <div class="footer" part="footer" ?hidden=${!this._filled.footer}>${slot('footer')}</div>
      </div>
    `;
    return this.href
      ? html`<a class="card" part="card" href=${this.href} target=${ifDefined(this.target || undefined)}
          rel=${ifDefined(this.target === '_blank' ? 'noopener noreferrer' : undefined)}>${inner}</a>`
      : html`<div class="card" part="card">${inner}</div>`;
  }

  _onSlotChange(e) {
    const { name } = e.target;
    const filled = e.target.assignedElements().length > 0;
    if (this._filled[name] !== filled) this._filled = { ...this._filled, [name]: filled };
  }
}

customElements.define('dgonmej-ui-card', DgonmejUiCard);
