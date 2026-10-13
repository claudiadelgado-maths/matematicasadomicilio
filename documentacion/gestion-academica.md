# Gestión de casilleros y sesiones

## Fuente de verdad

- `/Casilleros/[estudiante]/usuario.json`: ID, slug, nombre, estado, ruta y personalización del banner.
- `/Casilleros/[estudiante]/[sesion]/sesion.json`: usuario propietario, fecha editorial, estado, ruta y contenido real.

`npm run catalogo` genera los derivados versionados `recursos/datos/catalogo.json` y `recursos/datos/academia.json`. No los edites a mano. La lista `alumnos` de `academia.json` reúne todos los casilleros y sus sesiones.

## Agregar un casillero

1. Usa `/plantillas/alumno/` como punto de partida para `/Casilleros/[slug]/`.
2. Completa `usuario.json`: ID y slug únicos, nombre visible, ruta, estado y personalización.
3. Actualiza `data-alumno-id`, título y textos de `index.html`; conserva los recursos locales existentes al trasladar un estudiante.
4. Retira `nueva-sesion/` de la nueva carpeta si todavía no habrá una sesión.
5. Usa `estado: activo`, genera el catálogo y valida.

La portada lo incorpora automáticamente. Sus colores y símbolo proceden de `personalizacion`. Los banners con identidad exclusiva reutilizan su CSS local, enlazado desde la portada y su índice. No dupliques sus imágenes ni estilos.

## Sesiones independientes

Cada sesión puede seguir su propia estructura, diseño y reglas. El comando `npm run crear-sesion -- "Estudiante" "Título" [AAAA-MM-DD]` crea solo la entrada y los metadatos mínimos. Consulta [Crear una sesión](creacion-de-sesiones.md).

Para incorporar una sesión ya desarrollada, conserva íntegra su carpeta, enlaza el ID del casillero en `usuario`, ajusta la ruta y documenta sus dependencias reales. Sus componentes opcionales describen lo que existe. No hay que editar listas manuales ni el índice del alumno.

## Visibilidad y actividad

Casilleros: `activo` o `inactivo`; plantillas: `plantilla`. Sesiones: `publicado`, `borrador`, `archivado` o `plantilla`. Solo los casilleros activos y las sesiones publicadas aparecen en la interfaz.

La fecha editorial `AAAA-MM-DD` se asigna al incorporar o actualizar una sesión. La fecha más reciente de las sesiones publicadas ordena los casilleros en la portada. Los empates se resuelven por nombre e ID; los casilleros sin sesiones aparecen al final. El buscador conserva este orden y la paginación muestra como máximo 7 resultados.
