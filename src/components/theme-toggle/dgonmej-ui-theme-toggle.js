import { LitElement, html, css } from 'lit';
import { hostBase } from '../../shared/styles.js';
import '../segmented-control/dgonmej-ui-segmented-control.js';
import '../button/dgonmej-ui-button.js';
import { renderIcon } from '../../shared/icons.js';
import { t } from '../../shared/i18n.js';

const STORAGE_KEY = 'dgonmej-ui-theme';
const THEMES = ['system', 'light', 'dark'];
const ICONS = { system: 'circle-half', light: 'sun', dark: 'moon' };
const instances = new Set();

const readTheme = () => {
  try {
    const t = localStorage.getItem(STORAGE_KEY);
    return THEMES.includes(t) ? t : 'system';
  } catch {
    return 'system';
  }
};

/** Aplica el tema al documento: 'system' deja actuar a prefers-color-scheme. */
export function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === 'system') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', theme);
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* almacenamiento no disponible: el tema solo dura esta visita */
  }
  instances.forEach((el) => (el.theme = theme));
}

/**
 * <dgonmej-ui-theme-toggle variant="segmented|button">
 * Cambia entre tema del sistema, claro y oscuro (data-theme en <html>) y lo recuerda.
 * - segmented: control segmentado con las tres opciones (`compact`: solo iconos).
 * - button: boton de icono que rota entre ellas.
 * Varias instancias se mantienen sincronizadas.
 * Evento: 'ui-change' con detail = { theme }
 */
export class DgonmejUiThemeToggle extends LitElement {
  static properties = {
    variant: { type: String, reflect: true },
    theme: { type: String },
    compact: { type: Boolean, reflect: true },
  };

  static styles = [
    hostBase,
    css`
      :host {
        display: inline-block;
      }
    `,
  ];

  constructor() {
    super();
    this.variant = 'segmented';
    this.theme = readTheme();
    this.compact = false;
  }

  connectedCallback() {
    super.connectedCallback();
    instances.add(this);
    applyTheme(this.theme);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    instances.delete(this);
  }

  render() {
    if (this.variant === 'button') {
      return html`
        <dgonmej-ui-button
          variant="glass"
          icon
          label=${t(this, 'theme.change', { theme: t(this, `theme.${this.theme}`) })}
          @ui-click=${this._cycle}
        >
          ${renderIcon(ICONS[this.theme], { size: 20 })}
        </dgonmej-ui-button>
      `;
    }
    return html`
      <dgonmej-ui-segmented-control
        size="small"
        label=${t(this, 'theme.label')}
        .value=${this.theme}
        .options=${THEMES.map((th) => ({ value: th, label: t(this, `theme.${th}`), icon: ICONS[th], hideLabel: this.compact }))}
        @ui-change=${this._onSegment}
      ></dgonmej-ui-segmented-control>
    `;
  }

  _onSegment(e) {
    e.stopPropagation();
    this._set(e.detail.value);
  }

  _cycle(e) {
    e.stopPropagation();
    this._set(THEMES[(THEMES.indexOf(this.theme) + 1) % THEMES.length]);
  }

  _set(theme) {
    applyTheme(theme);
    this.dispatchEvent(new CustomEvent('ui-change', { detail: { theme }, bubbles: true, composed: true }));
  }
}

customElements.define('dgonmej-ui-theme-toggle', DgonmejUiThemeToggle);
