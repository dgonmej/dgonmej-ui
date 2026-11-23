# Pendientes de dgonmej-ui

> Generado desde dgonmej-api el 2026-11-23. No lo edites a mano: las tareas se gestionan en el panel (dgonmej.com/admin) o en tasker, y este archivo se vuelve a generar.

- **Estado:** `[ ]` pendiente (0), `[~]` en curso (0), `[x]` hecho (1), `[-]` descartado (0).
- **Grupos:** **P0** antes de publicar, **P1** poco después, **P2** cuando haya tiempo, **Q** calidad, **D** ecosistema.

## Librería dgonmej-ui (ui.dgonmej.com)

- [x] **UI-01. Datos de ejemplo neutros en la demo y el playground** (`ui`)
  - Hecho el 2026-11-21: persona inventada (Alex Moreno y Lucía Herrera) con su trayectoria, avatar con la ilustración de whoami (`demo/avatar.png`), y reproductor «Radio Aurora 101.5» con un audio propio de 24 s generado para la demo (sin derechos de terceros, `demo/audio/ejemplo.m4a`) y una portada genérica. Se mantiene la autoría y la imagen al compartir. Subido y desplegado el 2026-11-21.
  - Quitar las referencias a Mínima FM con el logo antiguo: el reproductor de la demo (`demo/index.html`, «MínimaFM 97.9» y «Reproductor de MínimaFM»), su ejemplo en `demo/demo.js` y el título por defecto en `demo/playground.js`. Además el `artwork` apunta a la web antigua de GitHub Pages (`dgonmej.github.io/minimafm/...`), que ya no existe.
  - Quitar la información personal: la línea de tiempo con la trayectoria real («Trayectoria de Diego», TECH Education…) en `demo/demo.js` y `demo/index.html`, y el nombre real en los ejemplos de avatar y tarjetas.
  - Poner en todas las demos datos de ejemplo variados e inventados (personas, empresas, emisoras, fechas), sin datos reales.
  - Avatar: no usar la foto real (`demo/profile.jpg`); usar la ilustración de whoami (`whoami/src/assets/avatar-light.png`, y la oscura si hace falta).
  - Se pueden quedar la autoría del sitio (`meta author`, el autor en los datos estructurados y «Hecho por Diego González» en el pie), que es la firma de la librería y no un dato de ejemplo. Revisar también la imagen al compartir de lab, que muestra una tarjeta con el nombre.
  - Hecho cuando: buscar «Mínima», «Diego», «TECH» y `profile.jpg` en `demo/` solo devuelve la autoría, y las demos se ven completas con los datos nuevos.
