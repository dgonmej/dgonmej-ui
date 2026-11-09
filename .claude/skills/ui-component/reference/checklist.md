# Checklist de un componente dgonmej-ui

## Estetica
- [ ] Tiene un elemento memorable y nada de adorno sobrante.
- [ ] No parece de plantilla: ni gradiente indigo/morado sobre blanco, ni tarjeta con la sombra gris estandar, ni hover en todo.
- [ ] Gradientes suaves, de colores vecinos y con una funcion clara.
- [ ] Material translucido solo en controles flotantes, con fallback opaco.
- [ ] Sombras en capas, proporcionales a la elevacion.
- [ ] Radios coherentes y concentricos.
- [ ] Tipografia: pila de Apple, tracking negativo en titulos, sentence case.

## Tokens y temas
- [ ] Ningun valor visual suelto: todo es `var(--ui-*, fallback)`.
- [ ] Tokens nuevos anadidos a `tokens.css` con variante oscura.
- [ ] Se ve bien en claro y oscuro (no es un negativo).

## Movimiento
- [ ] Cada animacion comunica algo (estado, origen/destino, feedback).
- [ ] 150-400ms, curva tipo iOS, solo `transform`/`opacity`.
- [ ] Transiciones interrumpibles para cambios de estado.
- [ ] `prefers-reduced-motion` respetado.

## Movil y accesibilidad
- [ ] Objetivos tactiles de 44x44px minimo.
- [ ] Hover dentro de `@media (hover: hover)`.
- [ ] Contraste AA (4.5:1 texto, 3:1 UI), tambien sobre gradientes/vidrio.
- [ ] `:focus-visible` claro y navegacion completa por teclado.
- [ ] Semantica nativa o roles/ARIA correctos.
- [ ] Probado a 375px y en escritorio.

## API e integracion
- [ ] Propiedades, eventos `ui-*` y parts documentados en el JSDoc.
- [ ] Exportado en `src/index.js`.
- [ ] Seccion en `demo/index.html` con todas las variantes y estados.
- [ ] Consola sin errores en la demo.
