# Despeje y manipulación de ecuaciones

Una sola vista entre Reto de sustitución y Proporcionalidad directa. Demostración de intercambio de lados, cuatro operaciones inversas con ejemplos numéricos, cocientes simbólicos y laboratorio manipulativo.

## Interacción

En el laboratorio cada factor aparece una vez, en un numerador o denominador. Al seleccionarlo se ofrece dividir o multiplicar ambos lados para cancelarlo en su posición actual. Puede moverse cualquier factor; no se fuerza un único camino. Incluye voltear, deshacer, reiniciar, distintos objetivos, cuatro estructuras y cuatro conjuntos de emojis. La representación con letras conserva exactamente el estado. Todos los valores simbólicos son no nulos, condición visible necesaria para que cada transformación sea reversible.

El modelo puro está en `../../recursos/despejes/motor.mjs`; la interacción y el estilo, en esa misma carpeta. Reutiliza sin modificar `../../recursos/cierre/ui.mjs` para KaTeX y su alternativa vertical. No altera la lógica de las páginas previas. Sin almacenamiento ni servicios para calcular respuestas.

## Comprobaciones

`node asesores/erik/raul/repaso/pruebas/despejes.test.mjs`, `npm run catalogo` y `npm run validar`. Revisar objetivos en numeradores y denominadores, voltear, deshacer, cambio de símbolos, nuevo ejemplo, teclado, movimiento reducido, móvil, consola y enlaces.
