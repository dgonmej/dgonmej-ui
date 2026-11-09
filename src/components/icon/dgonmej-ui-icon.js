import { LitElement, html, css } from 'lit';
import { renderIcon, icons } from '../../shared/icons.js';

/**
 * <dgonmej-ui-icon name="house" size="20" label="Inicio">
 * Sin `label` el icono es decorativo. Hereda el color del texto (currentColor).
 * Nombres disponibles: ver `iconNames`.
 */
export const iconNames = Object.keys(icons);

export class DgonmejUiIcon extends LitElement {
  static properties = {
    name: { type: String },
    size: { type: Number },
    label: { type: String },
  };

  static styles = css`
    :host {
      display: inline-flex;
      line-height: 0;
      vertical-align: middle;
    }
  `;

  constructor() {
    super();
    this.name = '';
    this.size = 20;
    this.label = '';
  }

  render() {
    return html`${renderIcon(this.name, { size: this.size, label: this.label })}`;
  }
}

customElements.define('dgonmej-ui-icon', DgonmejUiIcon);
