# Crear una calculadora

Ruta: `[tema]/calculadoras/[slug]/` para una herramienta ligada a un tema. Las calculadoras públicas bajo `/biblioteca/` aparecen automáticamente en `/biblioteca/calculadoras/` sin duplicar archivos ni tarjetas editables.

Incluye `index.html`, `README.md`, `calculadora.json`, `script.js` y estilos locales si se requieren. Define `simbolo` en los metadatos para su tarjeta de catálogo.

Valida campos, explica formatos aceptados, evita resultados como `NaN` o divisiones entre cero y muestra el procedimiento cuando tenga valor educativo. Prueba entradas vacías, negativas, decimales, límites y reinicio.
