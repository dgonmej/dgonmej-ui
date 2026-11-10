import { LitElement, html, css } from 'lit';
import { t } from '../../shared/i18n.js';

/**
 * <dgonmej-ui-list .items=${[{ id, label, description? }]} variant="inset|plain" hide-chevron empty-text="...">
 * Lista agrupada estilo iOS: filas pulsables con separadores interiores y chevron.
 * variant 'plain': sin tarjeta, para integrarla en otra superficie.
 * Evento: 'ui-select' con detail = item elegido
 * Parts: 'list', 'row'
 */
export class DgonmejUiList extends LitElement {
  static properties = {
    items: { type: Array },
    emptyText: { type: String, attribute: 'empty-text' },
    variant: { type: String, reflect: true },
    hideChevron: { type: Boolean, attribute: 'hide-chevron', reflect: true },
  };

  static styles = css`
    :host {
      display: block;
      font-family: var(--ui-font-family, -apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif);
      --_ease: var(--ui-ease-standard, cubic-bezier(0.32, 0.72, 0, 1));
      --_dur: var(--ui-duration-fast, 160ms);
      --_inset: var(--ui-space-4, 16px);
    }

    ul {
      list-style: none;
      margin: 0;
      padding: 0;
      overflow: hidden;
      border-radius: var(--ui-radius-md, 10px);
      background: var(--ui-color-surface, #fff);
      box-shadow: var(--ui-shadow-sm, 0 1px 2px rgb(0 0 0 / 0.06), 0 1px 1px rgb(0 0 0 / 0.04));
    }

    li + li .row::before {
      /* Separador interior: empieza alineado con el texto, como en iOS */
      content: '';
      position: absolute;
      top: 0;
      left: var(--_inset);
      right: 0;
      height: 1px;
      transform: scaleY(0.5);
      transform-origin: top;
      background: var(--ui-color-separator, rgb(60 60 67 / 0.14));
    }

    .row {
      position: relative;
      display: flex;
      align-items: center;
      gap: var(--ui-space-3, 12px);
      box-sizing: border-box;
      width: 100%;
      min-height: var(--ui-control-height, 44px);
      padding: var(--ui-space-3, 12px) var(--ui-space-4, 16px);
      font: inherit;
      text-align: left;
      color: inherit;
      background: transparent;
      border: 0;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
      transition: background-color var(--_dur) var(--_ease);
    }

    .row:active {
      background: var(--ui-color-surface-pressed, #e8e8ed);
      transition-duration: 0s;
    }

    .row:focus-visible {
      outline: 2px solid var(--ui-color-focus, #0071e3);
      outline-offset: -2px;
      border-radius: var(--ui-radius-md, 10px);
    }

    @media (hover: hover) {
      .row:hover {
        background: var(--ui-color-surface-hover, #f2f2f5);
      }
    }

    .text {
      flex: 1;
      min-width: 0;
    }

    .label,
    .description {
      display: block;
    }

    .label {
      color: var(--ui-color-text, #1d1d1f);
      font-size: var(--ui-font-size-body, 1.0625rem);
      line-height: 1.3;
    }

    .description {
      margin-top: 2px;
      color: var(--ui-color-text-muted, #6e6e73);
      font-size: var(--ui-font-size-subhead, 0.9375rem);
      line-height: 1.3;
    }

    .chevron {
      flex: none;
      width: 8px;
      height: 14px;
      color: var(--ui-color-text-muted, #6e6e73);
      opacity: 0.6;
      transition: transform var(--_dur) var(--_ease);
    }

    @media (hover: hover) {
      .row:hover .chevron {
        transform: translateX(2px);
      }
    }

    :host([variant='plain']) ul,
    :host([variant='plain']) .empty {
      border-radius: 0;
      background: transparent;
      box-shadow: none;
    }

    :host([hide-chevron]) .chevron {
      display: none;
    }

    .empty {
      padding: var(--ui-space-6, 24px) var(--ui-space-4, 16px);
      text-align: center;
      color: var(--ui-color-text-muted, #6e6e73);
      font-size: var(--ui-font-size-subhead, 0.9375rem);
      border-radius: var(--ui-radius-md, 10px);
      background: var(--ui-color-surface, #fff);
      box-shadow: var(--ui-shadow-sm, 0 1px 2px rgb(0 0 0 / 0.06), 0 1px 1px rgb(0 0 0 / 0.04));
    }

    @media (prefers-reduced-motion: reduce) {
      .row,
      .chevron {
        transition: none;
      }
      .row:hover .chevron {
        transform: none;
      }
    }
  `;

  constructor() {
    super();
    this.items = [];
    this.emptyText = '';
    this.variant = 'inset';
    this.hideChevron = false;
  }

  render() {
    if (!this.items.length) {
      return html`<div class="empty" part="list">${this.emptyText || t(this, 'list.empty')}</div>`;
    }
    return html`
      <ul part="list">
        ${this.items.map(
          (item) => html`
            <li>
              <button class="row" part="row" type="button" @click=${() => this._select(item)}>
                <span class="text">
                  <span class="label">${item.label}</span>
                  ${item.description ? html`<span class="description">${item.description}</span>` : ''}
                </span>
                <svg class="chevron" viewBox="0 0 8 14" aria-hidden="true">
                  <path d="M1 1l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </button>
            </li>
          `
        )}
      </ul>
    `;
  }

  _select(item) {
    this.dispatchEvent(new CustomEvent('ui-select', { detail: item, bubbles: true, composed: true }));
  }
}

customElements.define('dgonmej-ui-list', DgonmejUiList);
