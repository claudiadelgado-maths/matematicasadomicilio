# Plantilla limpia de sesión

Esta carpeta contiene únicamente la infraestructura común. El contenido interno puede adaptarse libremente a la forma de trabajo del maestro.

## Antes de entregarla al maestro

- Puedes conservar `estado: "plantilla"` o cambiarlo a `borrador`.
- Indica el objetivo y cualquier condición específica en este README.
- No asignes todavía la fecha editorial de publicación.

## Cuando regrese la sesión

1. Copia la carpeta a `/[asesor]/[alumno]/[slug]/`.
2. Establece un `id` único y el ID real en `usuario`.
3. Actualiza título, descripción, objetivo, ruta y los componentes que realmente existan.
4. Asigna `fecha` en formato `AAAA-MM-DD`. Esta es la fecha administrada de incorporación o actualización y determina la actividad reciente del alumno.
5. Cambia `estado` a `publicado` únicamente cuando el contenido esté completo.
6. Ejecuta `npm run catalogo` y `npm run validar`.

No crees tarjetas ni carpetas de componentes vacíos. `estilos.css`, `script.js`, `recursos/` y las subcarpetas educativas son opcionales.
