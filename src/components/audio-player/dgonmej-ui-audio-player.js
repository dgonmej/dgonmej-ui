import { LitElement, html, css } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { hostBase } from '../../shared/styles.js';
import { renderIcon } from '../../shared/icons.js';
import '../spinner/dgonmej-ui-spinner.js';

const fmt = (s) => {
  if (!Number.isFinite(s)) return '0:00';
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
};

/**
 * <dgonmej-ui-audio-player src="https://..." heading="MinimaFM 97.9"
 *   subheading="La voz del valle" artwork="logo.png" variant="card|compact" live>
 * - compact: mini reproductor en una fila (portada, titulo y reproducir).
 * Reproductor con portada, reproducir/pausa, volumen y, si no es `live`, barra de posicion.
 * La portada difuminada tine el fondo (estilo Apple Music). Integra los controles del
 * sistema (pantalla de bloqueo, auriculares) mediante Media Session.
 * Se adapta al ancho de su contenedor (container queries): dale ancho desde fuera
 * (bloque, grid o flex con `flex: 1`); en un flex que ajusta al contenido quedaria a 0.
 * Eventos: 'ui-play', 'ui-pause', 'ui-error'
 * Parts: 'player', 'artwork', 'play'
 */
export class DgonmejUiAudioPlayer extends LitElement {
  static properties = {
    src: { type: String },
    heading: { type: String },
    subheading: { type: String },
    artwork: { type: String },
    live: { type: Boolean, reflect: true },
    variant: { type: String, reflect: true },
    _state: { state: true },
    _volume: { state: true },
    _muted: { state: true },
    _time: { state: true },
    _duration: { state: true },
  };

  static styles = [
    hostBase,
    css`
      :host {
        display: block;
        container-type: inline-size;
      }

      .player {
        position: relative;
        overflow: hidden;
        isolation: isolate;
        border-radius: var(--ui-radius-lg, 16px);
        color: var(--ui-material-text, #1d1d1f);
        background: var(--ui-color-surface, #fff);
        box-shadow: var(--ui-shadow-lg, 0 2px 6px rgb(0 0 0 / 0.06), 0 24px 48px -16px rgb(0 0 0 / 0.22));
      }

      /* Fondo: portada muy difuminada + velo de material para garantizar contraste */
      .backdrop {
        position: absolute;
        inset: -40px;
        z-index: -1;
        background:
          var(--_art, var(--ui-gradient-primary, linear-gradient(180deg, #0071e3 0%, #005bbf 100%))) center / cover;
        filter: blur(40px) saturate(160%);
        opacity: 0.55;
      }

      .backdrop::after {
        content: '';
        position: absolute;
        inset: 0;
        background: var(--ui-material-bg-translucent, rgb(255 255 255 / 0.6));
      }

      .content {
        display: grid;
        grid-template-columns: auto 1fr;
        align-items: center;
        gap: var(--ui-space-4, 16px);
        padding: var(--ui-space-4, 16px);
      }

      .artwork {
        display: grid;
        place-items: center;
        width: 88px;
        aspect-ratio: 1;
        overflow: hidden;
        border-radius: var(--ui-radius-md, 10px);
        color: #fff;
        background: var(--ui-gradient-primary, linear-gradient(180deg, #0071e3 0%, #005bbf 100%));
        box-shadow: var(--ui-shadow-md, 0 1px 3px rgb(0 0 0 / 0.06), 0 8px 24px -8px rgb(0 0 0 / 0.14));
        transition: transform var(--_slow) var(--_ease);
      }

      /* La portada se encoge un poco en pausa, como en Apple Music */
      :host(:not([playing])) .artwork {
        transform: scale(0.92);
      }

      /* contain: los logos apaisados se ven enteros; las portadas cuadradas llenan igual */
      .artwork img {
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        padding: 6%;
        object-fit: contain;
        background: #fff;
      }

      .info {
        min-width: 0;
      }

      .live {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        margin-bottom: 4px;
        color: var(--ui-color-danger, #c4001a);
        font-size: var(--ui-font-size-caption, 0.75rem);
        font-weight: 700;
      }

      .live::before {
        content: '';
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: currentColor;
      }

      :host([playing]) .live::before {
        animation: pulse 1.6s ease-in-out infinite;
      }

      @keyframes pulse {
        50% {
          opacity: 0.35;
        }
      }

      h3 {
        margin: 0;
        overflow: hidden;
        font-size: var(--ui-font-size-body, 1.0625rem);
        font-weight: 700;
        letter-spacing: -0.01em;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .sub {
        margin: 2px 0 0;
        overflow: hidden;
        color: var(--ui-color-text-muted, #6e6e73);
        font-size: var(--ui-font-size-subhead, 0.9375rem);
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .controls {
        grid-column: 1 / -1;
        display: flex;
        align-items: center;
        gap: var(--ui-space-3, 12px);
      }

      .play {
        display: grid;
        place-items: center;
        flex: none;
        width: 52px;
        height: 52px;
        padding: 0;
        border: 0;
        border-radius: var(--ui-radius-control, 999px);
        color: var(--ui-color-primary-contrast, #fff);
        background:
          var(--ui-gradient-sheen, linear-gradient(180deg, rgb(255 255 255 / 0.22) 0%, rgb(255 255 255 / 0) 55%)),
          var(--ui-gradient-primary, linear-gradient(180deg, #0071e3 0%, #005bbf 100%));
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 0.18),
          0 6px 16px -6px var(--ui-color-primary-glow, rgb(0 113 227 / 0.4));
        cursor: pointer;
        transition: transform var(--_fast) var(--_ease);
      }

      .play:active {
        transform: scale(0.94);
      }

      .play:focus-visible,
      .icon-button:focus-visible {
        outline: 2px solid var(--_focus);
        outline-offset: 3px;
      }

      .play .icon[data-name='play'] {
        margin-left: 3px;
      }

      .position {
        flex: 1;
        display: grid;
        gap: 2px;
        min-width: 0;
      }

      .times {
        display: flex;
        justify-content: space-between;
        color: var(--ui-color-text-muted, #6e6e73);
        font-size: var(--ui-font-size-caption, 0.75rem);
        font-variant-numeric: tabular-nums;
      }

      .volume {
        display: flex;
        align-items: center;
        gap: var(--ui-space-1, 4px);
        flex: 1;
        min-width: 0;
      }

      :host(:not([live])) .volume {
        flex: 0 1 140px;
      }

      .icon-button {
        display: grid;
        place-items: center;
        flex: none;
        width: 36px;
        height: 36px;
        padding: 0;
        border: 0;
        border-radius: var(--ui-radius-control, 999px);
        color: var(--ui-color-text-muted, #6e6e73);
        background: transparent;
        cursor: pointer;
      }

      /* Slider con relleno del acento hasta el valor actual */
      input[type='range'] {
        --_pct: 0%;
        flex: 1;
        min-width: 0;
        height: 24px;
        margin: 0;
        background: transparent;
        cursor: pointer;
        -webkit-appearance: none;
        appearance: none;
      }

      input[type='range']::-webkit-slider-runnable-track {
        height: 4px;
        border-radius: var(--ui-radius-control, 999px);
        background: linear-gradient(to right, var(--ui-color-primary, #0066cc) var(--_pct), var(--ui-color-fill-strong, rgb(120 120 128 / 0.22)) var(--_pct));
      }

      input[type='range']::-moz-range-track {
        height: 4px;
        border-radius: var(--ui-radius-control, 999px);
        background: linear-gradient(to right, var(--ui-color-primary, #0066cc) var(--_pct), var(--ui-color-fill-strong, rgb(120 120 128 / 0.22)) var(--_pct));
      }

      input[type='range']::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 16px;
        height: 16px;
        margin-top: -6px;
        border-radius: var(--ui-radius-control, 999px);
        background: #fff;
        box-shadow: 0 1px 4px rgb(0 0 0 / 0.3);
        transition: transform var(--_fast) var(--_ease);
      }

      input[type='range']::-moz-range-thumb {
        width: 16px;
        height: 16px;
        border: 0;
        border-radius: var(--ui-radius-control, 999px);
        background: #fff;
        box-shadow: 0 1px 4px rgb(0 0 0 / 0.3);
      }

      input[type='range']:active::-webkit-slider-thumb {
        transform: scale(1.2);
      }

      input[type='range']:focus-visible {
        outline: 2px solid var(--_focus);
        outline-offset: 2px;
        border-radius: var(--ui-radius-control, 999px);
      }

      .error {
        grid-column: 1 / -1;
        margin: 0;
        color: var(--ui-color-danger, #c4001a);
        font-size: var(--ui-font-size-footnote, 0.8125rem);
      }

      /* En contenedores anchos, todo en una fila */
      @container (min-width: 560px) {
        .content {
          grid-template-columns: auto minmax(0, 1fr) minmax(0, 1.4fr);
        }
        .controls {
          grid-column: auto;
        }
      }

      /* Mini reproductor */
      :host([variant='compact']) .content {
        grid-template-columns: auto minmax(0, 1fr) auto;
        gap: var(--ui-space-3, 12px);
        padding: var(--ui-space-2, 8px) var(--ui-space-3, 12px) var(--ui-space-2, 8px) var(--ui-space-2, 8px);
      }
      :host([variant='compact']) .artwork {
        width: 48px;
        border-radius: var(--ui-radius-sm, 6px);
      }
      :host([variant='compact']) .controls {
        grid-column: auto;
      }
      :host([variant='compact']) .play {
        width: 44px;
        height: 44px;
      }
      :host([variant='compact']) .volume,
      :host([variant='compact']) .position {
        display: none;
      }

      @media (prefers-reduced-motion: reduce) {
        .artwork,
        .play {
          transition: none;
        }
        :host(:not([playing])) .artwork {
          transform: none;
        }
        :host([playing]) .live::before {
          animation: none;
        }
      }
    `,
  ];

  constructor() {
    super();
    this.src = '';
    this.heading = '';
    this.subheading = '';
    this.artwork = '';
    this.live = false;
    this.variant = 'card';
    this._state = 'idle'; // idle | loading | playing | paused | error
    this._volume = 1;
    this._muted = false;
    this._time = 0;
    this._duration = NaN;
  }

  get _audio() {
    return this.renderRoot.querySelector('audio');
  }

  updated(changed) {
    this.toggleAttribute('playing', this._state === 'playing');
    if (changed.has('src') && changed.get('src') !== undefined) {
      this._state = 'idle';
    }
  }

  async toggle() {
    const audio = this._audio;
    if (!audio || !this.src) return;
    if (this._state === 'playing' || this._state === 'loading') {
      audio.pause();
      return;
    }
    this._state = 'loading';
    // En directo, recargar para empezar desde el momento actual de la emision
    if (this.live) audio.load();
    try {
      await audio.play();
    } catch (err) {
      if (err.name !== 'AbortError') this._fail();
    }
  }

  render() {
    const playing = this._state === 'playing';
    const loading = this._state === 'loading';
    const volumePct = `${(this._muted ? 0 : this._volume) * 100}%`;
    const posPct = this._duration ? `${(this._time / this._duration) * 100}%` : '0%';
    return html`
      <div class="player" part="player" style=${ifDefined(this.artwork ? `--_art: url("${this.artwork}")` : undefined)}>
        <div class="backdrop" aria-hidden="true"></div>
        <div class="content">
          <div class="artwork" part="artwork">
            ${this.artwork ? html`<img src=${this.artwork} alt="" />` : renderIcon(this.live ? 'radio' : 'music', { size: 36 })}
          </div>
          <div class="info">
            ${this.live ? html`<div class="live">En directo</div>` : ''}
            <h3>${this.heading}</h3>
            ${this.subheading ? html`<p class="sub">${this.subheading}</p>` : ''}
          </div>
          <div class="controls">
            <button
              class="play"
              part="play"
              type="button"
              aria-label=${playing || loading ? 'Pausar' : 'Reproducir'}
              ?disabled=${!this.src}
              @click=${this.toggle}
            >
              ${loading
                ? html`<dgonmej-ui-spinner tone="current" label="Conectando"></dgonmej-ui-spinner>`
                : html`<span class="icon" data-name=${playing ? 'pause' : 'play'}>${renderIcon(playing ? 'pause' : 'play', { size: 24 })}</span>`}
            </button>
            ${this.live
              ? ''
              : html`<div class="position">
                  <input
                    type="range"
                    min="0"
                    max=${this._duration || 0}
                    step="1"
                    .value=${String(this._time)}
                    style="--_pct: ${posPct}"
                    aria-label="Posición"
                    aria-valuetext=${`${fmt(this._time)} de ${fmt(this._duration)}`}
                    @input=${this._seek}
                  />
                  <div class="times"><span>${fmt(this._time)}</span><span>${fmt(this._duration)}</span></div>
                </div>`}
            <div class="volume">
              <button
                class="icon-button"
                type="button"
                aria-label=${this._muted ? 'Activar sonido' : 'Silenciar'}
                @click=${this._toggleMute}
              >
                ${renderIcon(this._muted || this._volume === 0 ? 'speaker-off' : 'speaker', { size: 20 })}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                .value=${String(this._muted ? 0 : this._volume)}
                style="--_pct: ${volumePct}"
                aria-label="Volumen"
                @input=${this._setVolume}
              />
            </div>
          </div>
          ${this._state === 'error'
            ? html`<p class="error" role="alert">No se ha podido reproducir. Comprueba tu conexión e inténtalo de nuevo.</p>`
            : ''}
        </div>
        <audio
          src=${ifDefined(this.src || undefined)}
          preload="none"
          @playing=${this._onPlaying}
          @pause=${this._onPause}
          @waiting=${() => (this._state = 'loading')}
          @error=${this._fail}
          @timeupdate=${(e) => (this._time = e.target.currentTime)}
          @durationchange=${(e) => (this._duration = e.target.duration)}
        ></audio>
      </div>
    `;
  }

  _onPlaying() {
    this._state = 'playing';
    this._updateMediaSession();
    this.dispatchEvent(new CustomEvent('ui-play', { bubbles: true, composed: true }));
  }

  _onPause() {
    if (this._state === 'error') return;
    this._state = 'paused';
    this.dispatchEvent(new CustomEvent('ui-pause', { bubbles: true, composed: true }));
  }

  _fail() {
    if (!this.src) return;
    this._state = 'error';
    this.dispatchEvent(new CustomEvent('ui-error', { bubbles: true, composed: true }));
  }

  _seek(e) {
    this._audio.currentTime = Number(e.target.value);
  }

  _setVolume(e) {
    this._volume = Number(e.target.value);
    this._muted = this._volume === 0;
    this._audio.volume = this._volume;
    this._audio.muted = this._muted;
  }

  _toggleMute() {
    this._muted = !this._muted;
    if (!this._muted && this._volume === 0) this._volume = 0.6;
    this._audio.muted = this._muted;
    this._audio.volume = this._volume;
  }

  _updateMediaSession() {
    if (!('mediaSession' in navigator)) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: this.heading,
      artist: this.subheading,
      artwork: this.artwork ? [{ src: this.artwork, sizes: '512x512' }] : [],
    });
    navigator.mediaSession.setActionHandler('play', () => this.toggle());
    navigator.mediaSession.setActionHandler('pause', () => this._audio.pause());
  }
}

customElements.define('dgonmej-ui-audio-player', DgonmejUiAudioPlayer);
