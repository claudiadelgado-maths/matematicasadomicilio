# Sistema visual

## Identidad

La marca utiliza blanco, negro y grises cálidos; es minimalista, tipográfica y de alto contraste. El color crema se llama `color-surface` y su valor es `#f3f3f0`.

Variables principales en `recursos/css/base.css`:

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

Cada `index.html` tiene un `estilos.css` en su misma carpeta. Allí vive todo lo particular de esa página: composición, tarjetas, perfiles, contenido educativo, acentos y ajustes responsivos.

Un módulo puede definir `--module-accent` y otras variables locales. `base.css` no debe recibir reglas de una página concreta. La repetición entre módulos es aceptable cuando conserva su independencia; una regla solo pasa a la base global si es realmente necesaria en todo el sitio. El encabezado, el pie y las variables de marca se reutilizan desde la base, salvo que una página necesite deliberadamente una variante propia.
