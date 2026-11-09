import { LitElement, html, css } from 'lit';
import { hostBase } from '../../shared/styles.js';

/**
 * <dgonmej-ui-badge variant="neutral|accent|success|warning|danger" size="small|medium|large" dot>Pagada</dgonmej-ui-badge>
 * Etiqueta de estado tintada. `dot` anade un punto del color de la variante.
 * Parts: 'badge'
 */
export class DgonmejUiBadge extends LitElement {
  static properties = {
    variant: { type: String, reflect: true },
    dot: { type: Boolean, reflect: true },
    size: { type: String, reflect: true },
  };

  static styles = [
    hostBase,
    css`
      :host {
        --_color: var(--ui-color-text, #1d1d1f);
        --_bg: var(--ui-color-fill, rgb(120 120 128 / 0.12));
        display: inline-flex;
        vertical-align: middle;
      }

      :host([variant='accent']) {
        --_color: var(--ui-color-primary-text, #0066cc);
      }
      :host([variant='success']) {
        --_color: var(--ui-color-success, #1a7030);
      }
      :host([variant='warning']) {
        --_color: var(--ui-color-warning, #9a4a00);
      }
      :host([variant='danger']) {
        --_color: var(--ui-color-danger, #c4001a);
      }
      :host([variant]:not([variant='neutral'])) {
        --_bg: color-mix(in srgb, var(--_color) var(--ui-tint-strength, 12%), transparent);
      }

      .badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        min-height: 24px;
        padding: 0 10px;
        border-radius: var(--ui-radius-control, 999px);
        color: var(--_color);
        background: var(--_bg);
        font-size: var(--ui-font-size-footnote, 0.8125rem);
        font-weight: 600;
        line-height: 1;
        white-space: nowrap;
      }

      :host([size='small']) .badge {
        min-height: 20px;
        padding: 0 8px;
        font-size: var(--ui-font-size-caption, 0.75rem);
      }

      :host([size='large']) .badge {
        min-height: 30px;
        padding: 0 14px;
        font-size: var(--ui-font-size-subhead, 0.9375rem);
      }

      .dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: currentColor;
      }
    `,
  ];

  constructor() {
    super();
    this.variant = 'neutral';
    this.dot = false;
    this.size = 'medium';
  }

  render() {
    return html`<span class="badge" part="badge">${this.dot ? html`<span class="dot"></span>` : ''}<slot></slot></span>`;
  }
}

customElements.define('dgonmej-ui-badge', DgonmejUiBadge);
