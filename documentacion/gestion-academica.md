# Gestión de asesores, alumnos y sesiones

## Fuente de verdad

No existe un JSON central que deba editarse manualmente. La información vive junto a cada módulo:

- `/[asesor]/maestro.json`: identidad, ubicación, disponibilidad, precios, presentación y metodología.
- `/[asesor]/[alumno]/usuario.json`: asesor propietario, identidad operativa y personalización del casillero.
- `/[asesor]/[alumno]/[sesion]/sesion.json`: alumno propietario, fecha editorial, estado, ruta y contrato de contenido.

`npm run catalogo` genera dos derivados versionados:

- `recursos/datos/catalogo.json`: módulos publicables del proyecto;
- `recursos/datos/academia.json`: relación maestro → alumnos → sesiones utilizada por la interfaz.

Nunca edites los archivos generados directamente.

La interfaz usa **asesor**, **salón** y **casillero**. Los nombres técnicos `maestro.json`, `maestro` y `alumno` se conservan para mantener compatibles las rutas y herramientas existentes.

## Agregar un asesor

1. Copia `/plantillas/maestro/` a `/[slug-del-asesor]/`.
2. Sustituye los campos provisionales de `maestro.json`, conservando un ID técnico estable y un `slug` público, y guarda su imagen en `recursos/` o reutiliza una existente.
3. Actualiza `data-maestro-id`, título y metadatos de `index.html`.
4. Usa `estado: "activo"` cuando la información esté completa.
5. Ejecuta catálogo y validación.

No hay que editar la portada ni `/usuarios/index.html`.

## Agregar un alumno

1. Copia `/plantillas/alumno/` a `/[asesor]/[id-estable-del-alumno]/`.
2. Completa `usuario.json`, especialmente `id`, `slug`, `ruta`, `maestro`, `estado` y `personalizacion`.
3. Actualiza el ID y los textos del `index.html`.
4. Elimina `nueva-sesion/` de la copia si todavía no habrá una sesión real.
5. Ejecuta catálogo y validación.

El alumno aparecerá en el salón correcto. Todos los casilleros usan las mismas dimensiones; color, fondo y símbolo proceden de `personalizacion`.

## Agregar o actualizar una sesión

1. Copia `/plantillas/alumno/nueva-sesion/` a `/[asesor]/[alumno]/[slug]/`, o sustituye una sesión existente conservando su ruta.
2. Completa `sesion.json` con un ID globalmente único, un `slug` para la URL, el ID del alumno, objetivo y componentes reales.
3. Nosotros asignamos `fecha` en formato `AAAA-MM-DD` al incorporar o actualizar la sesión.
4. Conserva `borrador` hasta que esté lista y cambia a `publicado` para anunciarla.
5. Ejecuta catálogo y validación.

No hay que editar `usuario.json`, el índice del alumno ni `/usuarios/index.html`. La fecha más reciente de sus sesiones publicadas determina la posición del alumno dentro del salón.

## Estados y visibilidad

| Entidad | Visible | No visible |
|---|---|---|
| Maestro | `activo` | `inactivo`, `plantilla` |
| Alumno | `activo` | `inactivo`, `plantilla` |
| Sesión | `publicado` | `borrador`, `archivado`, `plantilla` |

La exclusión evita tarjetas y registros en las interfaces públicas. Como el sitio se despliega de forma estática, una carpeta versionada no debe contener información privada aunque no esté enlazada.

## Actividad reciente

El generador toma la fecha más reciente entre las sesiones publicadas de cada alumno. Ordena primero por esa fecha de forma descendente y, en caso de empate o ausencia de sesiones, por nombre. La regla es determinista y no depende de la fecha del sistema de archivos.
