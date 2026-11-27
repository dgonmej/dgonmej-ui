/*
 * Pie compartido por la demo y el playground (mismo pie que whoami y links): version de la
 * libreria, autoria y año, mas el boton de volver arriba al bajar por la pagina.
 * Se rellena en <footer id="pie" class="pie"></footer>.
 */
import { version } from '../package.json';
import './footer.css';

// Iconos de Lucide (ISC), los mismos que usa whoami
const svg = (d) => `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const CORAZON = '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>';
const FLECHA = '<path d="m5 12 7-7 7 7"/><path d="M12 19V5"/>';

const pie = document.getElementById('pie');
if (pie) {
  pie.innerHTML = `
    <span class="pie-version">v${version}</span>
    <p class="pie-hecho">Hecho con <span class="pie-corazon" role="img" aria-label="amor">${svg(CORAZON)}</span> por <strong>Diego González</strong></p>
    <p class="pie-copy">© ${new Date().getFullYear()}</p>`;

  const arriba = document.createElement('div');
  arriba.className = 'pie-arriba';
  arriba.innerHTML = `<dgonmej-ui-button variant="glass" icon label="Volver arriba">${svg(FLECHA)}</dgonmej-ui-button>`;
  document.body.append(arriba);

  const reducido = matchMedia('(prefers-reduced-motion: reduce)');
  arriba.firstElementChild.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reducido.matches ? 'auto' : 'smooth' }));
  const actualizar = () => arriba.classList.toggle('visible', window.scrollY > window.innerHeight * 0.6);
  window.addEventListener('scroll', actualizar, { passive: true });
  actualizar();
}
