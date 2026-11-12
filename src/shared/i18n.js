/*
 * Textos por defecto de los componentes en cada idioma.
 * El idioma se toma del atributo `lang` mas cercano al componente (o del <html>),
 * con el espanol como respaldo. Las propiedades que fije el consumidor (label,
 * empty-text...) siempre tienen prioridad sobre estos textos.
 */
const DICT = {
  es: {
    'theme.label': 'Tema',
    'theme.system': 'Sistema',
    'theme.light': 'Claro',
    'theme.dark': 'Oscuro',
    'theme.change': 'Tema: {theme}. Cambiar tema',
    'timeline.label': 'Línea temporal',
    'timeline.current': 'Actualidad',
    'segmented.label': 'Opciones',
    'avatar.label': 'Avatar',
    'avatar.online': 'conectado',
    'avatar.away': 'ausente',
    'avatar.busy': 'ocupado',
    'toast.close': 'Cerrar aviso',
    'field.clear': 'Borrar',
    'field.required': 'obligatorio',
    'field.showPassword': 'Mostrar contraseña',
    'field.hidePassword': 'Ocultar contraseña',
    'field.openCalendar': 'Abrir calendario',
    'field.chooseTime': 'Elegir hora',
    'carousel.label': 'Carrusel',
    'carousel.roledescription': 'carrusel',
    'carousel.prev': 'Anterior',
    'carousel.next': 'Siguiente',
    'carousel.goTo': 'Ir a la diapositiva {n} de {total}',
    'carousel.pause': 'Pausar carrusel',
    'carousel.resume': 'Reanudar carrusel',
    'list.empty': 'Todavía no hay elementos',
    'table.label': 'Tabla',
    'table.empty': 'Todavía no hay datos',
    'menu.label': 'Menú',
    'progress.label': 'Progreso',
    'spinner.label': 'Cargando',
    'tabbar.label': 'Navegación principal',
    'player.live': 'En directo',
    'player.play': 'Reproducir',
    'player.pause': 'Pausar',
    'player.connecting': 'Conectando',
    'player.mute': 'Silenciar',
    'player.unmute': 'Activar sonido',
    'player.volume': 'Volumen',
    'player.position': 'Posición',
    'player.positionText': '{time} de {total}',
    'player.error': 'No se ha podido reproducir. Comprueba tu conexión e inténtalo de nuevo.',
  },
  en: {
    'theme.label': 'Theme',
    'theme.system': 'System',
    'theme.light': 'Light',
    'theme.dark': 'Dark',
    'theme.change': 'Theme: {theme}. Change theme',
    'timeline.label': 'Timeline',
    'timeline.current': 'Present',
    'segmented.label': 'Options',
    'avatar.label': 'Avatar',
    'avatar.online': 'online',
    'avatar.away': 'away',
    'avatar.busy': 'busy',
    'toast.close': 'Dismiss',
    'field.clear': 'Clear',
    'field.required': 'required',
    'field.showPassword': 'Show password',
    'field.hidePassword': 'Hide password',
    'field.openCalendar': 'Open calendar',
    'field.chooseTime': 'Choose time',
    'carousel.label': 'Carousel',
    'carousel.roledescription': 'carousel',
    'carousel.prev': 'Previous',
    'carousel.next': 'Next',
    'carousel.goTo': 'Go to slide {n} of {total}',
    'carousel.pause': 'Pause carousel',
    'carousel.resume': 'Resume carousel',
    'list.empty': 'No items yet',
    'table.label': 'Table',
    'table.empty': 'No data yet',
    'menu.label': 'Menu',
    'progress.label': 'Progress',
    'spinner.label': 'Loading',
    'tabbar.label': 'Main navigation',
    'player.live': 'Live',
    'player.play': 'Play',
    'player.pause': 'Pause',
    'player.connecting': 'Connecting',
    'player.mute': 'Mute',
    'player.unmute': 'Unmute',
    'player.volume': 'Volume',
    'player.position': 'Position',
    'player.positionText': '{time} of {total}',
    'player.error': "Couldn't play the audio. Check your connection and try again.",
  },
};

/** Idiomas con textos incluidos. */
export const supportedLocales = Object.keys(DICT);

/** Idioma efectivo de un componente: `lang` mas cercano o el del documento. */
export function localeOf(host) {
  const lang = host?.closest?.('[lang]')?.getAttribute('lang') || document.documentElement.lang || 'es';
  const short = lang.toLowerCase().slice(0, 2);
  return DICT[short] ? short : 'es';
}

/** Traduce una clave para el componente `host`, sustituyendo {variables}. */
export function t(host, key, vars = {}) {
  const text = DICT[localeOf(host)][key] ?? DICT.es[key] ?? key;
  return text.replace(/\{(\w+)\}/g, (_, name) => (name in vars ? vars[name] : `{${name}}`));
}
