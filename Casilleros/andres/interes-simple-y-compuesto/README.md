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
