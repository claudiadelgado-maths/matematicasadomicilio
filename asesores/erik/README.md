# Erik

Salón del primer asesor registrado en la arquitectura académica.

## Fuente de verdad

- `maestro.json`: identidad, ubicación, imagen, modalidad individual, disponibilidad, precios y presentación.
- `index.html`: contenedor reutilizable que carga el perfil desde `recursos/datos/academia.json`.
- La fotografía vive en `/asesores/erik/recursos/admin.jpg` y también se utiliza en Contacto.

Los alumnos de Erik viven en subcarpetas de este salón y se relacionan mediante el campo técnico `maestro` de cada `usuario.json`; no se mantiene una lista duplicada.

Para actualizar contenido, modifica `maestro.json`, ejecuta `npm run catalogo` y después `npm run validar`.

El casillero de Alejandrina utiliza su identidad floral desde `alejandrina/recursos/identidad.css`, compartida con la cabecera de su espacio. El selector es exclusivo de su ID. Al modificar ese recurso, revisar ambas páginas y comprobar que los otros casilleros mantienen su estilo.

El casillero de Raúl utiliza raul/recursos/identidad.css: rojo fuego, texto marfil y motivos históricos, compartidos con su cabecera personal. Selector exclusivo raul-erik; comprobar salón e índice del alumno al modificarlo.

El casillero de **KENISA** utiliza `kenisa/recursos/identidad.css`: rosa princesa, letras verdes y motivos hippies SVG, compartidos con su cabecera personal. Su ID es `kenisa-erik` y su entrada pública es `/asesores/erik/kenisa/index.html`. Revisar el salón y el índice del casillero cuando se edite su identidad; los selectores están limitados a KENISA.
