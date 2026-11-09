import { LitElement, html, css } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { hostBase } from '../../shared/styles.js';

/**
 * <dgonmej-ui-progress value="40" max="100" label="Subiendo archivo" tone="accent|success|warning|danger"
 *   size="thin|regular|thick" show-value>
 * Sin `value` es indeterminada (carga sin duracion conocida).
 * Parts: 'track', 'fill'
 */
export class DgonmejUiProgress extends LitElement {
  static properties = {
    value: { type: Number },
    max: { type: Number },
    label: { type: String },
    showValue: { type: Boolean, attribute: 'show-value' },
    tone: { type: String, reflect: true },
    size: { type: String, reflect: true },
  };

  static styles = [
    hostBase,
    css`
      :host {
        display: block;
      }

      .top {
        display: flex;
        justify-content: space-between;
        gap: var(--ui-space-2, 8px);
        margin-bottom: var(--ui-space-2, 8px);
        color: var(--ui-color-text-muted, #6e6e73);
        font-size: var(--ui-font-size-footnote, 0.8125rem);
        font-variant-numeric: tabular-nums;
      }

      .label {
        color: var(--ui-color-text, #1d1d1f);
        font-weight: 600;
      }

      .track {
        position: relative;
        height: 6px;
        overflow: hidden;
        border-radius: var(--ui-radius-control, 999px);
        background: var(--ui-color-fill-strong, rgb(120 120 128 / 0.22));
      }

      .fill {
        position: absolute;
        inset: 0;
        border-radius: inherit;
        background: var(--ui-gradient-primary, linear-gradient(180deg, #0071e3 0%, #005bbf 100%));
        transform-origin: left center;
        transform: scaleX(var(--_ratio, 0));
        transition: transform var(--_slow) var(--_ease);
      }

      :host([tone='success']) .fill {
        background: var(--ui-color-success, #1a7030);
      }
      :host([tone='warning']) .fill {
        background: var(--ui-color-warning, #9a4a00);
      }
      :host([tone='danger']) .fill {
        background: var(--ui-color-danger, #c4001a);
      }

      :host([size='thin']) .track {
        height: 4px;
      }
      :host([size='thick']) .track {
        height: 10px;
      }

      .indeterminate .fill {
        width: 40%;
        transform: translateX(-100%);
        animation: slide 1.4s var(--_ease) infinite;
      }

      @keyframes slide {
        to {
          transform: translateX(250%);
        }
      }

      @keyframes pulse {
        50% {
          opacity: 0.4;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .fill {
          transition: none;
        }
        .indeterminate .fill {
          width: 100%;
          transform: none;
          animation: pulse 2s ease-in-out infinite;
        }
      }
    `,
  ];

  constructor() {
    super();
    this.value = undefined;
    this.max = 100;
    this.label = '';
    this.showValue = false;
    this.tone = 'accent';
    this.size = 'regular';
  }

  render() {
    const indeterminate = this.value == null || Number.isNaN(this.value);
    const ratio = indeterminate ? 0 : Math.min(1, Math.max(0, this.value / (this.max || 100)));
    const percent = Math.round(ratio * 100);
    return html`
      ${this.label || this.showValue
        ? html`<div class="top">
            <span class="label">${this.label}</span>
            ${this.showValue && !indeterminate ? html`<span>${percent}%</span>` : ''}
          </div>`
        : ''}
      <div
        class="track ${indeterminate ? 'indeterminate' : ''}"
        part="track"
        role="progressbar"
        aria-label=${this.label || 'Progreso'}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow=${ifDefined(indeterminate ? undefined : percent)}
        style="--_ratio: ${ratio}"
      >
        <div class="fill" part="fill"></div>
      </div>
    `;
  }
}

customElements.define('dgonmej-ui-progress', DgonmejUiProgress);
