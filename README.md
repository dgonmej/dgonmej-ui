# dgonmej-ui

Libreria de componentes basada en [Lit](https://lit.dev) (Web Components estandar).
Se instala una vez y funciona igual en Angular, Astro, React, Vue o HTML plano,
porque no depende de ningun framework: los componentes son elementos HTML nativos.

## Por que este enfoque

- **Un solo codigo fuente** por componente. No hay version-Angular y version-Astro
  del mismo boton.
- **Estilos encapsulados** (Shadow DOM): los estilos de tu app nunca rompen la
  libreria, y la libreria nunca rompe los estilos de tu app.
- **Tokens de diseno compartidos** via CSS custom properties. Las variables
  `--ui-*` atraviesan el Shadow DOM (es la unica cosa que lo hace), asi que
  definiendolas una vez en tu app, todos los componentes las heredan.
- **Prefijo propio** (`dgonmej-ui-`) en cada custom element, para evitar
  colisiones de nombre si en el futuro usas otra libreria de Web Components
  en el mismo proyecto.
- **Cero acoplamiento a build tools de framework**: se compila una vez con Vite
  y el resultado es un modulo ES estandar.

## Estructura

```
src/
  tokens/tokens.css        <- la "guia de estilos": colores, gradientes, materiales,
                              espaciado, tipografia, radios, sombras y movimiento
  shared/
    styles.js              <- estilos comunes (tipografia base, material de vidrio, sr-only)
    icons.js               <- set de iconos de linea usado por todos los componentes
  components/<nombre>/dgonmej-ui-<nombre>.js
  index.js                 <- registra todos los custom elements
```

## Componentes

| Grupo | Componentes |
|---|---|
| Base | `icon`, `button` (primary, secondary, danger, ghost, glass), `badge`, `avatar` |
| Formularios | `text-field`, `textarea`, `select`, `switch`, `checkbox`, `radio-group`, `segmented-control` |
| Avisos y capas | `dialog`, `sheet`, `toast`, `progress`, `spinner`, `menu` |
| Estructura y navegacion | `card`, `list`, `table`, `carousel`, `nav-bar`, `tab-bar`, `timeline` |
| Medios y preferencias | `audio-player`, `theme-toggle` |

Todos llevan el prefijo `dgonmej-ui-` (p. ej. `<dgonmej-ui-switch>`). La API de cada
uno (propiedades, eventos `ui-*` y `::part()`) esta documentada en el comentario de su
clase, y la demo (`npm run dev`, `/demo/`) muestra todas sus variantes.

Los iconos son de [Lucide](https://lucide.dev) (licencia ISC, ver `THIRD_PARTY_NOTICES.md`).

En `/demo/playground.html` hay un playground para probar las opciones de cada
componente en vivo (tamano, variante, lado, slots...), cambiar el acento y la redondez
global (un solo control que mueve todos los tokens de radio), y copiar el HTML, JS y CSS
resultantes.

Los componentes de formulario participan en `<form>` como inputs nativos
(`FormData`, `form.reset()`), gracias a `ElementInternals`.

El tema oscuro se aplica solo segun el sistema, o se fuerza con
`data-theme="dark"` / `data-theme="light"` en `<html>` (lo hace `dgonmej-ui-theme-toggle`).

## Build y publicacion

```bash
npm run build        # genera dist/dgonmej-ui.js
npm publish --access restricted   # o a un registro privado (Verdaccio, GitHub Packages, Artifactory)
```

Si no quieres publicar a un registro todavia, puedes consumirla como dependencia
de workspace (`"file:../dgonmej-ui"` en package.json) o como submodulo/paquete
local mientras maduras la API.

## Uso en Astro

Astro entiende Web Components de forma nativa, sin wrapper:

```astro
---
import 'dgonmej-ui';
import 'dgonmej-ui/tokens.css';
---
<dgonmej-ui-button variant="primary">Guardar</dgonmej-ui-button>

<dgonmej-ui-list id="clientes"></dgonmej-ui-list>

<script>
  document.getElementById('clientes').items = [
    { id: 1, label: 'Cliente A' },
  ];
</script>
```

Los datos complejos (arrays, objetos) se pasan como **propiedades JS**, no como
atributos HTML (los atributos son siempre string). Por eso `items`/`columns`/`rows`
se asignan desde un `<script>`, o desde tu framework de turno via property binding.

## Uso en Angular

1. Instala y registra el custom elements schema:

```ts
// main.ts o el modulo raiz
import 'dgonmej-ui';
```

```ts
// app.module.ts (o el standalone component)
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schema: [CUSTOM_ELEMENTS_SCHEMA], // le dice a Angular "esta etiqueta no es mia, no la valides"
  ...
})
```

2. Importa los tokens una vez, globalmente (en `styles.css`):

```css
@import 'dgonmej-ui/tokens.css';
```

3. Usa los componentes en el template. Angular hace property binding con `[prop]`
   directamente sobre el custom element, que es exactamente lo que necesitan
   `items`, `columns` y `rows`:

```html
<dgonmej-ui-button variant="primary" (ui-click)="guardar()">Guardar</dgonmej-ui-button>

<dgonmej-ui-list [items]="clientes" (ui-select)="onSelect($event.detail)"></dgonmej-ui-list>

<dgonmej-ui-table [columns]="columnas" [rows]="filas"></dgonmej-ui-table>

<dgonmej-ui-carousel>
  <img src="/a.jpg" />
  <img src="/b.jpg" />
</dgonmej-ui-carousel>
```

Nota: Angular escucha eventos de custom elements con la sintaxis normal `(evento)`;
como los eventos son `CustomEvent`, el payload va en `$event.detail`. Los nombres
de evento (`ui-click`, `ui-select`, `ui-change`) no llevan el prefijo `dgonmej-`,
solo las etiquetas de los elementos lo llevan.

## Personalizar el tema por proyecto

Cada proyecto puede sobreescribir cualquier token sin tocar la libreria:

```css
/* styles.css del proyecto que consume la libreria */
@import 'dgonmej-ui/tokens.css';

:root {
  --ui-color-primary: #16a34a;   /* tu marca */
  --ui-radius-md: 4px;           /* tarjetas, campos y menus mas cuadrados */
  --ui-radius-control: 6px;      /* botones, badges, switch... (999px = capsula) */
  --ui-radius-scale: 0.5;        /* radios proporcionales (avatar redondeado) */
}
```

## Anadir un componente nuevo

1. Crear carpeta en `src/components/<nombre>/dgonmej-ui-<nombre>.js`.
2. Usar `static properties` para la API publica y `static styles` con `var(--ui-*, fallback)`
   para que respete los tokens.
3. `customElements.define('dgonmej-ui-<nombre>', Clase)`.
4. Exportarlo desde `src/index.js`.

No hace falta tocar Angular ni Astro: en cuanto se publica una nueva version del
paquete, ambos proyectos lo reciben igual.
