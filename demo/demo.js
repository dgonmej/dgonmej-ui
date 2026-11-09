/*
 * Portada de la demo: galeria de componentes por categorias (con vista previa en vivo y
 * enlace a su pagina del playground) y ejemplos completos.
 * Los ids coinciden con los del playground (playground.html#<id>).
 */

const $ = (id) => document.getElementById(id);

const CATALOG = [
  {
    id: 'base',
    name: 'Base',
    items: [
      {
        id: 'button',
        name: 'Botón',
        desc: 'Cinco variantes, tres tamaños, solo icono y ancho completo.',
        preview: `<dgonmej-ui-button>Guardar</dgonmej-ui-button><dgonmej-ui-button variant="secondary">Duplicar</dgonmej-ui-button>`,
      },
      {
        id: 'badge',
        name: 'Badge',
        desc: 'Estados tintados con punto opcional.',
        preview: `<dgonmej-ui-badge variant="success" dot>Pagada</dgonmej-ui-badge><dgonmej-ui-badge variant="warning" dot>Pendiente</dgonmej-ui-badge><dgonmej-ui-badge variant="accent">Nueva</dgonmej-ui-badge>`,
      },
      {
        id: 'avatar',
        name: 'Avatar',
        desc: 'Foto o iniciales sobre gradiente, estado y aro de acento.',
        preview: `<dgonmej-ui-avatar size="lg" ring name="Diego González" src="https://dgonmej.github.io/whoami/images/main_profile_mobile.jpg"></dgonmej-ui-avatar><dgonmej-ui-avatar size="lg" name="Ana Pérez" status="online"></dgonmej-ui-avatar><dgonmej-ui-avatar size="lg" shape="rounded" name="Luis Martín"></dgonmej-ui-avatar>`,
      },
      {
        id: 'icon',
        name: 'Icono',
        desc: 'Iconos de línea de Lucide que heredan el color del texto.',
        preview: ['house', 'search', 'calendar', 'music', 'rocket', 'bell', 'share', 'star']
          .map((n) => `<dgonmej-ui-icon name="${n}" size="24"></dgonmej-ui-icon>`)
          .join(''),
      },
    ],
  },
  {
    id: 'formularios',
    name: 'Formularios',
    items: [
      {
        id: 'text-field',
        name: 'Campo de texto',
        desc: 'Iconos por tipo: búsqueda, fechas, horas, año y contraseña.',
        block: true,
        preview: `<dgonmej-ui-text-field type="search" placeholder="Buscar facturas"></dgonmej-ui-text-field>`,
      },
      {
        id: 'textarea',
        name: 'Área de texto',
        desc: 'Crece con el contenido y cuenta caracteres.',
        block: true,
        preview: `<dgonmej-ui-textarea rows="2" maxlength="140" autoresize placeholder="Escribe un mensaje"></dgonmej-ui-textarea>`,
      },
      {
        id: 'select',
        name: 'Select',
        desc: 'Desplegable nativo con estilo propio; en móvil abre el del sistema.',
        block: true,
        preview: `<dgonmej-ui-select data-options="countries" placeholder="Elige un país"></dgonmej-ui-select>`,
      },
      {
        id: 'switch',
        name: 'Switch',
        desc: 'Interruptor estilo iOS, en dos tamaños.',
        preview: `<dgonmej-ui-switch checked>Wi-Fi</dgonmej-ui-switch>`,
      },
      {
        id: 'checkbox',
        name: 'Checkbox',
        desc: 'Casilla accesible con animación de marcado.',
        preview: `<dgonmej-ui-checkbox checked>Recordarme</dgonmej-ui-checkbox>`,
      },
      {
        id: 'radio-group',
        name: 'Grupo de radios',
        desc: 'Opciones con descripción y teclado.',
        block: true,
        preview: `<dgonmej-ui-radio-group data-options="plans-mini" value="pro"></dgonmej-ui-radio-group>`,
      },
      {
        id: 'segmented-control',
        name: 'Control segmentado',
        desc: 'Indicador que se desliza; neutro o relleno de acento.',
        preview: `<dgonmej-ui-segmented-control data-options="periods" value="week" label="Periodo"></dgonmej-ui-segmented-control>`,
      },
    ],
  },
  {
    id: 'capas',
    name: 'Avisos y capas',
    items: [
      {
        id: 'dialog',
        name: 'Diálogo',
        desc: 'Modal nativo con foco atrapado y fondo difuminado.',
        preview: `<dgonmej-ui-button variant="danger" data-open="dialog">Eliminar factura</dgonmej-ui-button>`,
      },
      {
        id: 'sheet',
        name: 'Sheet',
        desc: 'Hoja que sube desde abajo en móvil y se cierra arrastrando.',
        preview: `<dgonmej-ui-button variant="secondary" data-open="sheet">Abrir filtros</dgonmej-ui-button>`,
      },
      {
        id: 'toast',
        name: 'Toast',
        desc: 'Avisos de vidrio en seis posiciones.',
        preview: `<dgonmej-ui-button variant="secondary" data-toast>Mostrar aviso</dgonmej-ui-button>`,
      },
      {
        id: 'progress',
        name: 'Progreso',
        desc: 'Determinado o indeterminado, con tonos y grosores.',
        block: true,
        preview: `<dgonmej-ui-progress id="mini-progress" label="Subiendo" value="35" show-value></dgonmej-ui-progress>`,
      },
      {
        id: 'spinner',
        name: 'Spinner',
        desc: 'Estela de acento cuya forma sigue la redondez global.',
        preview: `<dgonmej-ui-spinner size="small"></dgonmej-ui-spinner><dgonmej-ui-spinner></dgonmej-ui-spinner><dgonmej-ui-spinner size="large"></dgonmej-ui-spinner>`,
      },
      {
        id: 'menu',
        name: 'Menú',
        desc: 'Menú contextual de vidrio con teclado.',
        preview: `<dgonmej-ui-menu data-items="actions" label="Acciones"><dgonmej-ui-button slot="trigger" variant="secondary" icon label="Más opciones"><dgonmej-ui-icon name="ellipsis"></dgonmej-ui-icon></dgonmej-ui-button></dgonmej-ui-menu>`,
      },
    ],
  },
  {
    id: 'estructura',
    name: 'Estructura',
    items: [
      {
        id: 'card',
        name: 'Card',
        desc: 'Imagen, cabecera y pie opcionales; elevación, vidrio y disposición.',
        block: true,
        preview: `<dgonmej-ui-card class="mini-card" padding="compact" style="justify-self: center"><dgonmej-ui-avatar slot="header" size="sm" name="Ana Pérez"></dgonmej-ui-avatar><span slot="header">Ana Pérez</span><p class="mini-title">Viaje a La Palma</p><p class="mini-text">Rutas y miradores</p></dgonmej-ui-card>`,
      },
      {
        id: 'list',
        name: 'Lista',
        desc: 'Filas agrupadas estilo Ajustes de iOS.',
        block: true,
        preview: `<dgonmej-ui-list data-items="invoices"></dgonmej-ui-list>`,
      },
      {
        id: 'table',
        name: 'Tabla',
        desc: 'Densidad, filas alternas y scroll horizontal en móvil.',
        block: true,
        preview: `<dgonmej-ui-table data-table label="Equipo" density="compact"></dgonmej-ui-table>`,
      },
      {
        id: 'carousel',
        name: 'Carrusel',
        desc: 'Deslizar, teclado, autoplay con pausa.',
        block: true,
        preview: `<dgonmej-ui-carousel label="Destacados"><div class="slide small slide-1">Océano</div><div class="slide small slide-2">Atardecer</div><div class="slide small slide-3">Bosque</div></dgonmej-ui-carousel>`,
      },
      {
        id: 'timeline',
        name: 'Timeline',
        desc: 'Trayectoria alterna o a un lado, con hitos.',
        block: true,
        preview: `<dgonmej-ui-timeline data-items="mini-timeline" layout="right" static></dgonmej-ui-timeline>`,
      },
    ],
  },
  {
    id: 'navegacion',
    name: 'Navegación',
    items: [
      {
        id: 'nav-bar',
        name: 'Barra de navegación',
        desc: 'Título grande que se recoge y pasa a vidrio al hacer scroll.',
        preview: `<div class="mini-nav"><dgonmej-ui-nav-bar heading="Ajustes"><dgonmej-ui-button slot="trailing" variant="ghost" size="small">Editar</dgonmej-ui-button></dgonmej-ui-nav-bar><div class="lines"><span></span><span></span><span style="width: 60%"></span></div></div>`,
      },
      {
        id: 'tab-bar',
        name: 'Barra de pestañas',
        desc: 'Barra flotante de vidrio con resaltado deslizante.',
        color: true,
        preview: `<dgonmej-ui-tab-bar data-items="tabs" value="home"></dgonmej-ui-tab-bar>`,
      },
    ],
  },
  {
    id: 'medios',
    name: 'Medios y preferencias',
    items: [
      {
        id: 'audio-player',
        name: 'Reproductor',
        desc: 'Radio en directo o pistas; tarjeta o mini reproductor.',
        block: true,
        preview: `<dgonmej-ui-audio-player variant="compact" live heading="MínimaFM 97.9" subheading="La voz del valle" src="https://stream-176.zeno.fm/fjmbxsddqv1uv" artwork="https://dgonmej.github.io/minimafm/images/logos/logo-minimafm.png"></dgonmej-ui-audio-player>`,
      },
      {
        id: 'theme-toggle',
        name: 'Selector de tema',
        desc: 'Sistema, claro u oscuro; se recuerda entre visitas.',
        preview: `<dgonmej-ui-theme-toggle></dgonmej-ui-theme-toggle>`,
      },
    ],
  },
];

// ---------- Datos de ejemplo ----------
const DATA = {
  countries: [
    { value: 'es', label: 'España' },
    { value: 'pt', label: 'Portugal' },
    { value: 'it', label: 'Italia' },
    { value: 'fr', label: 'Francia' },
  ],
  plans: [
    { value: 'free', label: 'Gratis', description: 'Hasta 3 facturas al mes' },
    { value: 'pro', label: 'Pro', description: 'Facturas ilimitadas y recordatorios' },
  ],
  'plans-mini': [
    { value: 'free', label: 'Gratis' },
    { value: 'pro', label: 'Pro' },
  ],
  periods: [
    { value: 'day', label: 'Día' },
    { value: 'week', label: 'Semana' },
    { value: 'month', label: 'Mes' },
  ],
  actions: [
    { value: 'share', label: 'Compartir', icon: 'share' },
    { value: 'duplicate', label: 'Duplicar', icon: 'plus' },
    { separator: true },
    { value: 'delete', label: 'Eliminar', icon: 'trash', destructive: true },
  ],
  invoices: [
    { id: 1, label: 'Factura #001', description: 'Vence el 20/09' },
    { id: 2, label: 'Factura #002', description: 'Pagada' },
  ],
  tabs: [
    { value: 'home', label: 'Inicio', icon: 'house' },
    { value: 'search', label: 'Buscar', icon: 'search' },
    { value: 'radio', label: 'Radio', icon: 'radio' },
  ],
  'mini-timeline': [
    { kind: 'education', period: '2016 – 2018', title: 'Desarrollo de Aplicaciones Web' },
    { kind: 'work', period: '2021', title: 'TECH Education', current: true },
  ],
};

// ---------- Galeria ----------
function buildGallery() {
  const total = CATALOG.reduce((n, g) => n + g.items.length, 0);
  $('count').textContent = total;

  $('componentes').innerHTML = CATALOG.map(
    (group) => `
      <section id="${group.id}" aria-labelledby="${group.id}-title">
        <div class="section-head">
          <h2 id="${group.id}-title">${group.name}</h2>
          <p>${group.items.length} componentes</p>
        </div>
        <div class="gallery">
          ${group.items
            .map(
              (c) => `
            <article class="tile" aria-labelledby="tile-${c.id}">
              <div class="preview${c.block ? ' block' : ''}${c.color ? ' color' : ''}">${c.preview}</div>
              <div class="tile-body">
                <h3 id="tile-${c.id}">${c.name}</h3>
                <code class="tag-name">&lt;dgonmej-ui-${c.id}&gt;</code>
                <p>${c.desc}</p>
                <a class="tile-link" href="./playground.html#${c.id}" aria-label="Probar ${c.name} en el playground">
                  Probar en el playground<dgonmej-ui-icon name="chevron-right" size="16"></dgonmej-ui-icon>
                </a>
              </div>
            </article>`
            )
            .join('')}
        </div>
      </section>`
  ).join('');

  // Datos de las vistas previas
  document.querySelectorAll('[data-options]').forEach((el) => (el.options = DATA[el.dataset.options]));
  document.querySelectorAll('[data-items]').forEach((el) => (el.items = DATA[el.dataset.items]));
  document.querySelectorAll('[data-table]').forEach((el) => {
    el.columns = [
      { key: 'name', header: 'Nombre' },
      { key: 'tasks', header: 'Tareas', align: 'end' },
    ];
    el.rows = [
      { name: 'Ana', tasks: 12 },
      { name: 'Luis', tasks: 7 },
    ];
  });
  document.querySelectorAll('[data-open]').forEach((btn) =>
    btn.addEventListener('ui-click', () => $(btn.dataset.open).show())
  );
  document.querySelectorAll('[data-toast]').forEach((btn) =>
    btn.addEventListener('ui-click', () => $('toast').show('Cambios guardados', { variant: 'success' }))
  );
}

// ---------- Indice ----------
function buildToc() {
  $('toc').innerHTML =
    CATALOG.map(
      (g) => `<li><a href="#${g.id}">${g.name} <span class="count">${g.items.length}</span></a></li>`
    ).join('') +
    `<li><a href="#ejemplos">Ejemplos completos</a></li>` +
    `<li><a class="accent" href="./playground.html"><dgonmej-ui-icon name="sliders" size="16"></dgonmej-ui-icon>Playground</a></li>`;
}

// ---------- Ejemplos completos ----------
function buildExamples() {
  $('hero-seg').options = DATA.periods;
  $('country').options = DATA.countries;
  $('billing').options = [
    { value: 'monthly', label: 'Mensual' },
    { value: 'yearly', label: 'Anual' },
  ];
  $('plan').options = [
    ...DATA.plans,
    { value: 'team', label: 'Equipo', description: 'Varios usuarios y permisos', disabled: true },
  ];

  $('email').addEventListener('ui-change', (e) => {
    const ok = !e.detail.value || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e.detail.value);
    $('email').error = ok ? '' : 'Revisa el correo: falta la @ o el dominio';
  });
  $('submit').addEventListener('ui-click', () => $('toast').show('Cuenta creada', { variant: 'success' }));
  $('reset').addEventListener('ui-click', () => $('form').reset());
  $('dialog').addEventListener('ui-close', (e) => {
    if (e.detail.returnValue === 'confirm') $('toast').show('Factura eliminada', { variant: 'danger' });
  });

  $('phone-list-1').items = [
    { id: 'wifi', label: 'Wi-Fi', description: 'Casa' },
    { id: 'bt', label: 'Bluetooth', description: 'Activado' },
  ];
  $('phone-list-2').items = [
    { id: 'info', label: 'Información' },
    { id: 'update', label: 'Actualización de software' },
    { id: 'storage', label: 'Almacenamiento' },
    { id: 'lang', label: 'Idioma y región' },
  ];
  $('phone-list-3').items = [
    { id: 'location', label: 'Localización' },
    { id: 'tracking', label: 'Rastreo' },
    { id: 'camera', label: 'Cámara' },
    { id: 'mic', label: 'Micrófono' },
  ];
  $('tabs').items = [...DATA.tabs, { value: 'settings', label: 'Ajustes', icon: 'sliders' }];

  // Trayectoria (datos de whoami)
  $('life').items = [
    { milestone: true, kind: 'start', title: 'Mi trayectoria', description: 'Empieza el viaje' },
    {
      kind: 'education',
      period: '2013 – 2015',
      title: 'Sistemas Microinformáticos y Redes',
      description: 'Ciclo de grado medio: instalar, configurar y mantener sistemas y redes locales.',
      highlights: ['DNS y DHCP', 'Windows Server', 'Linux', 'Scripting'],
    },
    {
      kind: 'work',
      period: '2015',
      title: 'Prácticas en Inerza',
      description: 'Prácticas en empresa del ciclo formativo.',
      highlights: ['Asistencia técnica', 'Mantenimiento de hardware'],
    },
    {
      kind: 'travel',
      period: '2015',
      title: 'Erasmus+ en Italia',
      description: 'Beca Erasmus+ para parte de las prácticas en Vegan Solutions S.R.L.',
      highlights: ['Asistencia técnica', 'Diseño de componentes web', 'Testing'],
    },
    {
      kind: 'education',
      period: '2016 – 2018',
      title: 'Desarrollo de Aplicaciones Web',
      description: 'Ciclo de grado superior centrado en diseñar, desarrollar y mantener sitios web.',
      highlights: ['Bases de datos', 'Maquetación', 'Java, C#, .NET y PHP', 'JavaScript y React'],
    },
    {
      kind: 'work',
      period: '2018 – 2020',
      title: 'Desarrollador en Open Data Security',
      description: 'Proyectos de ciberseguridad con Kanban y Scrum.',
      highlights: ['Backend', 'App móvil', 'Frontend', 'Pasarelas de pago', 'Despliegue'],
      links: [
        { label: 'secureaccess.com', href: 'https://secureaccess.com' },
        { label: 'metacleaner.com', href: 'https://metacleaner.com' },
      ],
    },
    {
      kind: 'work',
      period: '2020 – 2021',
      title: 'Desarrollador en Transformación Digital',
      description: 'Proyectos de marketing, gestión y aplicaciones móviles para empresas.',
      highlights: ['Backend', 'App móvil', 'Frontend', 'Documentación'],
    },
    {
      kind: 'work',
      period: '2021',
      current: true,
      title: 'TECH Education Rights & Technologies',
      description:
        'Responsable del frontend de la intranet con Angular (v12–v17) y una librería privada de web components. Formación interna y onboarding del equipo.',
      highlights: ['Angular', 'Web components', '.NET APIs', 'Liderazgo técnico'],
    },
    { milestone: true, kind: 'end', title: 'Y esto no acaba aquí', description: 'Continuará…' },
  ];
}

// ---------- Navegacion ----------
// Los botones con data-href llevan a otra pagina o a una seccion
document.addEventListener('ui-click', (e) => {
  const href = e.target.closest?.('[data-href]')?.dataset.href;
  if (href) location.href = href;
});
$('nav-playground').addEventListener('ui-click', () => (location.href = './playground.html'));

// La barra de progreso de la galeria avanza sola
setInterval(() => {
  const p = $('mini-progress');
  if (p) p.value = p.value >= 100 ? 0 : p.value + 5;
}, 600);

buildToc();
buildGallery();
buildExamples();
