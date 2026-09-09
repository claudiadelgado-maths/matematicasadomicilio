# Repaso

Sesión completa de Raúl (Erik), con 25 páginas: fracciones, sustitución y evaluación de expresiones, despejes sencillos, proporcionalidad directa e inversa y presentación de factorización numérica.

Lógica y diseño compartidos en `recursos/`. Cada fracción usa KaTeX con alternativa vertical si no carga. Se opera con enteros, equivalencias exactas y simplificación mediante MCD. Sin almacenamiento ni dependencias de otras sesiones. Navegación secuencial, compatible con teclado y pantallas pequeñas.

## Recorrido

- Fracciones: index.html
- Fracciones equivalentes: ejercicios/equivalentes/index.html
- Simplificación: ejercicios/simplificacion/index.html
- Suma con el mismo denominador: ejercicios/suma-mismo-denominador/index.html
- Suma con diferente denominador: ejercicios/suma-distinto-denominador/index.html
- Resta de fracciones: ejercicios/resta/index.html
- Multiplicación de fracciones: ejercicios/multiplicacion/index.html
- División de fracciones: ejercicios/division/index.html
- Reto de fracciones: ejercicios/reto/index.html

El reto de Fracciones continúa en Sustitución. Ejecutar `npm run catalogo` y `npm run validar`.

## Sustitución y evaluación de expresiones

- Sustitución: ejercicios/sustitucion/index.html
- Conserva la estructura: ejercicios/construir-sustitucion/index.html
- Valores negativos: ejercicios/negativos/index.html
- La misma variable, varias veces: ejercicios/variable-repetida/index.html
- Varias variables: ejercicios/varias-variables/index.html
- Sustituir fracciones: ejercicios/sustitucion-fracciones/index.html
- Sustituir decimales: ejercicios/decimales/index.html
- Sustitución con potencias: ejercicios/exponentes/index.html
- Sustitución en fórmulas: ejercicios/formulas/index.html
- Orden de las operaciones: ejercicios/orden/index.html
- Detecta el error: ejercicios/errores/index.html
- Reto de sustitución: ejercicios/reto-sustitucion/index.html

Los doce apartados usan recursos/sustitucion y conservan el diseño de Repaso. El reto de Sustitución continúa en Despeje y manipulación de ecuaciones.

## Pruebas de Sustitución

`node asesores/erik/raul/repaso/pruebas/sustitucion.test.mjs` comprueba generación, exactitud, signos y equivalencia de cada transformación. La actividad admite arrastre, selección y teclado, no guarda respuestas y no mezcla fracciones con decimales en el mismo ejercicio.


## Despejes sencillos

`ejercicios/despejes-sencillos/index.html` es una única vista entre Reto de sustitución y Proporcionalidad directa. Incluye operaciones inversas en ambos lados, intercambio de lados, cocientes y un laboratorio con factores seleccionables. Se puede deshacer y alternar emojis y letras sin alterar la igualdad. Las cantidades simbólicas se suponen no nulas.

Recursos en `recursos/despejes/`; reutiliza la representación matemática de `recursos/cierre/ui.mjs` sin modificarla. Prueba: `node asesores/erik/raul/repaso/pruebas/despejes.test.mjs`.

## Cierre de la sesión

- Proporcionalidad directa: `ejercicios/proporcionalidad-directa/index.html`. Ocho contextos explorables, barras enlazadas, transformación por factor o unidad y problemas dinámicos.
- Proporcionalidad inversa: `ejercicios/proporcionalidad-inversa/index.html`. Cinco contextos, trabajo fijo, deslizador de tiempo, clasificación por arrastre o botones y problemas escritos.
- Factorización: `demostraciones/factorizacion/index.html`. Presentación sin ejercicios ni evaluación. Árbol desplegable, diez números, dos caminos y conexión con factores comunes y MCD.

La sesión termina en Factorización: cierre visual y regreso a sesiones de Raúl, sin otro botón Continuar. Los recursos de estas tres páginas están aislados en `recursos/cierre/`. No se modifica la lógica de Fracciones ni Sustitución.

Pruebas: `node asesores/erik/raul/repaso/pruebas/cierre.test.mjs`. Se verifican conservación del cociente o producto, generación controlada, descomposición y unicidad de los primos entre caminos. Las respuestas decimales aceptan coma o punto y se validan como racionales.
