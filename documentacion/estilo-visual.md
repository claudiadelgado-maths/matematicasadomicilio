# Sistema visual

## Identidad

La marca utiliza blanco, negro y grises cálidos; es minimalista, tipográfica y de alto contraste. El color crema se llama `color-surface` y su valor es `#f3f3f0`.

Variables principales en `recursos/css/sistema-visual.css`:

| Variable | Valor | Uso |
|---|---|---|
| `--color-background` | `#ffffff` | fondo principal |
| `--color-text` | `#11110f` | texto y trazos |
| `--color-muted` | `#62625d` | texto secundario |
| `--color-surface` | `#f3f3f0` | secciones crema |
| `--color-border` | `#d8d8d2` | separadores |
| `--color-dark` | `#0b0b0a` | superficies negras |
| `--font-sans` | Inter/Montserrat/sistema | tipografía |
| `--max-width` | `1180px` | ancho de contenido |

## Reglas

- El espacio en blanco, la alineación y la tipografía separan contenidos.
- No añadir sombras, degradados, adornos o colores sin una necesidad educativa.
- Los iconos son SVG `outline`, negros, sin relleno y con grosor coherente.
- Las tarjetas de catálogo no simulan interfaces comerciales: usan fondo crema, borde superior y texto.
- Los enlaces de acción terminan en `→`; la flecha puede desplazarse sutilmente en `hover`.
- El foco de teclado debe ser visible. Nunca depender solo del color.
- Los botones interactivos conservan un área táctil mínima aproximada de 44 px.

## Responsivo

- Escritorio: catálogos en dos columnas cuando existe ancho suficiente.
- Móvil: una columna, tipografía fluida y sin desplazamiento horizontal.
- No fijar alturas para textos extensos.
- SVG e imágenes usan `max-width: 100%`.
- Probar como mínimo 360, 768, 1024 y 1440 px.

## Estilos locales

Un módulo puede definir `--module-accent` en su `estilos.css`. No debe redefinir encabezado, pie, tipografía global o variables de marca. Si una regla se repite en tres o más módulos, evalúa moverla a `modulos.css`.
