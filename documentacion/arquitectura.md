# Arquitectura

## Áreas públicas

| Área | Ruta | Responsabilidad |
|---|---|---|
| Sitio general | `/`, `/nosotros/`, `/contacto/`, `/legal/` | Identidad, servicio e información institucional |
| Biblioteca | `/biblioteca/` | Catálogo público de temas, calculadoras y exámenes |
| Tema | `/biblioteca/temas/[tema]/` | Agrupa componentes de un mismo conocimiento |
| Salones | `/usuarios/` | Asesores y acceso a los casilleros de cada salón |
| Salón del asesor | `/[asesor]/` | Información, ubicación, disponibilidad, precios, metodología y casilleros |
| Casillero | `/[asesor]/[alumno]/` | Perfil operativo y listado de sesiones dentro de su salón |
| Sesión | `/[asesor]/[alumno]/[sesion]/` | Contenido personalizado de una sesión |

## Unidad de aislamiento

La unidad mínima que puede entregarse a otra IA es una carpeta concreta con `index.html`, `README.md` y metadatos. Un componente interactivo incluye también su `script.js`; un estilo particular vive en `estilos.css`.

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
sistema-visual.css ─┬─ sitio general
                    ├─ biblioteca y temas
modulos.css ────────┤
navegacion.js ──────┴─ usuarios y sesiones
academia.css/js ────── maestros, casilleros, sesiones y precios

módulo/index.html ── estilos.css y script.js locales
```

`sistema-visual.css` conserva la identidad y los componentes históricos. `modulos.css` contiene catálogos, tarjetas, migas de pan y cabeceras modulares. `navegacion.js` controla solamente comportamiento compartido, como el menú.

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

usuarios/
└── index.html

erik/
├── maestro.json
├── jose/
├── alejandrina/
│   ├── datos-no-agrupados/
│   ├── diagramas-de-arboles/
│   └── medidas-de-posicion/
├── andres/
│   └── porcentajes/
└── kenia/
    └── despejes-lineales/

claudia/
└── luca/
    ├── consigue-el-cambio/
    ├── cuanto-mide-cuanto-pesa/
    └── las-horas/

rainer/
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

Las antiguas páginas `biblioteca.html`, `temas.html`, `ejercicios.html`, `juegos.html`, `calculadoras.html`, `examen.html`, `usuarios.html`, `jose.html`, `alejandrina.html`, `datos-no-agrupados.html`, `nosotros.html`, `contacto.html` y las páginas legales ahora son redirecciones. Su contenido real fue distribuido en módulos.

Los antiguos `assets/css/styles.css`, `assets/js/*.js`, `assets/img/*`, `admin.jpg` y `Simulador.pdf` fueron reemplazados por archivos bajo `recursos/` o dentro del módulo que los utiliza.
