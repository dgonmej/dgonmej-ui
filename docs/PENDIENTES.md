# Pendientes de Librería

> Generado desde dgonmej-api el 2026-11-27. No lo edites a mano: las tareas se gestionan en el panel (dgonmej.com/admin) o en tasker, y este archivo se vuelve a generar.

- **Estado:** `[ ]` pendiente (1), `[~]` en curso (0), `[x]` hecho (4), `[-]` descartado (1).
- **Códigos:** **UI** y un número. **Prioridad:** crítica, alta, media o baja (en la primera línea de cada tarea).

## Librería dgonmej-ui (ui.dgonmej.com)

- [x] **UI-01. Datos de ejemplo neutros en la demo y el playground** (`dgonmej-ui`): La demo y el playground de dgonmej-ui usan datos de ejemplo neutros en vez de Mínima FM.
  - Prioridad: Media · Cerrada el 23-11-2026
  - Hecho el 2026-11-21: persona inventada (Alex Moreno y Lucía Herrera) con su trayectoria, avatar con la ilustración de whoami (`demo/avatar.png`), y reproductor «Radio Aurora 101.5» con un audio propio de 24 s generado para la demo (sin derechos de terceros, `demo/audio/ejemplo.m4a`) y una portada genérica. Se mantiene la autoría y la imagen al compartir. Subido y desplegado el 2026-11-21.
  - Quitar las referencias a Mínima FM con el logo antiguo: el reproductor de la demo (`demo/index.html`, «MínimaFM 97.9» y «Reproductor de MínimaFM»), su ejemplo en `demo/demo.js` y el título por defecto en `demo/playground.js`. Además el `artwork` apunta a la web antigua de GitHub Pages (`dgonmej.github.io/minimafm/...`), que ya no existe.
  - Quitar la información personal: la línea de tiempo con la trayectoria real («Trayectoria de Diego», TECH Education…) en `demo/demo.js` y `demo/index.html`, y el nombre real en los ejemplos de avatar y tarjetas.
  - Poner en todas las demos datos de ejemplo variados e inventados (personas, empresas, emisoras, fechas), sin datos reales.
  - Avatar: no usar la foto real (`demo/profile.jpg`); usar la ilustración de whoami (`whoami/src/assets/avatar-light.png`, y la oscura si hace falta).
  - Se pueden quedar la autoría del sitio (`meta author`, el autor en los datos estructurados y «Hecho por Diego González» en el pie), que es la firma de la librería y no un dato de ejemplo. Revisar también la imagen al compartir de lab, que muestra una tarjeta con el nombre.
  - Hecho cuando: buscar «Mínima», «Diego», «TECH» y `profile.jpg` en `demo/` solo devuelve la autoría, y las demos se ven completas con los datos nuevos.

- [ ] **UI-02. Borrar la foto real del historial de git** (`dgonmej-ui`): Quitar del historial del repo público la foto real que se usó en la demo antes del avatar ilustrado.
  - Prioridad: Media
  - El repo dgonmej/dgonmej-ui es público: aunque la foto ya no esté en main, sigue en commits antiguos.
  - Reescribir el historial con git filter-repo (quitar la ruta o rutas de la foto), forzar la subida de todas las ramas y etiquetas (v0.1.x) y pedir a GitHub que purgue la caché si hace falta. Las etiquetas publicadas en npm no cambian de código, pero sus commits sí de hash.
  - Avisar de que los clones existentes quedan desfasados (solo Diego).
  - Hecho cuando: buscar la foto en todo el historial no da resultados y las etiquetas siguen apuntando a commits válidos.

## Sin sección

- [x] **UI-03. Autorrelleno en los campos de texto: teñir el campo entero** (`dgonmej-ui`, `dgonmej-api`, `minimafm-api`, `tasker`): Hecho el 2026-11-26: al autorrellenar correo o contraseña quedaba un rectángulo azul dentro del campo; ahora se tiñe el campo entero. dgonmej-ui 0.1.5.
  - Prioridad: Media · Cerrada el 26-11-2026
  - Problema (visto por Diego en el login del panel de dgonmej): el navegador pinta el fondo del autorrelleno solo dentro del <input>, que no llega a los bordes redondeados del campo ni al botón del ojo.
  - Arreglo en dgonmej-ui-text-field: con :autofill / :-webkit-autofill, el campo (.field:has(...)) se tiñe con color-mix del acento (9 %) y la superficie, y el <input> se tapa del mismo color con una sombra interior (el fondo del autorrelleno no se puede quitar). Claro y oscuro.
  - PR: https://github.com/dgonmej/dgonmej-ui/pull/10 (publicado en npm como 0.1.5).
  - Actualizado a 0.1.5 y desplegado en el panel de dgonmej (https://github.com/dgonmej/dgonmej-api/pull/13), el de la radio (https://github.com/dgonmej/minimafm-api/pull/15) y taskER (https://github.com/dgonmej/tasker/pull/7). Las webs sin login lo recibirán con Dependabot.
  - Comprobado en WebKit que las reglas se aplican y el aspecto simulado; falta verlo con el autorrelleno real en Safari.

- [x] **UI-04. Carrusel con muchas diapositivas: contador en vez de puntos** (`dgonmej-ui`, `mothers-day`): Hecho el 2026-11-27: con más de 7 diapositivas, contador «3 / 26» en vez de puntos. dgonmej-ui 0.1.6, publicada.
  - Prioridad: Media · Cerrada el 27-11-2026
  - Problema: dgonmej-ui-carousel pinta un punto (20 px) por diapositiva; con 26 fotos la fila era más ancha que la pantalla y tapaba el pie de la imagen.
  - Arreglo: a partir de 8 diapositivas, contador «n / total» con cifras tabulares en la misma píldora (con el botón de pausa si hay autoplay) y el texto «Diapositiva n de total» para lectores de pantalla (clave carousel.position en i18n, en español e inglés). Con 7 o menos, los puntos de siempre.
  - Playground: opción de 12 diapositivas para verlo.
  - Versión 0.1.6 (hay que publicarla en npm) y actualizar mothers-day.
  - Hecho cuando: la galería de Mother's Day con 26 fotos no desborda en 320 px y el contador avanza.
  - Hecho el 2026-11-27: PR https://github.com/dgonmej/dgonmej-ui/pull/12, publicada en npm como 0.1.6 y usada en mothers-day (MB-07). Comprobado en WebKit a 320, 375 y 1280 px.

- [x] **UI-05. Reproductor: reconectar el directo si se corta** (`dgonmej-ui`): Hecho el 2026-11-27: el reproductor en directo se reconecta solo si se corta; publicada la 0.1.7 y en uso en la web de la radio.
  - Prioridad: Alta · Cerrada el 27-11-2026
  - Antes: si el servidor cortaba la conexión, el audio lanzaba 'ended' y el reproductor se quedaba en pausa, sin volver a intentarlo.
  - Ahora, solo con `live` y si quien escucha no ha pausado: en 'ended' o 'error' vuelve a cargar tras 1, 2, 4… hasta 15 s; 12 intentos (unos 2 minutos) antes de mostrar el error. La pausa del botón o de los controles del sistema para los intentos.
  - Probado contra Icecast local (RAD-54): con Icecast parado 10 s, vuelve a sonar solo a los pocos segundos de arrancar.
  - Hecho cuando: publicada la 0.1.7 en npm y la web de la radio la usa.
  - Hecho el 2026-11-27: https://github.com/dgonmej/dgonmej-ui/pull/14, publicada en npm la 0.1.7 y la web de la radio la usa (https://github.com/dgonmej/minimafm/pull/12).

- [-] **UI-06. Reproductor: indicador de conexión redondo** (`dgonmej-ui`): Descartado el 2026-11-27: no hace falta tocar la librería; la web de la radio da --ui-radius-scale al reproductor y el spinner sale redondo (RAD-54).
  - Prioridad: Media · Descartada el 27-11-2026
  - Antes seguía la redondez global (--ui-radius-scale) y en la web de la radio salía como un cuadrado redondeado.
  - Ahora el reproductor le pone --ui-radius-scale: 2 al spinner del botón, que lo convierte en disco.
  - Hecho cuando: publicada la 0.1.8 y la web de la radio la usa.
  - Descartado: las variables CSS atraviesan el shadow DOM, así que basta con `dgonmej-ui-audio-player { --ui-radius-scale: 1.5 }` en la web que lo usa.
