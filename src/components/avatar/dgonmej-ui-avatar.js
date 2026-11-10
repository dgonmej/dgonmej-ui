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

/**
 * <dgonmej-ui-avatar name="Diego Gonzalez" src="foto.jpg" size="sm|md|lg|xl" shape="circle|rounded"
 *   status="online|away|busy" ring>
 * Si no hay imagen (o falla), muestra las iniciales sobre un gradiente que depende del nombre.
 * `ring`: aro con el gradiente del acento. `status`: punto de estado (se anuncia junto al nombre).
 * Parts: 'avatar'
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
        --_shape: 50%;
        position: relative;
        display: inline-block;
        width: var(--_size);
        height: var(--_size);
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
        --_shape: calc(var(--_size) * 0.24 * var(--ui-radius-scale, 1));
      }

      .status {
        position: absolute;
        right: 0;
        bottom: 0;
        width: max(10px, calc(var(--_size) * 0.24));
        height: max(10px, calc(var(--_size) * 0.24));
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
        font-size: calc(var(--_size) * 0.38);
        font-weight: 600;
        letter-spacing: 0.01em;
        user-select: none;
      }

      :host([ring]) .avatar {
        padding: calc(var(--_size) * 0.04);
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

      :host([ring]) .inner {
        box-shadow: 0 0 0 calc(var(--_size) * 0.03) var(--ui-color-surface, #fff);
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
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
        <div class="inner" style="--_from: ${from}; --_to: ${to}">
          ${showImage
            ? html`<img src=${this.src} alt="" @error=${() => (this._failed = true)} />`
            : html`<span aria-hidden="true">${initials(this.name)}</span>`}
        </div>
      </div>
      ${this._statusText ? html`<span class="status ${this.status}" aria-hidden="true"></span>` : ''}
    `;
  }
}

customElements.define('dgonmej-ui-avatar', DgonmejUiAvatar);
