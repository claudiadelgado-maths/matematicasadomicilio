# Crear una sesión

Ruta: `/asesores/[asesor]/[alumno]/[slug-de-la-sesion]/`.

Incluye `index.html`, `README.md`, `sesion.json` y solo los componentes disponibles. Cada ejercicio, juego o calculadora complejo usa una subcarpeta propia.

Parte de `/plantillas/alumno/nueva-sesion/`, cuya profundidad conserva las rutas relativas correctas.

El JSON debe describir objetivo, usuario, `slug`, conocimientos previos, fecha editorial, estado, ruta y componentes. La fecha se asigna al incorporar o actualizar la sesión; no la determina el asesor. Debe usar `AAAA-MM-DD` y ordena al alumno por actividad reciente.

Estados permitidos:

- `plantilla`: base copiable, no visible;
- `borrador`: contenido en preparación, no visible;
- `publicado`: aparece automáticamente en el índice del alumno;
- `archivado`: permanece en el repositorio sin anunciarse.

El índice enlaza al usuario y a cada componente real. No crees carpetas ni tarjetas opcionales vacías. Al terminar ejecuta `npm run catalogo` y `npm run validar`.
