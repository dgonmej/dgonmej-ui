import { LitElement, html, css } from 'lit';
import { hostBase } from '../../shared/styles.js';

// El angulo del degradado se anima como propiedad registrada: asi gira la estela
// y el marco se queda quieto (un cuadrado girando se veria bambolear).
const ANGLE = '--ui-spinner-angle';
const canAnimateAngle = typeof CSS !== 'undefined' && 'registerProperty' in CSS;
if (canAnimateAngle) {
  try {
    CSS.registerProperty({ name: ANGLE, syntax: '<angle>', inherits: false, initialValue: '0deg' });
  } catch {
    /* ya registrada por otra copia de la libreria */
  }
}

/**
 * <dgonmej-ui-spinner size="small|medium|large|xlarge" tone="accent|neutral|current" label="Cargando">
 * Indicador de carga: marco con una estela en degradado que recorre su contorno.
 * - size: 16 / 24 / 36 / 56 px (por defecto medium).
 * - tone: accent (color de acento), neutral (gris), current (hereda el color del texto,
 *   para usarlo dentro de botones u otros controles).
 * - Su forma sigue la redondez global (--ui-radius-scale): disco con la maxima,
 *   cuadrado muy redondeado con la normal y casi cuadrado con la recta.
 */
export class DgonmejUiSpinner extends LitElement {
  static properties = {
    size: { type: String, reflect: true },
    tone: { type: String, reflect: true },
    label: { type: String },
  };

  static styles = [
    hostBase,
    css`
      :host {
        --_size: 24px;
        --_stroke: 3px;
        --_color: var(--ui-color-primary, #0066cc);
        /* 1.5 o mas = disco; 1 = cuadrado muy redondeado; menos = mas recto */
        --_radius: min(50%, calc(34% * var(--ui-radius-scale, 1)));
        display: inline-block;
        position: relative;
        width: var(--_size);
        height: var(--_size);
        flex: none;
        vertical-align: middle;
      }

      :host([size='small']) {
        --_size: 16px;
        --_stroke: 2.5px;
      }
      :host([size='large']) {
        --_size: 36px;
        --_stroke: 4px;
      }
      :host([size='xlarge']) {
        --_size: 56px;
        --_stroke: 5px;
      }

      :host([tone='neutral']) {
        --_color: var(--ui-color-text-muted, #6e6e73);
      }
      :host([tone='current']) {
        --_color: currentColor;
      }

      /* Mascara de contorno que respeta cualquier border-radius */
      .track,
      .arc {
        position: absolute;
        inset: 0;
        box-sizing: border-box;
        padding: var(--_stroke);
        border-radius: var(--_radius);
        -webkit-mask:
          linear-gradient(#000 0 0) content-box,
          linear-gradient(#000 0 0);
        -webkit-mask-composite: xor;
        mask:
          linear-gradient(#000 0 0) content-box exclude,
          linear-gradient(#000 0 0);
      }

      .track {
        background: var(--_color);
        opacity: 0.16;
      }

      .arc {
        background: conic-gradient(from var(--ui-spinner-angle, 0deg), transparent 0 18%, var(--_color) 100%);
        animation: sweep 0.9s linear infinite;
      }

      @keyframes sweep {
        to {
          --ui-spinner-angle: 360deg;
        }
      }

      /* Sin propiedades registradas: gira el marco entero */
      :host([fallback]) .arc {
        animation: spin 0.9s linear infinite;
      }

      @keyframes spin {
        to {
          transform: rotate(1turn);
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .arc,
        :host([fallback]) .arc {
          animation-duration: 2.4s;
        }
      }
    `,
  ];

  constructor() {
    super();
    this.size = 'medium';
    this.tone = 'accent';
    this.label = 'Cargando';
  }

  connectedCallback() {
    super.connectedCallback();
    this.toggleAttribute('fallback', !canAnimateAngle);
  }

  render() {
    return html`
      <span role="status" aria-label=${this.label}>
        <span class="track"></span>
        <span class="arc"></span>
      </span>
    `;
  }
}

customElements.define('dgonmej-ui-spinner', DgonmejUiSpinner);
