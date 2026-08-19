# Salones

Catálogo público de asesores. Esta página muestra únicamente sus fichas; los casilleros aparecen al entrar al salón individual de cada asesor. Los nombres técnicos `maestro` y `alumno` se conservan en los metadatos para no romper la arquitectura. El HTML no contiene una lista manual: `recursos/js/academia.js` carga `recursos/datos/academia.json`, generado desde los metadatos locales.

No coloques información sensible en HTML, JSON o commits. Cada `usuario.json` declara `maestro`, `estado` y `personalizacion`. Las sesiones se derivan de los `sesion.json` publicados; no se mantiene una lista duplicada en el alumno.

## Espacios actuales

- `/erik/jose/`: alumno de Erik; tablero personal de tareas con almacenamiento local.
- `/erik/alejandrina/`: alumna de Erik; sesiones personalizadas de estadística y probabilidad.
- `/erik/andres/`: alumno de Erik; sesión de Porcentajes publicada.

Para añadir un casillero, copia `/plantillas/alumno/`, completa sus metadatos y ejecuta `npm run catalogo`. Solo los alumnos con `estado: "activo"` y un asesor activo aparecen en este índice.
