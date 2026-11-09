---
name: ui-component
description: Crear o modificar componentes Lit de dgonmej-ui (dgonmej-ui-*) con la estetica moderna estilo Apple del proyecto - tokens, gradientes, materiales translucidos, animaciones suaves, modo oscuro y accesibilidad. Usar al anadir un componente nuevo, redisenar uno existente o ajustar sus estilos.
---

# ui-component

Guia para construir componentes de dgonmej-ui. La direccion visual esta en la skill global `ui-design` y las reglas de tokens en `CLAUDE.md`; esta skill es el proceso.

## 1. Entender antes de disenar

- Que problema resuelve el componente, donde se usara (web, movil, ambos) y que estados tiene (reposo, hover, pulsado, foco, deshabilitado, cargando, vacio, error).
- Revisar los componentes existentes en `src/components/` para reutilizar patrones (p. ej. el carrusel compone `dgonmej-ui-button`).

## 2. Plan de diseno breve (antes de escribir codigo)

Escribir en pocas lineas:
- **Jerarquia**: que es contenido y que es control.
- **Tokens** que usa y cuales faltan (anadirlos a `src/tokens/tokens.css` con variante oscura).
- **Material**: superficie solida o translucida (solo controles flotantes).
- **Momento de movimiento**: la unica animacion que define al componente y que comunica.
- **Elemento memorable**: un detalle con caracter (un gradiente sutil, un brillo, una transicion de forma). Quitar cualquier otro adorno que no aporte.

Revisar el plan: si algo suena a plantilla generica (gradiente indigo, tarjeta con sombra estandar, hover en todo), cambiarlo.

## 3. Implementar

Partir de `reference/component-template.js`. Reglas:
- Archivo `src/components/<nombre>/dgonmej-ui-<nombre>.js`, clase `DgonmejUi<Nombre>`, `customElements.define('dgonmej-ui-<nombre>', ...)`.
- API publica en `static properties`; datos complejos como propiedades JS, no atributos. `reflect: true` en estados que afecten al estilo (`disabled`, `selected`, `open`).
- Estilos en `static styles` usando siempre `var(--ui-*, fallback)`. Combinar con los compartidos de `src/shared/styles.js` (`hostBase`, `material`, `srOnly`): ``static styles = [hostBase, css`...`]``.
- Iconos con `renderIcon(name)` de `src/shared/icons.js`; si falta uno, anadirlo alli (rejilla 24, trazo 2).
- Si es un control de formulario: `static formAssociated = true` y `ElementInternals.setFormValue()`.
- Si el disparador puede ser un `dgonmej-ui-button`, el estado ARIA se pasa por sus propiedades (`expanded`, `haspopup`, `label`), no como atributos en el host.
- Eventos `CustomEvent('ui-<accion>', { detail, bubbles: true, composed: true })`. Documentarlos en el JSDoc de la clase.
- Semantica nativa primero (`<button>`, `<ul>`, `<table>`); si no, `role`, `tabindex` y manejo de teclado (Enter/Espacio, flechas en listas y carruseles).
- Exponer `::part()` en las piezas que el consumidor pueda querer personalizar.
- Incluir siempre: `:focus-visible`, `@media (hover: hover)`, `@media (prefers-reduced-motion: reduce)` y fallback de `backdrop-filter` si se usa.

## 4. Integrar

- Exportarlo en `src/index.js`.
- Anadir una seccion en `demo/index.html` con todas sus variantes y estados, y registrar sus eventos en el log de la demo.
- Actualizar el README si cambia la API publica.

## 5. Verificar en el navegador

Con la preview `dgonmej-ui-demo` (`/demo/`):
- Consola sin errores.
- Modo claro y oscuro (`data-theme="dark"`).
- Ancho movil (375px) y escritorio.
- Teclado: tabular, activar, ver el foco.
- Movimiento reducido.
- Captura de pantalla y critica honesta frente a `reference/checklist.md`; iterar hasta cumplirlo.

## 6. Cerrar

Resumir que se ha hecho y como se ha verificado. **No hacer commit sin pedir permiso** (regla global).
