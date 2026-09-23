# Despejes lineales

Fecha editorial: `2026-09-22`. Sesión publicada de Kenia; conserva identidad y rutas públicas.

## Recorrido

La portada es una introducción corta con menú de nueve ideas y acceso directo a los recursos. `explicacion/` comienza con una balanza; sigue con suma, resta, multiplicación, dos operaciones, negativos, fracciones, comprobación y casos especiales. Cada página tiene anterior, inicio y continuar; la última conduce a la práctica.

La regla común sigue siendo realizar la misma operación en ambos lados. No se enseña a «pasar» términos. Se usa LaTeX renderizado con el KaTeX existente, ejemplos que se revelan por pasos, preguntas con retroalimentación y comprobación numérica.

## Recursos existentes

- `ejercicios/practica-de-despejes/`: cuatro retos por serie, con enteros y fracciones.
- `calculadoras/calculadora-de-despejes/`: modos enteros y fracciones con aritmética exacta.
- `juegos/brigada-del-despeje/`: veinte misiones con respuestas seleccionables.

Se conservan sus actividades y scripts. La barra `.linear-route` permanece en el flujo normal en todos los componentes; no persigue el desplazamiento. La explicación nueva usa navegación inferior, sin barra fija.

## Dependencias y pruebas

`racionales.mjs` comparte aritmética entre práctica y calculadora. `estilos.css` también es consumido por el juego: conserva sus reglas. Los estilos nuevos de `explicacion/recorrido.css` están limitados a `.despeje-course`; la portada y los nueve pasos usan `explicacion/recorrido.js`. Los recursos globales de marca y navegación se mantienen.

Ejecuta catálogo y validación. Revisa los nueve pasos, las tres herramientas existentes, fórmulas, aciertos y errores, reinicio, teclado, menú móvil, Escape, consola y enlaces en móvil y escritorio.
