import { LitElement, html, css } from 'lit';
import { hostBase } from '../../shared/styles.js';
import { t } from '../../shared/i18n.js';

// Pares de colores vecinos para el fondo de las iniciales (texto blanco con contraste AA)
const GRADIENTS = [
  ['#0071e3', '#004fa3'],
  ['#5e5ce6', '#3634a3'],
  ['#c4001a', '#8f0013'],
  ['#1a7030', '#0f4d1f'],
  ['#b25000', '#7a3700'],
  ['#8944ab', '#5e2a78'],
  ['#0a7a8f', '#065463'],
];

const initials = (name = '') =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || '')
    .join('');

const hash = (s = '') => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

// El aro de la gota gira animando un ángulo. Para poder animarlo hay que registrar la
// propiedad, y @property no funciona dentro de Shadow DOM: se registra una vez desde aquí.
if (typeof CSS !== 'undefined' && CSS.registerProperty) {
  try {
    CSS.registerProperty({ name: '--ui-avatar-angle', syntax: '<angle>', inherits: false, initialValue: '200deg' });
  } catch {
    // Ya registrada (por ejemplo, si el módulo se carga dos veces)
  }
}

/**
 * <dgonmej-ui-avatar name="Diego Gonzalez" src="foto.jpg" size="sm|md|lg|xl"
 *   shape="circle|rounded|blob" status="online|away|busy" ring>
 * Si no hay imagen (o falla), muestra las iniciales sobre un gradiente que depende del nombre.
 * `ring`: aro con el gradiente del acento. `status`: punto de estado (se anuncia junto al nombre).
 * `shape="blob"`: forma de gota de agua que cambia sin moverse de sitio y flota suavemente; con
 *   `ring`, el aro es un degradado que gira (colores --ui-color-ring-1/2/3). Con «reducir
 *   movimiento» se queda redonda y quieta.
 * `--ui-avatar-size`: tamaño libre (p. ej. 128px), por encima de `size`.
 * Parts: 'avatar', 'image' (p. ej. ::part(image) { object-position: 50% 20% } para encuadrar la foto)
 */
export class DgonmejUiAvatar extends LitElement {
  static properties = {
    name: { type: String },
    src: { type: String },
    size: { type: String, reflect: true },
    ring: { type: Boolean, reflect: true },
    shape: { type: String, reflect: true },
    status: { type: String, reflect: true },
    _failed: { state: true },
  };

  static styles = [
    hostBase,
    css`
      :host {
        --_size: 44px;
        /* Tamaño final: el libre (--ui-avatar-size) o el de "size" */
        --_s: var(--ui-avatar-size, var(--_size));
        --_shape: 50%;
        position: relative;
        display: inline-block;
        width: var(--_s);
        height: var(--_s);
        flex: none;
        vertical-align: middle;
      }

      :host([size='sm']) {
        --_size: 32px;
      }
      :host([size='lg']) {
        --_size: 64px;
      }
      :host([size='xl']) {
        --_size: 112px;
      }
      :host([shape='rounded']) {
        --_shape: calc(var(--_s) * 0.24 * var(--ui-radius-scale, 1));
      }

      .status {
        position: absolute;
        right: 0;
        bottom: 0;
        width: max(10px, calc(var(--_s) * 0.24));
        height: max(10px, calc(var(--_s) * 0.24));
        border-radius: 50%;
        box-shadow: 0 0 0 2px var(--ui-color-surface, #fff);
      }
      :host([shape='rounded']) .status {
        right: -2px;
        bottom: -2px;
      }
      .status.online {
        background: var(--ui-color-success, #1a7030);
      }
      .status.away {
        background: var(--ui-color-warning, #9a4a00);
      }
      .status.busy {
        background: var(--ui-color-danger, #c4001a);
      }

      .avatar {
        display: grid;
        place-items: center;
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        overflow: hidden;
        border-radius: var(--_shape);
        color: #fff;
        font-size: calc(var(--_s) * 0.38);
        font-weight: 600;
        letter-spacing: 0.01em;
        user-select: none;
      }

      :host([ring]) .avatar {
        padding: calc(var(--_s) * 0.04);
        background: var(--ui-gradient-primary, linear-gradient(180deg, #0071e3 0%, #005bbf 100%));
      }

      .inner {
        display: grid;
        place-items: center;
        width: 100%;
        height: 100%;
        overflow: hidden;
        border-radius: var(--_shape);
        background: linear-gradient(160deg, var(--_from), var(--_to));
      }

      /* Con foto, las zonas transparentes muestran la superficie, no el degradado de las iniciales */
      .inner.has-image {
        background: var(--ui-color-surface, #fff);
      }

      :host([ring]) .inner {
        box-shadow: 0 0 0 calc(var(--_s) * 0.03) var(--ui-color-surface, #fff);
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      /*
       * Gota de agua. Lo que funciona en Safari (iPhone):
       * - La forma la anima .avatar y la recorta (overflow), y la foto la sigue con "inherit".
       * - El giro del aro va en otra capa (::before): si la forma y el giro se animan en el
       *   mismo elemento, Safari deja de animar la forma.
       * - La capa del aro mide lo mismo que la foto (no más) para que no asome ningún cuadrado.
       */
      :host([shape='blob']) .inner {
        border-radius: inherit;
      }

      :host([shape='blob'][ring]) .avatar {
        position: relative;
        isolation: isolate;
        background: none;
        box-shadow: 0 calc(var(--_s) * 0.1) calc(var(--_s) * 0.26) calc(var(--_s) * -0.08)
          var(--ui-color-primary-glow, rgb(0 113 227 / 0.4));
      }

      :host([shape='blob'][ring]) .avatar::before {
        content: '';
        position: absolute;
        inset: 0;
        z-index: -1;
        border-radius: inherit;
        background: conic-gradient(
          from var(--ui-avatar-angle, 200deg),
          var(--ui-color-ring-1, #0071e3),
          var(--ui-color-ring-2, #32ade6),
          var(--ui-color-ring-3, #5e5ce6),
          var(--ui-color-ring-1, #0071e3)
        );
      }

      @media (prefers-reduced-motion: no-preference) {
        :host([shape='blob']) .avatar {
          animation:
            blob var(--ui-duration-ambient, 4s) ease-in-out infinite alternate,
            float calc(var(--ui-duration-ambient, 4s) * 0.65) ease-in-out infinite alternate;
        }
        :host([shape='blob'][ring]) .avatar::before {
          animation: spin calc(var(--ui-duration-ambient, 4s) * 1.25) linear infinite;
        }
      }

      @keyframes blob {
        0% {
          border-radius: 62% 38% 56% 44% / 50% 62% 38% 50%;
        }
        33% {
          border-radius: 42% 58% 38% 62% / 62% 42% 58% 38%;
        }
        66% {
          border-radius: 63% 37% 46% 54% / 40% 56% 44% 60%;
        }
        100% {
          border-radius: 46% 54% 62% 38% / 56% 40% 60% 44%;
        }
      }

      @keyframes float {
        from {
          transform: translateY(0) scale(1);
        }
        to {
          transform: translateY(calc(var(--_s) * -0.025)) scale(1.02);
        }
      }

      @keyframes spin {
        from {
          --ui-avatar-angle: 200deg;
        }
        to {
          --ui-avatar-angle: 560deg;
        }
      }
    `,
  ];

  constructor() {
    super();
    this.name = '';
    this.src = '';
    this.size = 'md';
    this.ring = false;
    this.shape = 'circle';
    this.status = '';
    this._failed = false;
  }

  updated(changed) {
    if (changed.has('src')) this._failed = false;
  }

  get _statusText() {
    return ['online', 'away', 'busy'].includes(this.status) ? t(this, `avatar.${this.status}`) : '';
  }

  render() {
    const [from, to] = GRADIENTS[hash(this.name) % GRADIENTS.length];
    const showImage = this.src && !this._failed;
    return html`
      <div class="avatar" part="avatar" role="img" aria-label=${[this.name || t(this, 'avatar.label'), this._statusText].filter(Boolean).join(', ')}>
        <div class="inner ${showImage ? 'has-image' : ''}" style="--_from: ${from}; --_to: ${to}">
          ${showImage
            ? html`<img part="image" src=${this.src} alt="" @error=${() => (this._failed = true)} />`
            : html`<span aria-hidden="true">${initials(this.name)}</span>`}
        </div>
      </div>
      ${this._statusText ? html`<span class="status ${this.status}" aria-hidden="true"></span>` : ''}
    `;
  }
}

customElements.define('dgonmej-ui-avatar', DgonmejUiAvatar);
