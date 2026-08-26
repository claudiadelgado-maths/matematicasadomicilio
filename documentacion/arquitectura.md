# Arquitectura

## Áreas públicas

| Área | Ruta | Responsabilidad |
|---|---|---|
| Sitio general | `/`, `/nosotros/`, `/contacto/`, `/legal/` | Identidad, servicio e información institucional |
| Biblioteca | `/biblioteca/` | Catálogo público de temas, calculadoras y exámenes |
| Tema | `/biblioteca/temas/[tema]/` | Agrupa componentes de un mismo conocimiento |
| Salones | `/asesores/` | Asesores y acceso a los casilleros de cada salón |
| Salón del asesor | `/asesores/[asesor]/` | Información, ubicación, disponibilidad, precios, metodología y casilleros |
| Casillero | `/asesores/[asesor]/[alumno]/` | Perfil operativo y listado de sesiones dentro de su salón |
| Sesión | `/asesores/[asesor]/[alumno]/[sesion]/` | Contenido personalizado de una sesión |

## Unidad de aislamiento

La unidad mínima que puede entregarse a otra IA es una carpeta concreta con `index.html`, su `estilos.css`, `README.md` y metadatos. Si tiene comportamiento propio, incluye también su JavaScript; si usa fotografías, ilustraciones u otros archivos exclusivos, los conserva en un `recursos/` local. No se crean scripts vacíos.

Los componentes de un tema permanecen bajo la carpeta del tema. Los componentes personalizados permanecen bajo la sesión del usuario. Las colecciones globales enlazan esos módulos, pero no duplican su implementación.

## Relación académica

La fuente de verdad está distribuida junto a cada módulo:

```text
maestro.json ← usuario.json ← sesion.json
      id          maestro       usuario + fecha + estado
```

`npm run catalogo` relaciona los metadatos y genera `recursos/datos/academia.json`. La interfaz muestra únicamente asesores y alumnos activos y sesiones publicadas. Cada asesor se representa públicamente como un salón; `maestro.json` continúa siendo el nombre técnico interno. No se mantienen listas manuales de alumnos ni sesiones.

Los estados `plantilla`, `borrador`, `archivado` e `inactivo` quedan fuera de los índices públicos. La presencia física de una carpeta no implica su publicación.

## Dependencias

```text
recursos/css/base.css ───── base visual realmente común
recursos/js/navegacion.js ─ menú común
recursos/svg/ ────────────── identidad general

carpeta/index.html ───────── carpeta/estilos.css
                      └───── carpeta/script.js, solo si hace falta
academia.json ────────────── scripts locales de catálogos académicos
```

`base.css` contiene únicamente la base que todas las páginas necesitan. El diseño de portada, secciones institucionales, catálogos, perfiles, alumnos, sesiones y componentes se encuentra en el `estilos.css` de cada página. `navegacion.js` controla solamente comportamiento compartido, como el menú.

La repetición razonable entre carpetas independientes es intencional: permite copiar un asesor completo sin depender de una hoja global que contenga reglas de otros asesores. Un recurso solo asciende a `recursos/` cuando es verdaderamente común a todo el sitio.

## Rutas

- Las rutas canónicas son minúsculas, sin espacios ni acentos.
- Cada página pública canónica es un directorio con `index.html`.
- Las referencias son relativas para funcionar en un dominio propio o en un subdirectorio de GitHub Pages.
- Las páginas `.html` de la raíz son compatibilidad heredada; no se enlazan desde la navegación nueva.
- Un componente siempre permite volver a su tema o sesión mediante migas de pan.

## Componentes opcionales

No se crean carpetas ni tarjetas vacías. `tema.json` y `sesion.json` indican exactamente qué existe. Al añadir o retirar un componente se actualizan en conjunto:

1. el módulo;
2. sus metadatos;
3. el índice del tema o sesión;
4. los datos generados mediante `npm run catalogo`.

## Árbol actual resumido

```text
biblioteca/
├── temas/
│   ├── operaciones-con-fracciones/
│   └── ley-de-los-signos/
├── calculadoras/
└── examenes/
    └── simulador-admision-universidad/

asesores/
├── index.html
├── estilos.css
├── erik/
│   ├── maestro.json
│   ├── index.html
│   ├── estilos.css
│   ├── script.js
│   ├── recursos/
│   ├── alejandrina/
│   │   ├── usuario.json
│   │   ├── index.html
│   │   ├── estilos.css
│   │   ├── script.js
│   │   ├── datos-no-agrupados/
│   │   ├── diagramas-de-arboles/
│   │   ├── medidas-de-posicion/
│   │   ├── multiplicacion-de-binomios/
│   │   └── sucesiones-aritmeticas/
│   ├── andres/
│   │   └── porcentajes/
│   └── kenia/
│       └── despejes-lineales/
├── claudia/
│   └── luca/
│       ├── consigue-el-cambio/
│       ├── cuanto-mide-cuanto-pesa/
│       └── las-horas/
└── rainer/
    ├── sofia/
    │   ├── espacios-topologicos/
    │   └── interior-clausura-frontera/
    └── mateo/
        └── continuidad-topologica/

plantillas/
├── maestro/
├── alumno/
│   └── nueva-sesion/
└── sesion/README.md
```

## Archivos reemplazados

Las antiguas páginas `.html` de la raíz son compatibilidad heredada cuando todavía existen; el contenido real vive en sus carpetas modulares.

Los antiguos `assets/css/styles.css`, `assets/js/*.js`, `assets/img/*`, `admin.jpg` y `Simulador.pdf` fueron reemplazados por una base global mínima o por archivos dentro del módulo que los utiliza.
