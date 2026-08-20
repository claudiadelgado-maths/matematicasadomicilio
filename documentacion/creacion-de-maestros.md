# Crear un asesor

Ruta: `/[slug-del-asesor]/`.

Parte de `/plantillas/maestro/`. Completa `maestro.json` con un ID técnico estable, un `slug` para la ruta pública, identidad, rol público (`Asesor` o `Asesora`), imagen, ubicación, modalidad, disponibilidad, precios, presentación y metodología. Cambia también `data-maestro-id`, título y descripción del `index.html`. El ID conserva las relaciones internas aunque cambie el nombre; el `slug` y la ruta determinan la dirección visible del salón.

El campo opcional `imagenAjuste` controla el encuadre de la fotografía. Usa `cover` para llenar el marco aceptando un recorte y `contain` cuando deba verse la imagen completa. No dupliques este comportamiento con estilos propios del asesor.

La modalidad usa `modalidad.tipo` con valor `individual` o `grupal`. Cuando sea grupal, define también `modalidad.maximoAlumnos` como entero mayor o igual a 2. La interfaz construye automáticamente textos como `Grupal · Máx. 6 alumnos`; no escribas ese máximo en HTML ni en otro campo duplicado.

No enumeres alumnos dentro del maestro. Cada alumno declara el ID de su maestro en `usuario.json` y el generador construye la relación.

Usa `estado: "plantilla"` mientras el perfil no deba aparecer y `estado: "activo"` cuando esté listo. No publiques información de contacto directa o privada.

Después ejecuta `npm run catalogo` y `npm run validar`. El nuevo asesor aparecerá automáticamente en `/usuarios/` y cada opción de sesión aparecerá en el catálogo de precios de la portada.
