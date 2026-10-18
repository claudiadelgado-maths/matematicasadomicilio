# Interés simple y compuesto — versión interactiva

## Instalación
Sustituye la carpeta `Casilleros/andres/interes-simple-y-compuesto/` por esta carpeta completa. No cambies su nombre ni la estructura relativa del sitio.

## Archivos
- `index.html`: contenido, navegación existente y módulos interactivos.
- `estilos.css`: estilos locales de la sesión.
- `interactivo.js`: simulador, gráfica SVG, tabla calculada y retos.
- `sesion.json`: identidad y metadatos originales, con componentes actualizados.

## Compatibilidad
Se preservan los enlaces relativos al casillero y a los recursos globales: `../../../recursos/css/base.css`, `../../../recursos/js/navegacion.js`, logotipo y favicon. Estos archivos globales deben existir en el sitio para que se vean el encabezado y el pie como antes. Las actividades interactivas requieren JavaScript habilitado, pero la explicación y los ejercicios originales siguen en HTML. No usa librerías, fuentes ni servicios externos.

## Supuestos
Tasa fija por periodo, capitalización al final de cada periodo, sin depósitos ni retiros, valores ilustrativos. La gráfica y tabla se calculan en el navegador. Para el simulador: capital entre 0.01 y 1,000,000,000; tasa entre 0 y 100 %; de 1 a 30 periodos.

## Comprobación al publicar
Visita la ruta original, comprueba que el enlace de regreso funcione, el menú del sitio abra correctamente y los recursos compartidos carguen. Prueba el simulador, retos y visualización en móvil y escritorio.

## Metadatos de componentes (2026-10-18)

El contenido educativo está integrado en la página principal `index.html`, con sus secciones y `interactivo.js`. Los campos de `componentes` representan subcarpetas modulares independientes, no secciones o capacidades de la interfaz. Se declaran `false` para `explicacion`, `demostraciones`, `ejercicios`, `juegos` y `calculadoras`, porque esas cinco carpetas no existen en esta sesión. Las explicaciones, prácticas y herramientas existentes siguen disponibles en sus rutas originales. No se crean carpetas vacías ni se cambian páginas o interacciones.

Regenerar índices con `npm run catalogo` y comprobar `npm run validar` después de modificar metadatos.

Verificación 2026-10-18: catálogo regenerado; sesión sigue publicada. `npm run validar` pasa sin errores ni avisos. Auditoría de referencias locales, incluidos los archivos de esta sesión, sin destinos rotos.
