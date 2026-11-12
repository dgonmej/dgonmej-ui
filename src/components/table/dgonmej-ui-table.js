import { LitElement, html, css } from 'lit';
import { t } from '../../shared/i18n.js';

/**
 * <dgonmej-ui-table .columns=${[{ key, header, align? }]} .rows=${[{...}]} label="..." empty-text="...">
 * align: 'start' (por defecto) | 'end' (numeros, importes).
 * density: 'compact' | 'regular' | 'comfortable'. striped: filas alternas sombreadas.
 * En pantallas estrechas la tabla se desplaza en horizontal dentro de su contenedor.
 * Parts: 'container', 'table'
 */
export class DgonmejUiTable extends LitElement {
  static properties = {
    columns: { type: Array },
    rows: { type: Array },
    emptyText: { type: String, attribute: 'empty-text' },
    label: { type: String },
    density: { type: String, reflect: true },
    striped: { type: Boolean, reflect: true },
  };

  static styles = css`
    :host {
      display: block;
      font-family: var(--ui-font-family, -apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif);
      --_dur: var(--ui-duration-fast, 160ms);
    }

    .container {
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      border-radius: var(--ui-radius-md, 10px);
      background: var(--ui-color-surface, #fff);
      box-shadow: var(--ui-shadow-sm, 0 1px 2px rgb(0 0 0 / 0.06), 0 1px 1px rgb(0 0 0 / 0.04));
    }

    .container:focus-visible {
      outline: 2px solid var(--ui-color-focus, #0071e3);
      outline-offset: 2px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: var(--ui-font-size-subhead, 0.9375rem);
      font-variant-numeric: tabular-nums;
    }

    th,
    td {
      padding: var(--ui-space-3, 12px) var(--ui-space-4, 16px);
      text-align: left;
      white-space: nowrap;
    }

    :host([density='compact']) th,
    :host([density='compact']) td {
      padding: var(--ui-space-2, 8px) var(--ui-space-3, 12px);
    }

    :host([density='comfortable']) th,
    :host([density='comfortable']) td {
      padding: var(--ui-space-4, 16px) var(--ui-space-5, 20px);
    }

    :host([striped]) tbody tr:nth-child(even) td {
      background: color-mix(in srgb, var(--ui-color-fill, rgb(120 120 128 / 0.12)) 50%, transparent);
    }

    th[data-align='end'],
    td[data-align='end'] {
      text-align: right;
    }

    th {
      color: var(--ui-color-text-muted, #6e6e73);
      font-size: var(--ui-font-size-footnote, 0.8125rem);
      font-weight: 600;
      background: var(--ui-color-fill, rgb(120 120 128 / 0.12));
    }

    td {
      color: var(--ui-color-text, #1d1d1f);
      box-shadow: inset 0 1px 0 var(--ui-color-separator, rgb(60 60 67 / 0.14));
      transition: background-color var(--_dur) ease-out;
    }

    tbody tr:first-child td {
      box-shadow: none;
    }

    @media (hover: hover) {
      tbody tr:hover td {
        background: var(--ui-color-surface-hover, #f2f2f5);
      }
    }

    .empty {
      padding: var(--ui-space-6, 24px) var(--ui-space-4, 16px);
      text-align: center;
      color: var(--ui-color-text-muted, #6e6e73);
      white-space: normal;
    }

    @media (prefers-reduced-motion: reduce) {
      td {
        transition: none;
      }
    }
  `;

  constructor() {
    super();
    this.columns = [];
    this.rows = [];
    this.emptyText = '';
    this.label = '';
    this.density = 'regular';
    this.striped = false;
  }

  render() {
    return html`
      <div class="container" part="container" tabindex="0" role="region" aria-label=${this.label || t(this, 'table.label')}>
        <table part="table">
          <thead>
            <tr>
              ${this.columns.map((c) => html`<th scope="col" data-align=${c.align || 'start'}>${c.header}</th>`)}
            </tr>
          </thead>
          <tbody>
            ${this.rows.length
              ? this.rows.map(
                  (row) => html`
                    <tr>
                      ${this.columns.map((c) => html`<td data-align=${c.align || 'start'}>${row[c.key]}</td>`)}
                    </tr>
                  `
                )
              : html`<tr><td class="empty" colspan=${this.columns.length || 1}>${this.emptyText || t(this, 'table.empty')}</td></tr>`}
          </tbody>
        </table>
      </div>
    `;
  }
}

customElements.define('dgonmej-ui-table', DgonmejUiTable);
