# Salones

Catálogo público de asesores. Esta página muestra únicamente sus fichas; los casilleros aparecen al entrar al salón individual de cada asesor. Los nombres técnicos `maestro` y `alumno` se conservan en los metadatos para no romper la arquitectura. El HTML no contiene una lista manual: `recursos/js/academia.js` carga `recursos/datos/academia.json`, generado desde los metadatos locales.

Las tarjetas se mezclan una vez en cada carga para evitar una posición fija. El buscador filtra por `nombreVisible` mientras se escribe, ignora diferencias de acentos y ordena alfabéticamente los resultados. Al vaciarlo se recupera el mismo orden aleatorio de esa carga. La cuadrícula muestra cuatro tarjetas desde escritorio, tres en tableta y dos en móvil.

No coloques información sensible en HTML, JSON o commits. Cada `usuario.json` declara `maestro`, `estado` y `personalizacion`. Las sesiones se derivan de los `sesion.json` publicados; no se mantiene una lista duplicada en el alumno.

Para añadir un asesor o un casillero, completa sus metadatos locales y ejecuta `npm run catalogo`. Solo los asesores con `estado: "activo"` aparecen como tarjetas; solo los alumnos activos aparecen dentro del salón correspondiente.
