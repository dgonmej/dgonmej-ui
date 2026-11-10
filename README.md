# dgonmej-ui

Librería de componentes web inspirada en Apple, hecha con [Lit](https://lit.dev).
Son elementos HTML nativos (Web Components), así que funcionan igual en Angular, Astro,
React, Vue o HTML plano, sin envoltorios por framework.

- **26 componentes** de formularios, avisos, navegación, estructura y medios.
- **Personalizable con tokens CSS** (`--ui-*`): color de acento, redondez, tipografía,
  sombras y movimiento, sin tocar la librería.
- **Modo claro y oscuro** según el sistema o forzado con `data-theme`.
- **Accesibilidad de serie**: semántica nativa, teclado, foco visible, contraste AA y
  respeto por `prefers-reduced-motion`.
- **Formularios nativos**: los controles participan en `<form>` (`FormData`, `form.reset()`).
- **Demo y playground** para ver cada componente y probar sus opciones en vivo.

## Componentes

| Grupo | Componentes |
|---|---|
| Base | `button`, `badge`, `avatar`, `icon` |
| Formularios | `text-field`, `textarea`, `select`, `switch`, `checkbox`, `radio-group`, `segmented-control` |
| Avisos y capas | `dialog`, `sheet`, `toast`, `progress`, `spinner`, `menu` |
| Estructura | `card`, `list`, `table`, `carousel`, `timeline` |
| Navegación | `nav-bar`, `tab-bar` |
| Medios y preferencias | `audio-player`, `theme-toggle` |

Cada etiqueta lleva el prefijo `dgonmej-ui-` (por ejemplo `<dgonmej-ui-switch>`). La API de
cada componente (propiedades, eventos `ui-*` y partes `::part()`) está documentada en el
comentario de su clase, en `src/components/<nombre>/`.

## Demo y playground

```bash
npm install
npm run dev
```

- **`/demo/`**: galería de todos los componentes con vista previa en vivo y ejemplos completos
  (formulario, navegación móvil, reproductor y línea temporal).
- **`/demo/playground.html`**: cambia las opciones de cada componente en vivo, prueba el color
  de acento y la redondez global, y copia el HTML, JS y CSS resultantes.

## Instalación

Directamente desde GitHub (se compila al instalar):

```bash
npm install github:dgonmej/dgonmej-ui
```

Después, una sola vez en tu aplicación:

```js
import 'dgonmej-ui';             // registra todos los componentes
import 'dgonmej-ui/tokens.css';  // tokens de diseño (colores, radios, tipografía...)
```

```html
<dgonmej-ui-button variant="primary">Guardar cambios</dgonmej-ui-button>
```

Los datos complejos (arrays y objetos) se pasan como **propiedades JS**, no como atributos,
porque los atributos HTML siempre son texto:

```html
<dgonmej-ui-list id="clientes"></dgonmej-ui-list>
<script type="module">
  document.getElementById('clientes').items = [
    { id: 1, label: 'Cliente A', description: 'Activo' },
  ];
</script>
```

## Uso en Astro

Astro entiende los Web Components de forma nativa:

```astro
---
import 'dgonmej-ui';
import 'dgonmej-ui/tokens.css';
---
<dgonmej-ui-button variant="primary">Guardar</dgonmej-ui-button>
```

## Uso en Angular

```ts
// main.ts
import 'dgonmej-ui';
```

```ts
// en el componente (standalone) o módulo que use las etiquetas
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Angular no valida etiquetas que no son suyas
  // ...
})
export class ClientesComponent {}
```

```css
/* styles.css */
@import 'dgonmej-ui/tokens.css';
```

Angular enlaza propiedades con `[prop]` y escucha eventos con `(evento)`. Los eventos son
`CustomEvent`, así que los datos van en `$event.detail`:

```html
<dgonmej-ui-list [items]="clientes" (ui-select)="onSelect($event.detail)"></dgonmej-ui-list>
<dgonmej-ui-table [columns]="columnas" [rows]="filas"></dgonmej-ui-table>
```

## Personalizar el tema

Sobrescribe cualquier token en tu aplicación, sin tocar la librería:

```css
@import 'dgonmej-ui/tokens.css';

:root {
  --ui-color-primary: #1a7030;          /* color de acento (texto y enlaces) */
  --ui-gradient-primary: linear-gradient(180deg, #1d7a3a, #135c2a); /* rellenos */
  --ui-radius-md: 6px;                  /* tarjetas, campos y menús */
  --ui-radius-control: 999px;           /* botones, badges, switch... (999px = cápsula) */
  --ui-radius-scale: 0.5;               /* radios proporcionales (avatar, spinner) */
}
```

El playground genera este bloque por ti al elegir acento y redondez. El tema oscuro se
aplica según el sistema, o se fuerza con `data-theme="dark"` / `data-theme="light"` en
`<html>`; `<dgonmej-ui-theme-toggle>` lo hace y lo recuerda entre visitas.

## Estructura

```
src/
  tokens/tokens.css      tokens de diseño: color, gradientes, materiales, tipografía,
                         espaciado, radios, sombras y movimiento
  shared/styles.js       estilos comunes (tipografía base, material de vidrio)
  shared/icons.js        iconos de Lucide usados por los componentes
  components/<nombre>/   un componente por carpeta: dgonmej-ui-<nombre>.js
  index.js               registra todos los componentes
demo/                    portada, playground y mockup de teléfono
```

## Añadir un componente

1. Crea `src/components/<nombre>/dgonmej-ui-<nombre>.js`.
2. Define su API en `static properties` y sus estilos en `static styles`, usando siempre
   `var(--ui-*, fallback)` para respetar los tokens.
3. Regístralo con `customElements.define('dgonmej-ui-<nombre>', Clase)` y expórtalo en
   `src/index.js`.
4. Añádelo a la galería (`demo/demo.js`) y al playground (`demo/playground.js`).

## Build

```bash
npm run build   # genera dist/dgonmej-ui.js
```

## Licencia

[MIT](LICENSE) © Diego González.

Los iconos son de [Lucide](https://lucide.dev) (licencia ISC); ver
[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
