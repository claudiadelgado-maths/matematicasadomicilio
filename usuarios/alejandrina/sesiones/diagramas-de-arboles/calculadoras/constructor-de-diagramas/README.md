# Calculadora de diagramas de árbol

Herramienta educativa publicada para la sesión de Alejandrina. Permite modificar una colección y observar el árbol completo que producen sus etapas y su regla de repetición.

## Entradas

- Colección de 1 a 5 elementos.
- Máximo 3 tipos distintos por colección.
- De 1 a 5 etapas.
- Regla con repetición o sin repetición.

El editor incluye símbolos de animales, frutas, colores, deportes y naturaleza. También ofrece tres colecciones rápidas.

## Resultado

La calculadora presenta:

- resumen de la colección, etapas solicitadas, etapas construidas y regla;
- diagrama completo de las ramas posibles;
- aviso educativo cuando una colección sin repetición se termina antes de las etapas solicitadas;
- recorrido del primer camino para mostrar cómo cambia la colección.

No calcula probabilidades ni califica respuestas. Si una configuración produce más de 120 nodos, se pide reducir su tamaño para conservar un diagrama legible.

## Lógica

`script.mjs` reutiliza `../../arboles.mjs` como única fuente para construir y recorrer el árbol. El contenido del editor se mantiene local a la página y no se almacena.

## Casos que deben conservarse

- colección vacía: no genera y solicita agregar un elemento;
- un solo tipo: genera una rama válida;
- sin repetición y más etapas que elementos: construye hasta agotar la colección y explica el límite;
- con repetición: conserva la colección completa después de cada extracción;
- cambiar entradas después de generar: oculta el resultado anterior hasta volver a calcular;
- cancelar el editor: no modifica la colección aceptada.
