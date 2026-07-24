# Arquitectura

## Áreas públicas

| Área | Ruta | Responsabilidad |
|---|---|---|
| Sitio general | `/`, `/nosotros/`, `/contacto/`, `/legal/` | Identidad, servicio e información institucional |
| Biblioteca | `/biblioteca/` | Catálogo público de temas, calculadoras y exámenes |
| Tema | `/biblioteca/temas/[tema]/` | Agrupa componentes de un mismo conocimiento |
| Usuarios | `/usuarios/` | Acceso a espacios de alumnos |
| Usuario | `/usuarios/[usuario]/` | Perfil operativo y listado de sesiones |
| Sesión | `/usuarios/[usuario]/sesiones/[sesion]/` | Contenido personalizado de una sesión |

## Unidad de aislamiento

La unidad mínima que puede entregarse a otra IA es una carpeta concreta con `index.html`, `README.md` y metadatos. Un componente interactivo incluye también su `script.js`; un estilo particular vive en `estilos.css`.

Los componentes de un tema permanecen bajo la carpeta del tema. Los componentes personalizados permanecen bajo la sesión del usuario. Las colecciones globales enlazan esos módulos, pero no duplican su implementación.

## Dependencias

```text
sistema-visual.css ─┬─ sitio general
                    ├─ biblioteca y temas
modulos.css ────────┤
navegacion.js ──────┴─ usuarios y sesiones

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
4. el catálogo global mediante `npm run catalogo`.

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
├── jose/
└── alejandrina/
    └── sesiones/
        └── datos-no-agrupados/
```

## Archivos reemplazados

Las antiguas páginas `biblioteca.html`, `temas.html`, `ejercicios.html`, `juegos.html`, `calculadoras.html`, `examen.html`, `usuarios.html`, `jose.html`, `alejandrina.html`, `datos-no-agrupados.html`, `nosotros.html`, `contacto.html` y las páginas legales ahora son redirecciones. Su contenido real fue distribuido en módulos.

Los antiguos `assets/css/styles.css`, `assets/js/*.js`, `assets/img/*`, `admin.jpg` y `Simulador.pdf` fueron reemplazados por archivos bajo `recursos/` o dentro del módulo que los utiliza.
