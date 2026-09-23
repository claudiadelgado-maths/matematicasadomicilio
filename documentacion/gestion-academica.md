# Gestión de asesores, alumnos y sesiones

## Fuente de verdad

No existe un JSON central que deba editarse manualmente. La información vive junto a cada módulo:

- `/asesores/[asesor]/maestro.json`: identidad, ubicación, modalidad, disponibilidad, precios, presentación y metodología.
- `/asesores/[asesor]/[alumno]/usuario.json`: asesor propietario, identidad operativa y personalización del casillero.
- `/asesores/[asesor]/[alumno]/[sesion]/sesion.json`: alumno propietario, fecha editorial, estado, ruta y contrato de contenido.

`npm run catalogo` genera dos derivados versionados:

- `recursos/datos/catalogo.json`: módulos publicables del proyecto;
- `recursos/datos/academia.json`: relación maestro → alumnos → sesiones utilizada por la interfaz.

Nunca edites los archivos generados directamente.

La interfaz usa **asesor**, **salón** y **casillero**. Los nombres técnicos `maestro.json`, `maestro` y `alumno` se conservan para mantener compatibles las rutas y herramientas existentes.

## Agregar un asesor

1. Copia `/plantillas/maestro/` a `/asesores/[slug-del-asesor]/`.
2. Sustituye los campos provisionales de `maestro.json`, conservando un ID técnico estable y un `slug` público; configura `modalidad.tipo` y, para grupos, `modalidad.maximoAlumnos`; guarda su imagen en `recursos/` o reutiliza una existente.
3. Actualiza `data-maestro-id`, título y metadatos de `index.html`.
4. Usa `estado: "activo"` cuando la información esté completa.
5. Ejecuta catálogo y validación.

No hay que editar la portada ni `/asesores/index.html`.

## Agregar un alumno

1. Copia `/plantillas/alumno/` a `/asesores/[asesor]/[id-estable-del-alumno]/`.
2. Completa `usuario.json`, especialmente `id`, `slug`, `ruta`, `maestro`, `estado` y `personalizacion`.
3. Actualiza el ID y los textos del `index.html`.
4. Elimina `nueva-sesion/` de la copia si todavía no habrá una sesión real.
5. Ejecuta catálogo y validación.

El alumno aparecerá en el salón correcto. Todos los casilleros usan las mismas dimensiones; color, fondo y símbolo proceden de `personalizacion`.

## Agregar o actualizar una sesión

Para una **sesión vanilla visible**, usa `npm run crear-sesion -- "Asesor" "Alumno" "Título"`. Crea la carpeta con su contrato de entrega y genera los índices automáticamente. Consulta [Crear una sesión](creacion-de-sesiones.md). Una vez creada, sustituir su carpeta en la misma ruta no requiere registro adicional ni edición manual de archivos externos. Regenera catálogo y valida cuando incorpores una versión; si solo cambia el contenido, la página ya sirve los archivos nuevos directamente.

Para el flujo manual de contenido inicialmente oculto:

1. Copia `/plantillas/alumno/nueva-sesion/` a `/asesores/[asesor]/[alumno]/[slug]/`, o sustituye una sesión existente conservando su ruta.
2. Completa `sesion.json` con un ID globalmente único, un `slug` para la URL, el ID del alumno, objetivo y componentes reales.
3. Nosotros asignamos `fecha` en formato `AAAA-MM-DD` al incorporar o actualizar la sesión.
4. Conserva `borrador` hasta que esté lista y cambia a `publicado` para anunciarla.
5. Ejecuta catálogo y validación.

No hay que editar `usuario.json`, el índice del alumno ni `/asesores/index.html`. La fecha más reciente de sus sesiones publicadas determina la posición del alumno dentro del salón.

## Estados y visibilidad

| Entidad | Visible | No visible |
|---|---|---|
| Maestro | `activo` | `inactivo`, `plantilla` |
| Alumno | `activo` | `inactivo`, `plantilla` |
| Sesión | `publicado` | `borrador`, `archivado`, `plantilla` |

La exclusión evita tarjetas y registros en las interfaces públicas. Como el sitio se despliega de forma estática, una carpeta versionada no debe contener información privada aunque no esté enlazada.

## Actividad reciente

El generador toma la fecha más reciente entre las sesiones publicadas de cada alumno. Ordena primero por esa fecha de forma descendente y, en caso de empate o ausencia de sesiones, por nombre. La regla es determinista y no depende de la fecha del sistema de archivos.
