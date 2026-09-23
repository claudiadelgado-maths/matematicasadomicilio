# Crear una sesión

Ruta: `/asesores/[asesor]/[alumno]/[slug-de-la-sesion]/`.

Incluye `index.html`, `README.md`, `sesion.json` y solo los componentes disponibles. Cada ejercicio, juego o calculadora complejo usa una subcarpeta propia.

Para crear una sesión vanilla visible usa, desde la raíz:

```powershell
npm run crear-sesion -- "Erik" "Andres" "Teorema de Tales"
```

El comando resuelve nombres (sin distinguir acentos), IDs o slugs de asesores y alumnos activos, crea únicamente la carpeta de sesión y ejecuta catálogo y validación. Rechaza ambigüedades, fechas inválidas, IDs duplicados y carpetas existentes; nunca sobrescribe una sesión. Opcionalmente acepta una fecha editorial `AAAA-MM-DD` como cuarto argumento; por defecto usa la fecha local de creación.

La base es `/plantillas/alumno/nueva-sesion/`. El generador adapta sus rutas relativas: una sesión real está un nivel más profundo que la plantilla. Si copias manualmente la plantilla, debes corregir esas referencias y las migas de pan.

La vanilla tiene `estado: publicado` para aparecer desde el inicio, pero muestra solamente «Sesión en preparación». No declara componentes educativos disponibles. Contiene `index.html`, `estilos.css`, `sesion.json` y un `README.md` con el contrato específico para el profesor o una IA.

Entrega únicamente esa carpeta. El profesor desarrolla su contenido local y devuelve la carpeta completa. Reemplázala en la misma ubicación conservando el nombre, entrada e identidad del JSON. Los cambios de contenido se ven al recargar por HTTP sin volver a registrar la sesión. Para actualizar los metadatos de las listas ejecuta `npm run catalogo` y `npm run validar`; no edites los derivados manualmente. La carpeta depende de los recursos globales documentados y se previsualiza dentro del sitio.

Pruebas del generador: `npm run test:crear-sesion`.

El JSON debe describir objetivo, usuario, `slug`, conocimientos previos, fecha editorial, estado, ruta y componentes. La fecha se asigna al incorporar o actualizar la sesión; no la determina el asesor. Debe usar `AAAA-MM-DD` y ordena al alumno por actividad reciente.

Estados permitidos:

- `plantilla`: base copiable, no visible;
- `borrador`: contenido en preparación, no visible;
- `publicado`: aparece automáticamente en el índice del alumno;
- `archivado`: permanece en el repositorio sin anunciarse.

El índice enlaza al usuario y a cada componente real. No crees carpetas ni tarjetas opcionales vacías. Al terminar ejecuta `npm run catalogo` y `npm run validar`.
