import { iconNames } from '../src/components/icon/dgonmej-ui-icon.js';

/*
 * Playground: cada componente declara sus controles y como se pinta.
 * - Los controles normales se aplican en vivo como atributo del componente (se ven sus transiciones).
 * - Los marcados con `rebuild` cambian el contenido (slots, datos) y vuelven a montar el escenario.
 * - El codigo HTML/JS solo incluye lo que difiere del valor por defecto del componente.
 */

const $ = (id) => document.getElementById(id);
const esc = (v) =>
  String(v).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

// ---------- Controles ----------
const select = (key, label, options, value, extra = {}) => ({ key, label, type: 'select', options, value, ...extra });
const seg = (key, label, options, value, extra = {}) => ({ key, label, type: 'segmented', options, value, ...extra });
const bool = (key, label, value = false, extra = {}) => ({ key, label, type: 'boolean', value, ...extra });
const text = (key, label, value = '', extra = {}) => ({ key, label, type: 'text', value, ...extra });

const opt = (value, label = value) => ({ value, label });

// ---------- Datos de ejemplo ----------
const ICON_SVG = (name) => `<dgonmej-ui-icon name="${name}"></dgonmej-ui-icon>`;

const listItems = (desc) => [
  { id: 1, label: 'Factura #001', ...(desc && { description: 'Vence el 20/09' }) },
  { id: 2, label: 'Factura #002', ...(desc && { description: 'Pagada' }) },
  { id: 3, label: 'Factura #003', ...(desc && { description: 'Pendiente de revisión' }) },
];

const tableData = {
  columns: [
    { key: 'name', header: 'Nombre' },
    { key: 'role', header: 'Rol' },
    { key: 'tasks', header: 'Tareas', align: 'end' },
  ],
  rows: [
    { name: 'Ana', role: 'Admin', tasks: 12 },
    { name: 'Luis', role: 'Editor', tasks: 7 },
    { name: 'Marta', role: 'Lectora', tasks: 0 },
    { name: 'Carlos', role: 'Editor', tasks: 3 },
  ],
};

const timelineItems = (s) => {
  const items = [
    {
      kind: 'education',
      period: '2016 – 2018',
      title: 'Desarrollo de Aplicaciones Web',
      description: 'Ciclo superior centrado en diseñar, desarrollar y mantener sitios web.',
      highlights: ['Bases de datos', 'JavaScript', 'PHP'],
    },
    {
      kind: 'work',
      period: '2018 – 2020',
      title: 'Desarrollador en Open Data Security',
      description: 'Proyectos de ciberseguridad con Kanban y Scrum.',
      highlights: ['Backend', 'Frontend', 'App móvil'],
      links: [{ label: 'secureaccess.com', href: 'https://secureaccess.com' }],
    },
    {
      kind: 'travel',
      period: '2015',
      title: 'Erasmus+ en Italia',
      description: 'Parte de las prácticas en Vegan Solutions S.R.L.',
      highlights: ['Testing', 'Componentes web'],
    },
    {
      kind: 'work',
      period: '2021',
      current: s.current,
      title: 'TECH Education Rights & Technologies',
      description: 'Responsable del frontend de la intranet con Angular y web components.',
      highlights: ['Angular', 'Web components', 'Liderazgo técnico'],
    },
  ].map((i) => ({
    ...i,
    highlights: s.highlights ? i.highlights : undefined,
    links: s.links ? i.links : undefined,
  }));
  if (s.milestones) {
    items.unshift({ milestone: true, kind: 'start', title: 'Mi trayectoria', description: 'Empieza el viaje' });
    items.push({ milestone: true, kind: 'end', title: 'Y esto no acaba aquí', description: 'Continuará…' });
  }
  return items;
};

const tabItems = (n) =>
  [
    { value: 'home', label: 'Inicio', icon: 'house' },
    { value: 'search', label: 'Buscar', icon: 'search' },
    { value: 'radio', label: 'Radio', icon: 'radio' },
    { value: 'music', label: 'Música', icon: 'music' },
    { value: 'settings', label: 'Ajustes', icon: 'sliders' },
  ].slice(0, n);

const SLIDES = [
  ['Océano', 'radial-gradient(80% 90% at 20% 10%, #64d2ff, transparent 70%), linear-gradient(160deg, #0a84ff, #0040a8)'],
  ['Atardecer', 'radial-gradient(70% 80% at 85% 0%, #ffcc00, transparent 65%), linear-gradient(160deg, #f07800, #a82c00)'],
  ['Bosque', 'radial-gradient(80% 90% at 30% 0%, #66d4cf, transparent 70%), linear-gradient(160deg, #30b158, #0b6b3a)'],
  ['Lavanda', 'radial-gradient(80% 90% at 70% 0%, #da8fff, transparent 70%), linear-gradient(160deg, #8944ab, #4a2161)'],
  ['Noche', 'radial-gradient(80% 90% at 20% 0%, #5e5ce6, transparent 70%), linear-gradient(160deg, #1d1d3f, #05050f)'],
];

const JSON_ = (v) => JSON.stringify(v, null, 2);

// Mockup de telefono: bisel, barra de estado y pantalla con scroll propio
const phone = (inner) =>
  `<div class="phone"><div class="phone-frame"><div class="screen"><div class="status" aria-hidden="true"><span>9:41</span><span class="island"></span><span class="icons"><svg viewBox="0 0 24 24"><path d="M2 20h.01"/><path d="M7 20v-4"/><path d="M12 20v-8"/><path d="M17 20V8"/><path d="M22 4v16"/></svg><svg viewBox="0 0 24 24"><path d="M12 20h.01"/><path d="M2 8.82a15 15 0 0 1 20 0"/><path d="M5 12.859a10 10 0 0 1 14 0"/><path d="M8.5 16.429a5 5 0 0 1 7 0"/></svg><span class="battery"></span></span></div><div class="phone-scroll" id="phone">${inner}</div><span class="home-indicator" aria-hidden="true"></span></div></div></div>`;

// ---------- Componentes ----------
const components = [
  // Base
  {
    id: 'button',
    name: 'Botón',
    group: 'Base',
    tag: 'dgonmej-ui-button',
    wantsColor: (s) => s.variant === 'glass',
    controls: [
      select('variant', 'Variante', ['primary', 'secondary', 'danger', 'ghost', 'glass'].map((v) => opt(v)), 'primary'),
      seg('size', 'Tamaño', ['small', 'medium', 'large'].map((v) => opt(v)), 'medium'),
      text('text', 'Texto', 'Guardar cambios', { rebuild: true, attr: false }),
      bool('icon', 'Solo icono', false, { rebuild: true }),
      bool('block', 'Ancho completo'),
      bool('disabled', 'Deshabilitado'),
    ],
    markup: (s, a) =>
      s.icon
        ? `<dgonmej-ui-button${a('variant', 'size', 'block', 'disabled')} icon label="${esc(s.text)}">\n  ${ICON_SVG('plus')}\n</dgonmej-ui-button>`
        : `<dgonmej-ui-button${a('variant', 'size', 'block', 'disabled')}>${esc(s.text)}</dgonmej-ui-button>`,
  },
  {
    id: 'badge',
    name: 'Badge',
    group: 'Base',
    tag: 'dgonmej-ui-badge',
    controls: [
      select('variant', 'Variante', ['neutral', 'accent', 'success', 'warning', 'danger'].map((v) => opt(v)), 'success'),
      seg('size', 'Tamaño', ['small', 'medium', 'large'].map((v) => opt(v)), 'medium'),
      bool('dot', 'Punto', true),
      text('text', 'Texto', 'Pagada', { rebuild: true, attr: false }),
    ],
    defaults: { variant: 'neutral' },
    markup: (s, a) => `<dgonmej-ui-badge${a('variant', 'size', 'dot')}>${esc(s.text)}</dgonmej-ui-badge>`,
  },
  {
    id: 'avatar',
    name: 'Avatar',
    group: 'Base',
    tag: 'dgonmej-ui-avatar',
    controls: [
      seg('size', 'Tamaño', ['sm', 'md', 'lg', 'xl'].map((v) => opt(v)), 'xl'),
      seg('shape', 'Forma', [opt('circle', 'Círculo'), opt('rounded', 'Redondeada'), opt('blob', 'Gota')], 'circle'),
      select('status', 'Estado', [opt('', 'Ninguno'), opt('online', 'Conectado'), opt('away', 'Ausente'), opt('busy', 'Ocupado')], 'online'),
      bool('ring', 'Aro de acento (con la gota, gira)', true),
      bool('photo', 'Con foto', true, { rebuild: true, attr: false }),
      text('name', 'Nombre', 'Diego González'),
    ],
    defaults: { size: 'md', status: '', ring: false },
    markup: (s, a) =>
      `<dgonmej-ui-avatar${a('name', 'size', 'shape', 'status', 'ring')}${
        s.photo ? '\n  src="https://dgonmej.github.io/whoami/images/main_profile_mobile.jpg"' : ''
      }></dgonmej-ui-avatar>`,
  },
  {
    id: 'icon',
    name: 'Icono',
    group: 'Base',
    tag: 'dgonmej-ui-icon',
    controls: [
      select('name', 'Icono', iconNames.map((v) => opt(v)), 'rocket', { defaultValue: '' }),
      seg('size', 'Tamaño', ['16', '20', '24', '32', '48'].map((v) => opt(v)), '32', { defaultValue: '20' }),
      text('label', 'Nombre accesible', ''),
    ],
    markup: (s, a) => `<dgonmej-ui-icon${a('name', 'size', 'label')}></dgonmej-ui-icon>`,
  },

  // Formularios
  {
    id: 'text-field',
    name: 'Campo de texto',
    group: 'Formularios',
    tag: 'dgonmej-ui-text-field',
    block: true,
    controls: [
      seg('variant', 'Variante', ['filled', 'outlined'].map((v) => opt(v)), 'filled'),
      seg('size', 'Tamaño', ['small', 'medium', 'large'].map((v) => opt(v)), 'medium'),
      select(
        'type',
        'Tipo',
        [
          opt('text'),
          opt('email'),
          opt('password', 'password (ver/ocultar)'),
          opt('number'),
          opt('search', 'search (lupa)'),
          opt('date', 'date (calendario)'),
          opt('time', 'time (reloj)'),
          opt('datetime-local', 'datetime-local'),
          opt('month'),
          opt('week'),
          opt('year', 'year (año)'),
        ],
        'email'
      ),
      text('label', 'Etiqueta', 'Correo'),
      text('value', 'Valor', 'diego@dgonmej.dev', { live: 'prop' }),
      text('placeholder', 'Placeholder', 'tu@correo.com'),
      text('helper', 'Ayuda', 'Solo lo usaremos para la factura'),
      text('error', 'Error', ''),
      bool('required', 'Obligatorio'),
      bool('clearable', 'Botón borrar', true),
      bool('no-icon', 'Sin icono de tipo'),
      bool('disabled', 'Deshabilitado'),
    ],
    defaults: { type: 'text', clearable: false },
    frame: 'narrow',
    markup: (s, a) =>
      `<dgonmej-ui-text-field${a('label', 'value', 'type', 'placeholder', 'helper', 'error', 'variant', 'size', 'required', 'clearable', 'no-icon', 'disabled')}\n></dgonmej-ui-text-field>`,
  },
  {
    id: 'textarea',
    name: 'Área de texto',
    group: 'Formularios',
    tag: 'dgonmej-ui-textarea',
    block: true,
    frame: 'narrow',
    controls: [
      seg('variant', 'Variante', ['filled', 'outlined'].map((v) => opt(v)), 'filled'),
      text('label', 'Etiqueta', 'Mensaje'),
      text('placeholder', 'Placeholder', 'Cuéntanos qué necesitas'),
      text('helper', 'Ayuda', 'Te responderemos en 24 horas'),
      text('error', 'Error', ''),
      seg('rows', 'Filas', ['2', '3', '5'].map((v) => opt(v)), '3'),
      seg('maxlength', 'Límite', [opt('', 'Sin límite'), opt('140'), opt('280')], '280', { defaultValue: '' }),
      bool('autoresize', 'Crece con el texto', true),
      bool('required', 'Obligatorio'),
      bool('disabled', 'Deshabilitado'),
    ],
    defaults: { autoresize: false },
    markup: (s, a) =>
      `<dgonmej-ui-textarea${a('label', 'placeholder', 'helper', 'error', 'rows', 'maxlength', 'variant', 'autoresize', 'required', 'disabled')}
></dgonmej-ui-textarea>`,
  },
  {
    id: 'select',
    name: 'Select',
    group: 'Formularios',
    tag: 'dgonmej-ui-select',
    block: true,
    controls: [
      seg('variant', 'Variante', ['filled', 'outlined'].map((v) => opt(v)), 'filled'),
      seg('size', 'Tamaño', ['small', 'medium', 'large'].map((v) => opt(v)), 'medium'),
      text('label', 'Etiqueta', 'País'),
      text('placeholder', 'Placeholder', 'Elige un país'),
      text('helper', 'Ayuda', ''),
      bool('disabled', 'Deshabilitado'),
    ],
    frame: 'narrow',
    data: {
      options: [opt('es', 'España'), opt('pt', 'Portugal'), opt('it', 'Italia'), opt('fr', 'Francia')],
    },
    markup: (s, a) => `<dgonmej-ui-select${a('label', 'placeholder', 'helper', 'variant', 'size', 'disabled')}\n></dgonmej-ui-select>`,
  },
  {
    id: 'switch',
    name: 'Switch',
    group: 'Formularios',
    tag: 'dgonmej-ui-switch',
    controls: [
      seg('size', 'Tamaño', ['small', 'medium'].map((v) => opt(v)), 'medium'),
      bool('checked', 'Activado', true),
      bool('disabled', 'Deshabilitado'),
      text('text', 'Etiqueta', 'Recibir novedades', { rebuild: true, attr: false }),
    ],
    defaults: { checked: false },
    markup: (s, a) => `<dgonmej-ui-switch${a('size', 'checked', 'disabled')}>${esc(s.text)}</dgonmej-ui-switch>`,
  },
  {
    id: 'checkbox',
    name: 'Checkbox',
    group: 'Formularios',
    tag: 'dgonmej-ui-checkbox',
    controls: [
      bool('checked', 'Marcado', true),
      bool('disabled', 'Deshabilitado'),
      text('text', 'Etiqueta', 'Acepto las condiciones', { rebuild: true, attr: false }),
    ],
    defaults: { checked: false },
    markup: (s, a) => `<dgonmej-ui-checkbox${a('checked', 'disabled')}>${esc(s.text)}</dgonmej-ui-checkbox>`,
  },
  {
    id: 'radio-group',
    name: 'Grupo de radios',
    group: 'Formularios',
    tag: 'dgonmej-ui-radio-group',
    block: true,
    controls: [
      text('label', 'Etiqueta', 'Plan'),
      select('value', 'Valor', [opt('free', 'Gratis'), opt('pro', 'Pro'), opt('team', 'Equipo')], 'pro', { defaultValue: '' }),
      bool('descriptions', 'Descripciones', true, { rebuild: true, attr: false }),
      bool('disabled', 'Deshabilitado'),
    ],
    frame: 'narrow',
    data: (s) => ({
      options: [
        { value: 'free', label: 'Gratis', ...(s.descriptions && { description: 'Hasta 3 facturas al mes' }) },
        { value: 'pro', label: 'Pro', ...(s.descriptions && { description: 'Facturas ilimitadas y recordatorios' }) },
        { value: 'team', label: 'Equipo', ...(s.descriptions && { description: 'Varios usuarios y permisos' }) },
      ],
    }),
    markup: (s, a) => `<dgonmej-ui-radio-group${a('label', 'value', 'disabled')}></dgonmej-ui-radio-group>`,
  },
  {
    id: 'segmented-control',
    name: 'Control segmentado',
    group: 'Formularios',
    tag: 'dgonmej-ui-segmented-control',
    controls: [
      seg('variant', 'Variante', ['neutral', 'filled'].map((v) => opt(v)), 'neutral'),
      seg('size', 'Tamaño', ['small', 'medium'].map((v) => opt(v)), 'medium', { defaultValue: '' }),
      seg('count', 'Opciones', ['2', '3', '4'].map((v) => opt(v)), '3', { rebuild: true, attr: false }),
      bool('icons', 'Con iconos', false, { rebuild: true, attr: false }),
    ],
    data: (s) => ({
      options: [
        { value: 'day', label: 'Día', icon: 'sun' },
        { value: 'week', label: 'Semana', icon: 'calendar' },
        { value: 'month', label: 'Mes', icon: 'star' },
        { value: 'year', label: 'Año', icon: 'flag' },
      ]
        .slice(0, Number(s.count))
        .map((o) => (s.icons ? o : { value: o.value, label: o.label })),
    }),
    markup: (s, a) => `<dgonmej-ui-segmented-control label="Vista" value="week"${a('variant', 'size')}></dgonmej-ui-segmented-control>`,
  },

  // Avisos y capas
  {
    id: 'dialog',
    name: 'Diálogo',
    group: 'Avisos y capas',
    tag: 'dgonmej-ui-dialog',
    controls: [
      seg('size', 'Tamaño', ['small', 'medium', 'large'].map((v) => opt(v)), 'medium'),
      text('heading', 'Título', '¿Eliminar la factura #002?'),
      text('description', 'Descripción', 'Se borrará de forma permanente y no podrás recuperarla.'),
      bool('light-dismiss', 'Cerrar al pulsar fuera'),
    ],
    markup: (s, a) =>
      `<dgonmej-ui-dialog${a('heading', 'description', 'size', 'light-dismiss')}>\n  <dgonmej-ui-button slot="actions" variant="secondary" data-close="cancel">Cancelar</dgonmej-ui-button>\n  <dgonmej-ui-button slot="actions" variant="danger" data-close="confirm">Eliminar</dgonmej-ui-button>\n</dgonmej-ui-dialog>`,
    stage: (m) =>
      `${m.replace('<dgonmej-ui-dialog', '<dgonmej-ui-dialog inline')}<div class="center" style="margin-top: 24px"><dgonmej-ui-button variant="danger" data-open>Abrir como modal</dgonmej-ui-button></div>${m}`,
    js: () => `document.querySelector('dgonmej-ui-dialog').show();`,
    note: 'Arriba, la vista previa en línea (atributo inline). El botón abre el modal real.',
  },
  {
    id: 'sheet',
    name: 'Sheet',
    group: 'Avisos y capas',
    tag: 'dgonmej-ui-sheet',
    controls: [
      text('heading', 'Título', 'Filtros'),
      text('description', 'Descripción', 'Elige qué facturas quieres ver.'),
      bool('light-dismiss', 'Cerrar al pulsar fuera', true),
    ],
    markup: (s, a) =>
      `<dgonmej-ui-sheet${a('heading', 'description', 'light-dismiss')}>\n  <dgonmej-ui-switch checked>Pagadas</dgonmej-ui-switch>\n  <dgonmej-ui-switch>Vencidas</dgonmej-ui-switch>\n  <dgonmej-ui-button slot="actions" variant="primary" data-close="apply">Aplicar filtros</dgonmej-ui-button>\n</dgonmej-ui-sheet>`,
    stage: (m) =>
      `${m.replace('<dgonmej-ui-sheet', '<dgonmej-ui-sheet inline')}<div class="center" style="margin-top: 24px"><dgonmej-ui-button variant="secondary" data-open>Abrir como modal</dgonmej-ui-button></div>${m}`,
    js: () => `document.querySelector('dgonmej-ui-sheet').show();`,
    note: 'Arriba, la vista previa en línea. Como modal, en pantallas de menos de 640px sube desde abajo.',
  },
  {
    id: 'toast',
    name: 'Toast',
    group: 'Avisos y capas',
    tag: 'dgonmej-ui-toast',
    controls: [
      select(
        'placement',
        'Posición',
        [
          opt('top', 'Arriba al centro'),
          opt('top-start', 'Arriba a la izquierda'),
          opt('top-end', 'Arriba a la derecha'),
          opt('bottom', 'Abajo al centro'),
          opt('bottom-start', 'Abajo a la izquierda'),
          opt('bottom-end', 'Abajo a la derecha'),
        ],
        'bottom',
        { defaultValue: 'top' }
      ),
      select('variant', 'Variante', ['info', 'success', 'warning', 'danger'].map((v) => opt(v)), 'success', { attr: false }),
      text('message', 'Mensaje', 'Cambios guardados', { attr: false }),
      seg('duration', 'Duración', [opt('2000', '2 s'), opt('3500', '3,5 s'), opt('0', 'Fija')], '3500', { attr: false }),
    ],
    markup: (s, a) => `<dgonmej-ui-toast${a('placement')}></dgonmej-ui-toast>`,
    stage: (m) => `<div class="center"><dgonmej-ui-button variant="primary" data-open>Mostrar aviso</dgonmej-ui-button></div>${m}`,
    js: (s) =>
      `document.querySelector('dgonmej-ui-toast').show(${JSON.stringify(s.message)}, {\n  variant: '${s.variant}',\n  duration: ${s.duration},\n});`,
    open: (el, s) => el.show(s.message, { variant: s.variant, duration: Number(s.duration) }),
    preview: (el, s) => {
      el._items = [];
      el.show(s.message, { variant: s.variant, duration: Number(s.duration) || 3500 });
    },
  },
  {
    id: 'progress',
    name: 'Progreso',
    group: 'Avisos y capas',
    tag: 'dgonmej-ui-progress',
    block: true,
    controls: [
      select('tone', 'Tono', ['accent', 'success', 'warning', 'danger'].map((v) => opt(v)), 'accent'),
      seg('size', 'Grosor', ['thin', 'regular', 'thick'].map((v) => opt(v)), 'regular'),
      seg('value', 'Valor', [opt('', 'Indet.'), opt('25'), opt('50'), opt('75'), opt('100')], '50', { defaultValue: '' }),
      text('label', 'Etiqueta', 'Subiendo archivo'),
      bool('show-value', 'Mostrar porcentaje', true),
    ],
    frame: 'narrow',
    markup: (s, a) => `<dgonmej-ui-progress${a('label', 'value', 'tone', 'size', 'show-value')}></dgonmej-ui-progress>`,
  },
  {
    id: 'spinner',
    name: 'Spinner',
    group: 'Avisos y capas',
    tag: 'dgonmej-ui-spinner',
    controls: [
      seg('size', 'Tamaño', ['small', 'medium', 'large', 'xlarge'].map((v) => opt(v)), 'large', { defaultValue: 'medium' }),
      seg('tone', 'Tono', ['accent', 'neutral', 'current'].map((v) => opt(v)), 'accent'),
    ],
    markup: (s, a) => `<dgonmej-ui-spinner${a('size', 'tone')}></dgonmej-ui-spinner>`,
  },
  {
    id: 'menu',
    name: 'Menú',
    group: 'Avisos y capas',
    tag: 'dgonmej-ui-menu',
    controls: [
      select('placement', 'Posición', ['bottom-start', 'bottom-end', 'top-start', 'top-end'].map((v) => opt(v)), 'bottom-start'),
      bool('destructive', 'Acción destructiva', true, { rebuild: true, attr: false }),
      bool('icons', 'Con iconos', true, { rebuild: true, attr: false }),
    ],
    data: (s) => ({
      items: [
        { value: 'share', label: 'Compartir', icon: 'share' },
        { value: 'duplicate', label: 'Duplicar', icon: 'plus' },
        { value: 'link', label: 'Copiar enlace', icon: 'link' },
        ...(s.destructive ? [{ separator: true }, { value: 'delete', label: 'Eliminar', icon: 'trash', destructive: true }] : []),
      ].map((i) => (s.icons ? i : { ...i, icon: undefined })),
    }),
    markup: (s, a) =>
      `<dgonmej-ui-menu label="Acciones"${a('placement')}>\n  <dgonmej-ui-button slot="trigger" variant="secondary" icon label="Más opciones">\n    ${ICON_SVG('ellipsis')}\n  </dgonmej-ui-button>\n</dgonmej-ui-menu>`,
    stage: (m) => `<div class="center" style="min-height: 300px">${m}</div>`,
    afterRender: (el) =>
      customElements.whenDefined('dgonmej-ui-menu').then(() => el.updateComplete).then(() => (el.open = true)),
    preview: (el) => (el.open = true),
  },

  // Estructura
  {
    id: 'card',
    name: 'Card',
    group: 'Estructura',
    tag: 'dgonmej-ui-card',
    wantsColor: (s) => s.glass,
    block: true,
    controls: [
      seg('elevation', 'Elevación', ['flat', 'raised', 'floating'].map((v) => opt(v)), 'raised'),
      seg('layout', 'Disposición', ['vertical', 'horizontal'].map((v) => opt(v)), 'vertical'),
      seg('padding', 'Aire', ['compact', 'regular', 'spacious'].map((v) => opt(v)), 'regular'),
      bool('media', 'Imagen', true, { rebuild: true, attr: false }),
      bool('header', 'Cabecera con avatar', true, { rebuild: true, attr: false }),
      bool('footer', 'Pie con acciones', true, { rebuild: true, attr: false }),
      bool('glass', 'Vidrio (usa fondo de color)'),
      bool('interactive', 'Interactiva'),
    ],
    frame: 'card',
    markup: (s, a) => {
      const parts = [];
      if (s.media) parts.push(`  <div slot="media" class="media-art"></div>`);
      if (s.header)
        parts.push(
          `  <div slot="header">\n    <dgonmej-ui-avatar size="sm" name="Ana Pérez" status="online"></dgonmej-ui-avatar>\n    Ana Pérez\n  </div>`
        );
      parts.push(
        `  <p class="sample-title">Viaje a La Palma</p>\n  <p class="sample-text">Rutas, miradores y dónde dormir para un fin de semana largo.</p>`
      );
      if (s.footer)
        parts.push(
          `  <dgonmej-ui-badge slot="footer" variant="success" dot>Publicado</dgonmej-ui-badge>\n  <dgonmej-ui-button slot="footer" size="small" variant="secondary">Editar</dgonmej-ui-button>`
        );
      return `<dgonmej-ui-card${a('elevation', 'layout', 'padding', 'glass', 'interactive')}>\n${parts.join('\n')}\n</dgonmej-ui-card>`;
    },
  },
  {
    id: 'list',
    name: 'Lista',
    group: 'Estructura',
    tag: 'dgonmej-ui-list',
    block: true,
    controls: [
      seg('variant', 'Variante', ['inset', 'plain'].map((v) => opt(v)), 'inset'),
      bool('hide-chevron', 'Ocultar chevron'),
      bool('descriptions', 'Descripciones', true, { rebuild: true, attr: false }),
      bool('empty', 'Vacía', false, { rebuild: true, attr: false }),
    ],
    frame: 'narrow',
    data: (s) => ({ items: s.empty ? [] : listItems(s.descriptions) }),
    markup: (s, a) => `<dgonmej-ui-list${a('variant', 'hide-chevron')}></dgonmej-ui-list>`,
  },
  {
    id: 'table',
    name: 'Tabla',
    group: 'Estructura',
    tag: 'dgonmej-ui-table',
    block: true,
    controls: [
      seg('density', 'Densidad', ['compact', 'regular', 'comfortable'].map((v) => opt(v)), 'regular'),
      bool('striped', 'Filas alternas'),
      bool('empty', 'Vacía', false, { rebuild: true, attr: false }),
    ],
    data: (s) => ({ columns: tableData.columns, rows: s.empty ? [] : tableData.rows }),
    markup: (s, a) => `<dgonmej-ui-table label="Equipo"${a('density', 'striped')}></dgonmej-ui-table>`,
  },
  {
    id: 'carousel',
    name: 'Carrusel',
    group: 'Estructura',
    tag: 'dgonmej-ui-carousel',
    controls: [
      seg('autoplay', 'Autoplay', [opt('0', 'No'), opt('3', '3 s'), opt('5', '5 s')], '0'),
      seg('count', 'Diapositivas', ['2', '3', '5'].map((v) => opt(v)), '3', { rebuild: true, attr: false }),
    ],
    frame: 'card',
    markup: (s, a) =>
      `<dgonmej-ui-carousel label="Destacados"${a('autoplay')}>\n${SLIDES.slice(0, Number(s.count))
        .map(([t, bg]) => `  <div class="slide" style="background: ${bg}">${t}</div>`)
        .join('\n')}\n</dgonmej-ui-carousel>`,
  },
  {
    id: 'timeline',
    name: 'Timeline',
    group: 'Estructura',
    tag: 'dgonmej-ui-timeline',
    block: true,
    controls: [
      seg('layout', 'Lado', [opt('alternate', 'Alterno'), opt('left', 'Izquierda'), opt('right', 'Derecha')], 'alternate'),
      bool('static', 'Sin animación de entrada'),
      bool('current', 'Resaltar actual', true, { rebuild: true, attr: false }),
      bool('milestones', 'Hitos inicio y fin', true, { rebuild: true, attr: false }),
      bool('highlights', 'Etiquetas', true, { rebuild: true, attr: false }),
      bool('links', 'Enlaces', true, { rebuild: true, attr: false }),
    ],
    data: (s) => ({ items: timelineItems(s) }),
    markup: (s, a) => `<dgonmej-ui-timeline label="Trayectoria"${a('layout', 'static')}></dgonmej-ui-timeline>`,
    note: 'En contenedores de menos de 720px el modo alterno pasa a una columna. Prueba el ancho Móvil.',
  },

  // Navegacion
  {
    id: 'nav-bar',
    name: 'Barra de navegación',
    group: 'Navegación',
    tag: 'dgonmej-ui-nav-bar',
    controls: [
      text('heading', 'Título', 'Ajustes'),
      bool('large', 'Título grande', true),
      bool('actions', 'Acciones', true, { rebuild: true, attr: false }),
    ],
    markup: (s, a) =>
      `<dgonmej-ui-nav-bar${a('heading', 'large')} scroll-target="#phone">${
        s.actions
          ? `\n  <dgonmej-ui-button slot="leading" variant="ghost">Atrás</dgonmej-ui-button>\n  <dgonmej-ui-button slot="trailing" variant="ghost">Editar</dgonmej-ui-button>\n`
          : ''
      }</dgonmej-ui-nav-bar>`,
    stage: (m) =>
      phone(`${m}<div class="phone-content">${'<div class="filler"></div>'.repeat(8)}</div>`),
    note: 'Haz scroll dentro del teléfono para ver cómo se recoge el título.',
  },
  {
    id: 'tab-bar',
    name: 'Barra de pestañas',
    group: 'Navegación',
    tag: 'dgonmej-ui-tab-bar',
    controls: [
      seg('count', 'Pestañas', ['3', '4', '5'].map((v) => opt(v)), '4', { rebuild: true, attr: false }),
      bool('icon-only', 'Solo iconos'),
    ],
    data: (s) => ({ items: tabItems(Number(s.count)) }),
    markup: (s, a) => `<dgonmej-ui-tab-bar value="home"${a('icon-only')}></dgonmej-ui-tab-bar>`,
    stage: (m) => phone(`<div class="phone-content" style="padding-top: 4cqw">${'<div class="filler"></div>'.repeat(8)}</div>${m}`),
  },

  // Medios y preferencias
  {
    id: 'audio-player',
    name: 'Reproductor',
    group: 'Medios',
    tag: 'dgonmej-ui-audio-player',
    block: true,
    controls: [
      seg('variant', 'Variante', [opt('card', 'Tarjeta'), opt('compact', 'Compacto')], 'card'),
      bool('live', 'En directo', true),
      bool('artwork', 'Portada', true, { rebuild: true, attr: false }),
      text('heading', 'Título', 'MínimaFM 97.9'),
      text('subheading', 'Subtítulo', 'La voz del valle, tu voz'),
    ],
    frame: 'card',
    markup: (s, a) =>
      `<dgonmej-ui-audio-player${a('heading', 'subheading', 'variant', 'live')}\n  src="https://stream-176.zeno.fm/fjmbxsddqv1uv"${
        s.artwork ? '\n  artwork="https://dgonmej.github.io/minimafm/images/logos/logo-minimafm.png"' : ''
      }\n></dgonmej-ui-audio-player>`,
  },
  {
    id: 'theme-toggle',
    name: 'Selector de tema',
    group: 'Medios',
    tag: 'dgonmej-ui-theme-toggle',
    controls: [
      seg('variant', 'Variante', [opt('segmented', 'Segmentado'), opt('button', 'Botón')], 'segmented'),
      bool('compact', 'Solo iconos'),
    ],
    markup: (s, a) => `<dgonmej-ui-theme-toggle${a('variant', 'compact')}></dgonmej-ui-theme-toggle>`,
    note: 'Cambia el tema de toda la página y se sincroniza con el de la barra superior.',
  },
];

// ---------- Estado ----------
let current = null;
let state = {};
const FRAMES = { narrow: '420px', card: '560px' };

const controlByKey = (key) => current.controls.find((c) => c.key === key);
const defaultOf = (c) => {
  if (c.defaultValue !== undefined) return c.defaultValue;
  if (current.defaults && c.key in current.defaults) return current.defaults[c.key];
  if (c.type === 'boolean') return false;
  if (c.type === 'text') return '';
  return c.value;
};

/** Construye los atributos que difieren del valor por defecto del componente. */
const attrs = (...keys) =>
  keys
    .map((key) => {
      const c = controlByKey(key);
      const v = state[key];
      if (c.type === 'boolean') return v ? ` ${key}` : '';
      if (v === '' || v === defaultOf(c)) return '';
      return ` ${key}="${esc(v)}"`;
    })
    .join('');

const dataFor = (s) => (typeof current.data === 'function' ? current.data(s) : current.data);

// ---------- Render ----------
function renderStage() {
  const markup = current.markup(state, attrs);
  const frame = $('frame');
  frame.style.setProperty('--_frame', $('width').value === 'full' ? FRAMES[current.frame] || '100%' : WIDTHS[$('width').value]);
  const content = current.stage
    ? current.stage(markup, state)
    : current.block
      ? markup
      : `<div class="center">${markup}</div>`;
  frame.innerHTML = content + (current.note ? `<p class="sample-text" style="margin-top: 24px; text-align: center; font-size: 13px">${esc(current.note)}</p>` : '');

  const all = [...frame.querySelectorAll(current.tag)];
  const el = all[all.length - 1];
  const data = dataFor(state);
  if (data) all.forEach((node) => Object.assign(node, data));
  if (current.afterRender) all.forEach((node) => current.afterRender(node, state));

  frame.querySelectorAll('[data-open]').forEach((btn) =>
    btn.addEventListener('ui-click', () => (current.open ? current.open(el, state) : el.show()))
  );
  renderCode();
}

function applyLive(key) {
  const c = controlByKey(key);
  const all = [...$('frame').querySelectorAll(current.tag)];
  if (!all.length || c.rebuild || c.attr === false) renderStage();
  else {
    const v = state[key];
    all.forEach((el) => {
      if (c.live === 'prop') el[key] = v;
      else if (c.type === 'boolean') el.toggleAttribute(key, v);
      else if (v === '') el.removeAttribute(key);
      else el.setAttribute(key, v);
    });
    renderCode();
  }
  // Componentes que solo se ven al abrirse: se muestran al cambiar una opcion
  if (current.preview) {
    clearTimeout(previewTimer);
    previewTimer = setTimeout(() => {
      const nodes = $('frame').querySelectorAll(current.tag);
      current.preview(nodes[nodes.length - 1], state);
    }, 250);
  }
}
let previewTimer;

function renderCode() {
  $('code-html').textContent = current.markup(state, attrs);
  const data = dataFor(state);
  const parts = [];
  if (data) {
    parts.push(
      `const el = document.querySelector('${current.tag}');\n` +
        Object.entries(data)
          .map(([k, v]) => `el.${k} = ${JSON_(v)};`)
          .join('\n')
    );
  }
  if (current.js) parts.push(current.js(state));
  const js = parts.join('\n\n');
  $('code-js').textContent = js;
  $('js-pre').hidden = $('js-head').hidden = !js;
}

// ---------- Controles ----------
function renderControls() {
  const box = $('props');
  box.innerHTML = '';
  current.controls.forEach((c) => {
    const wrap = document.createElement('div');
    wrap.className = 'control';
    const propName = c.attr === false ? '' : ` <code>${c.key}</code>`;

    if (c.type === 'boolean') {
      wrap.className = 'switch-row';
      const sw = document.createElement('dgonmej-ui-switch');
      sw.size = 'small';
      sw.checked = state[c.key];
      sw.innerHTML = `${esc(c.label)}${propName ? ` <span class="prop">${c.key}</span>` : ''}`;
      sw.addEventListener('ui-change', (e) => update(c.key, e.detail.checked));
      wrap.append(sw);
    } else if (c.type === 'text') {
      const tf = document.createElement('dgonmej-ui-text-field');
      tf.size = 'small';
      tf.label = c.label + (c.attr === false ? '' : ` (${c.key})`);
      tf.value = state[c.key];
      tf.addEventListener('ui-input', (e) => update(c.key, e.detail.value));
      wrap.append(tf);
    } else if (c.type === 'select') {
      const sel = document.createElement('dgonmej-ui-select');
      sel.size = 'small';
      sel.label = c.label + (c.attr === false ? '' : ` (${c.key})`);
      sel.options = c.options;
      sel.value = state[c.key];
      sel.addEventListener('ui-change', (e) => update(c.key, e.detail.value));
      wrap.append(sel);
    } else {
      wrap.innerHTML = `<span class="control-label">${esc(c.label)}${propName}</span>`;
      const ctl = document.createElement('dgonmej-ui-segmented-control');
      ctl.size = 'small';
      ctl.label = c.label;
      ctl.options = c.options;
      ctl.value = state[c.key];
      ctl.addEventListener('ui-change', (e) => update(c.key, e.detail.value));
      wrap.append(ctl);
    }
    box.append(wrap);
  });
}

// Valores de ejemplo validos para cada tipo de campo
const SAMPLE_VALUES = {
  text: 'Diego González',
  email: 'diego@dgonmej.dev',
  password: 'contraseña-secreta',
  number: '42',
  search: 'facturas pendientes',
  date: '2026-11-09',
  time: '09:41',
  'datetime-local': '2026-11-09T09:41',
  month: '2026-11',
  week: '2026-W45',
  year: '2026',
};

function update(key, value) {
  state = { ...state, [key]: value };
  if (current.id === 'text-field' && key === 'type') {
    state.value = SAMPLE_VALUES[value] ?? '';
    renderControls();
    renderStage();
    return;
  }
  // El vidrio solo se aprecia sobre contenido con color
  if (current.wantsColor?.(state)) setBackground('color');
  applyLive(key);
}

function setBackground(bg) {
  $('bg').value = bg;
  $('stage').dataset.bg = bg;
}

// ---------- Navegacion entre componentes ----------
function selectComponent(id) {
  current = components.find((c) => c.id === id) || components[0];
  state = Object.fromEntries(current.controls.map((c) => [c.key, c.value]));
  $('component-name').textContent = current.name;
  $('component-tag').textContent = `<${current.tag}>`;
  $('picker').value = current.id;
  $('sidebar')
    .querySelectorAll('button')
    .forEach((b) => b.setAttribute('aria-current', String(b.dataset.id === current.id)));
  renderControls();
  renderStage();
  if (location.hash.slice(1) !== current.id) history.replaceState(null, '', `#${current.id}`);
}

function buildNavigation() {
  const groups = [...new Set(components.map((c) => c.group))];
  $('sidebar').innerHTML = groups
    .map(
      (g) =>
        `<div class="group">${g}</div>` +
        components
          .filter((c) => c.group === g)
          .map(
            (c) =>
              `<button type="button" data-id="${c.id}">${c.name}<code class="tag-name">${c.tag}</code></button>`
          )
          .join('')
    )
    .join('');
  $('sidebar').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-id]');
    if (b) selectComponent(b.dataset.id);
  });
  $('picker').options = components.map((c) => ({ value: c.id, label: `${c.group}: ${c.name} (${c.tag})` }));
  $('picker').addEventListener('ui-change', (e) => selectComponent(e.detail.value));
}

// ---------- Escenario ----------
const WIDTHS = { mobile: '375px', tablet: '768px' };

function buildStageTools() {
  $('bg').options = [opt('plain', 'Liso'), opt('color', 'Color')];
  $('bg').addEventListener('ui-change', (e) => ($('stage').dataset.bg = e.detail.value));
  $('width').options = [opt('mobile', 'Móvil'), opt('tablet', 'Tablet'), opt('full', 'Libre')];
  $('width').addEventListener('ui-change', () => {
    const w = $('width').value;
    $('frame').style.setProperty('--_frame', w === 'full' ? FRAMES[current.frame] || '100%' : WIDTHS[w]);
  });
}

// ---------- Tema global ----------
const ACCENTS = {
  azul: { name: 'Azul', top: '#0071e3', bot: '#005bbf', text: '#0066cc', dark: '#0a84ff', rgb: '0 113 227' },
  indigo: { name: 'Índigo', top: '#5856d6', bot: '#3f3db8', text: '#4b49c9', dark: '#9d9bff', rgb: '88 86 214' },
  verde: { name: 'Verde', top: '#1d7a3a', bot: '#135c2a', text: '#1a7030', dark: '#30d158', rgb: '29 122 58' },
  naranja: { name: 'Naranja', top: '#b84a00', bot: '#8f3800', text: '#9a4a00', dark: '#ffa340', rgb: '184 74 0' },
  rosa: { name: 'Rosa', top: '#cc1f5a', bot: '#a3134a', text: '#bf1d55', dark: '#ff6b9a', rgb: '204 31 90' },
  grafito: { name: 'Grafito', top: '#48484a', bot: '#2c2c2e', text: '#3a3a3c', dark: '#d1d1d6', rgb: '72 72 74' },
};
/*
 * Un solo control de redondez que mueve todos los tokens de forma a la vez:
 * superficies (sm/md/lg), controles (cápsula o no) y la escala proporcional
 * (avatar redondeado, spinner). 'normal' son los valores por defecto de tokens.css.
 */
const ROUNDNESS = {
  square: { sm: 3, md: 5, lg: 8, control: '2px', scale: 0.35 },
  soft: { sm: 6, md: 10, lg: 16, control: 'var(--ui-radius-md)', scale: 0.7 },
  normal: null,
  round: { sm: 9, md: 15, lg: 24, control: null, scale: 1.5 },
};
const theme = { accent: 'azul', roundness: 'normal' };

function themeCss() {
  const a = theme.accent === 'azul' ? null : ACCENTS[theme.accent];
  const r = ROUNDNESS[theme.roundness];
  if (!a && !r) return '';
  const light = [];
  const dark = [];
  if (a) {
    light.push(
      `--ui-color-primary: ${a.text};`,
      `--ui-color-primary-hover: ${a.bot};`,
      `--ui-color-primary-text: ${a.text};`,
      `--ui-color-primary-tint: rgb(${a.rgb} / 0.12);`,
      `--ui-color-primary-glow: rgb(${a.rgb} / 0.4);`,
      `--ui-color-focus: ${a.top};`,
      `--ui-gradient-primary: linear-gradient(180deg, ${a.top} 0%, ${a.bot} 100%);`
    );
    dark.push(
      `--ui-color-primary: ${a.dark};`,
      `--ui-color-primary-text: ${a.dark};`,
      `--ui-color-primary-tint: rgb(${a.rgb} / 0.24);`,
      `--ui-color-focus: ${a.dark};`
    );
  }
  if (r) {
    light.push(
      `--ui-radius-sm: ${r.sm}px;`,
      `--ui-radius-md: ${r.md}px;`,
      `--ui-radius-lg: ${r.lg}px;`,
      `--ui-radius-scale: ${r.scale};`
    );
    if (r.control) light.push(`--ui-radius-control: ${r.control};`);
  }
  const block = (sel, lines, indent = '') =>
    `${indent}${sel} {\n${lines.map((l) => `${indent}  ${l}`).join('\n')}\n${indent}}`;
  let css = block(':root', light);
  if (dark.length) {
    css += `\n\n${block('[data-theme="dark"]', dark)}`;
    css += `\n\n@media (prefers-color-scheme: dark) {\n${block(':root:not([data-theme="light"])', dark, '  ')}\n}`;
  }
  return css;
}

function applyTheme() {
  const css = themeCss();
  let style = document.getElementById('pg-theme');
  if (!style) {
    style = document.createElement('style');
    style.id = 'pg-theme';
    document.head.append(style);
  }
  style.textContent = css;
  $('code-css').textContent = css || '/* Tokens por defecto: no hace falta CSS extra */';
  $('swatches')
    .querySelectorAll('.swatch')
    .forEach((s) => s.setAttribute('aria-pressed', String(s.dataset.accent === theme.accent)));
}

function buildTheme() {
  $('swatches').innerHTML = Object.entries(ACCENTS)
    .map(
      ([id, a]) =>
        `<button type="button" class="swatch" data-accent="${id}" aria-label="${a.name}" title="${a.name}"
          style="--_swatch: linear-gradient(180deg, ${a.top}, ${a.bot})"></button>`
    )
    .join('');
  $('swatches').addEventListener('click', (e) => {
    const s = e.target.closest('.swatch');
    if (!s) return;
    theme.accent = s.dataset.accent;
    applyTheme();
  });
  $('roundness').options = [opt('square', 'Recta'), opt('soft', 'Suave'), opt('normal', 'Normal'), opt('round', 'Redonda')];
  $('roundness').addEventListener('ui-change', (e) => {
    theme.roundness = e.detail.value;
    applyTheme();
  });
  applyTheme();
}

// ---------- Copiar ----------
document.querySelectorAll('[data-copy]').forEach((btn) =>
  btn.addEventListener('ui-click', async () => {
    try {
      await navigator.clipboard.writeText($(btn.dataset.copy).textContent);
      $('toast').show('Código copiado', { variant: 'success', duration: 2000 });
    } catch {
      $('toast').show('No se ha podido copiar. Selecciona el texto a mano', { variant: 'warning' });
    }
  })
);

$('back').addEventListener('ui-click', () => (location.href = './'));

// ---------- Inicio ----------
await customElements.whenDefined('dgonmej-ui-segmented-control');
buildNavigation();
buildStageTools();
buildTheme();
selectComponent(location.hash.slice(1));
window.addEventListener('hashchange', () => selectComponent(location.hash.slice(1)));
