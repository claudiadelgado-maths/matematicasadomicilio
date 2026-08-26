# Crear un tema

1. Crea `/biblioteca/temas/[slug]/`.
2. Añade `index.html`, `README.md`, `tema.json` y, solo si hace falta, `estilos.css`.
3. Crea únicamente carpetas de componentes que tengan contenido.
4. Cada ejercicio, juego o calculadora debe tener su propia subcarpeta.
5. Enlaza los componentes reales desde el índice del tema.
6. Define `simbolo` para la tarjeta generada del catálogo.
7. Ejecuta `npm run catalogo` y `npm run validar`; no añadas una tarjeta manual a `/biblioteca/temas/`.

El `tema.json` debe declarar `id`, `titulo`, `descripcion`, `simbolo`, `categoria`, `nivel`, `etiquetas`, `estado`, `ruta` y booleanos de componentes que coincidan con el disco.

No uses nombres como `nuevo`, `final2` o mayúsculas. El slug debe ser estable, minúsculo y separado por guiones.
