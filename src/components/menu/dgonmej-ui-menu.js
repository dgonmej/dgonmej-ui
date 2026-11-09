import { LitElement, html, css } from 'lit';
import { hostBase, material } from '../../shared/styles.js';
import { renderIcon } from '../../shared/icons.js';

let uid = 0;

/**
 * <dgonmej-ui-menu placement="bottom-end" label="Acciones"
 *   .items=${[{ value, label, icon?, destructive?, disabled? }, { separator: true }]}>
 *   <dgonmej-ui-button slot="trigger" variant="secondary" icon label="Mas opciones">...</dgonmej-ui-button>
 * </dgonmej-ui-menu>
 * Menu contextual de vidrio anclado al disparador. Teclado: flechas, Inicio/Fin, Esc.
 * placement: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'
 * Evento: 'ui-select' con detail = { value }
 * Parts: 'menu', 'item'
 */
export class DgonmejUiMenu extends LitElement {
  static properties = {
    items: { type: Array },
    placement: { type: String, reflect: true },
    label: { type: String },
    open: { type: Boolean, reflect: true },
  };

  static styles = [
    hostBase,
    material,
    css`
      :host {
        position: relative;
        display: inline-block;
      }

      .menu {
        position: absolute;
        z-index: 30;
        top: calc(100% + 6px);
        left: 0;
        min-width: 220px;
        max-width: min(320px, calc(100vw - 32px));
        padding: 6px;
        border-radius: var(--ui-radius-md, 10px);
        box-shadow: var(--ui-shadow-lg, 0 2px 6px rgb(0 0 0 / 0.06), 0 24px 48px -16px rgb(0 0 0 / 0.22));
        transform-origin: top left;
        opacity: 0;
        transform: scale(0.94) translateY(-4px);
        transition:
          opacity var(--_fast) ease-out,
          transform var(--_base) var(--_ease);
      }

      /* Cerrado del todo: fuera del layout, asi no provoca scroll aunque este junto al borde */
      .menu[hidden] {
        display: none;
      }

      /* Si no cabe por su lado, se alinea por el contrario */
      .menu.flip-x {
        left: auto;
        right: 0;
        transform-origin: top right;
      }

      :host([placement$='end']) .menu.flip-x {
        left: 0;
        right: auto;
        transform-origin: top left;
      }

      :host([placement$='end']) .menu {
        left: auto;
        right: 0;
        transform-origin: top right;
      }

      :host([placement^='top']) .menu {
        top: auto;
        bottom: calc(100% + 6px);
        transform-origin: bottom left;
      }

      :host([placement='top-end']) .menu {
        transform-origin: bottom right;
      }

      :host([open]) .menu {
        opacity: 1;
        transform: none;
      }

      /* Animacion de entrada desde display: none */
      @starting-style {
        :host([open]) .menu {
          opacity: 0;
          transform: scale(0.94) translateY(-4px);
        }
      }

      [role='menuitem'] {
        display: flex;
        align-items: center;
        gap: var(--ui-space-3, 12px);
        width: 100%;
        min-height: 40px;
        padding: 0 var(--ui-space-3, 12px);
        border: 0;
        border-radius: var(--ui-radius-sm, 6px);
        background: transparent;
        color: inherit;
        font: inherit;
        font-size: var(--ui-font-size-body, 1.0625rem);
        text-align: left;
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
      }

      [role='menuitem'] .text {
        flex: 1;
      }

      [role='menuitem'] .icon {
        flex: none;
        opacity: 0.8;
      }

      [role='menuitem'].destructive {
        color: var(--ui-color-danger, #c4001a);
      }

      [role='menuitem']:focus-visible,
      [role='menuitem']:active {
        outline: none;
        background: var(--ui-color-fill, rgb(120 120 128 / 0.12));
      }

      @media (hover: hover) {
        [role='menuitem']:hover:not(:disabled) {
          background: var(--ui-color-fill, rgb(120 120 128 / 0.12));
        }
      }

      [role='menuitem']:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }

      [role='separator'] {
        height: 1px;
        margin: 6px var(--ui-space-2, 8px);
        background: var(--ui-color-separator, rgb(60 60 67 / 0.14));
      }

      @media (prefers-reduced-motion: reduce) {
        .menu,
        :host([open]) .menu {
          transform: none;
        }
      }
    `,
  ];

  constructor() {
    super();
    this._id = `ui-menu-${++uid}`;
    this.items = [];
    this.placement = 'bottom-start';
    this.label = '';
    this.open = false;
    this._onDocPointer = this._onDocPointer.bind(this);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('pointerdown', this._onDocPointer, true);
  }

  get _trigger() {
    return this.renderRoot.querySelector('slot[name="trigger"]')?.assignedElements()[0];
  }

  get _menuItems() {
    return [...this.renderRoot.querySelectorAll('[role="menuitem"]:not(:disabled)')];
  }

  updated(changed) {
    const trigger = this._trigger;
    if (trigger) {
      // Un dgonmej-ui-button reenvia el estado a su <button> interno; un boton nativo lo lleva directamente
      if ('expanded' in trigger) {
        trigger.haspopup = 'menu';
        trigger.expanded = String(this.open);
      } else {
        trigger.setAttribute('aria-haspopup', 'menu');
        trigger.setAttribute('aria-expanded', String(this.open));
      }
    }
    if (changed.has('open')) {
      const menu = this.renderRoot.querySelector('.menu');
      clearTimeout(this._hideTimer);
      if (this.open) {
        menu.hidden = false;
        this._fitInViewport(menu);
        document.addEventListener('pointerdown', this._onDocPointer, true);
        this._focusItem(0);
      } else {
        document.removeEventListener('pointerdown', this._onDocPointer, true);
        // Se retira del layout cuando termina la animacion de cierre
        const duration = parseFloat(getComputedStyle(menu).transitionDuration.split(',').pop()) * 1000 || 0;
        this._hideTimer = setTimeout(() => {
          if (!this.open) menu.hidden = true;
        }, duration);
      }
    }
  }

  _fitInViewport(menu) {
    menu.classList.remove('flip-x');
    const r = menu.getBoundingClientRect();
    const margin = 8;
    if (r.right > window.innerWidth - margin || r.left < margin) menu.classList.add('flip-x');
  }

  render() {
    return html`
      <slot name="trigger" @click=${this._toggle} @slotchange=${() => this.requestUpdate()}></slot>
      <div
        id=${this._id}
        class="menu material"
        part="menu"
        hidden
        role="menu"
        aria-label=${this.label || 'Menú'}
        @keydown=${this._onKeydown}
      >
        ${this.items.map((item) =>
          item.separator
            ? html`<div role="separator"></div>`
            : html`<button
                type="button"
                part="item"
                role="menuitem"
                tabindex="-1"
                class=${item.destructive ? 'destructive' : ''}
                ?disabled=${item.disabled}
                @click=${() => this._select(item.value)}
              >
                <span class="text">${item.label}</span>
                ${item.icon ? renderIcon(item.icon, { size: 18 }) : ''}
              </button>`
        )}
      </div>
    `;
  }

  _toggle() {
    this.open = !this.open;
  }

  _close({ focusTrigger = true } = {}) {
    if (!this.open) return;
    this.open = false;
    if (focusTrigger) this._trigger?.focus();
  }

  _select(value) {
    this._close();
    this.dispatchEvent(new CustomEvent('ui-select', { detail: { value }, bubbles: true, composed: true }));
  }

  _focusItem(index) {
    const items = this._menuItems;
    if (!items.length) return;
    items[(index + items.length) % items.length].focus();
  }

  _onKeydown(e) {
    const items = this._menuItems;
    const current = items.indexOf(this.renderRoot.activeElement);
    if (e.key === 'ArrowDown') this._focusItem(current + 1);
    else if (e.key === 'ArrowUp') this._focusItem(current - 1);
    else if (e.key === 'Home') this._focusItem(0);
    else if (e.key === 'End') this._focusItem(items.length - 1);
    else if (e.key === 'Escape') this._close();
    else if (e.key === 'Tab') return this._close({ focusTrigger: false });
    else return;
    e.preventDefault();
  }

  _onDocPointer(e) {
    if (!e.composedPath().includes(this)) this._close({ focusTrigger: false });
  }
}

customElements.define('dgonmej-ui-menu', DgonmejUiMenu);
