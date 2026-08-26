# Sucesiones aritméticas · Sesión 1

Primera sesión de un bloque progresivo para Alejandrina. Se concentra en reconocer una diferencia constante, distinguir posición y valor, construir la fórmula general y utilizarla para encontrar términos.

## Alcance

- significado de `a₁`, `d`, `n`, `aₙ` y `n − 1`;
- reconocimiento de sucesiones crecientes y decrecientes;
- construcción de `aₙ = a₁ + (n − 1)d` mediante saltos;
- relación entre lista, posiciones y fórmula general;
- cálculo de un término a partir de su posición.

No introduce suma de términos, series, medios aritméticos, recurrencias ni resolución de problemas inversos avanzados; esos contenidos pertenecen a sesiones posteriores del bloque.

## Componentes

- `explicacion/`: recorrido conceptual y progresivo con fórmula interactiva y ejemplos guiados.
- `ejercicios/`: práctica generativa sobre una misma sucesión, con pistas específicas.
- `calculadoras/`: analiza listas escritas por la alumna y explica sus diferencias.
- `juegos/`: juego de tres niveles y quince preguntas nuevas por partida.

## Recursos compartidos

- `sucesiones.mjs`: generador, cálculo de términos, análisis, notación y renderizado matemático.
- `sucesiones.css`: identidad visual, contenedores matemáticos y componentes comunes.

Todos los valores dinámicos se construyen desde un par `(a₁, d)` y nunca generando cada término de forma independiente. Las diferencias negativas se presentan como resta para evitar expresiones del tipo `+(n−1)(−5)`.
