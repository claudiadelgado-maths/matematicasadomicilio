# Casillero de NewStudent

Ruta: `/Casilleros/newstudent/`. ID estable: `newstudent`.

El índice conserva la navegación, marca, pie y controles flotantes del sitio. Su identidad es neutral (negro y crema). Obtiene las sesiones publicadas desde `recursos/datos/academia.json` mediante `../recursos/js/alumno.js`; no mantiene una lista manual.

## Contenido

- `revision/`: primera sesión, **Revisión**, diagnóstico de aritmética, álgebra y geometría de aproximadamente 150 minutos.
- `recursos/comun.css`: tipografía introductoria y migas de pan compartidas por el casillero, la portada de Revisión y sus actividades. Sus consumidores son los tres `index.html` de esta carpeta y sus descendientes.

El índice no guarda datos. Las actividades guardan respuestas y última área visitada en `localStorage`, bajo `newstudent-revision-v1`, sin enviar información a un servidor. La clave se conserva si cambia el nombre visible del alumno.

## Dependencias y comprobaciones

Depende de `recursos/css/base.css`, `recursos/js/navegacion.js`, `recursos/svg/` en la raíz, del controlador académico compartido y del JSON generado.

Ejecutar `npm run catalogo` y `npm run validar`. Comprobar que el banner aparece en la portada y en el buscador, que abre este casillero y que su sesión conduce a `revision/`. Revisar móvil, escritorio, teclado, menú/Escape, consola y enlaces.
