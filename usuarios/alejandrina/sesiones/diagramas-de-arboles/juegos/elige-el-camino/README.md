# Juego: El laberinto infinito

Juego educativo publicado para la sesión de Alejandrina. Convierte un diagrama de árbol en el mapa de un laberinto y pide recorrer la secuencia de ramas que conduce a una hoja marcada como salida.

## Objetivo educativo

Practicar la lectura y el recorrido de diagramas de árbol:

- reconocer el nodo de inicio;
- interpretar cada puerta como una rama;
- seguir una secuencia hasta una hoja concreta;
- distinguir la estructura lógica del árbol de la posición visual de sus opciones.

## Reglas

1. El mapa permanece disponible durante toda la partida.
2. Una hoja está marcada con `🌀 Salida`.
3. En cada habitación aparecen entre 1 y 3 puertas identificadas con emojis.
4. El orden de las puertas se baraja y no corresponde de forma fija al orden de las ramas.
5. Una puerta correcta conduce directamente a la habitación siguiente, sin puntuación ni confirmación intermedia.
6. Una puerta que no pertenece a la ruta provoca un cambio de laberinto: se genera otra plantilla, otro mapa, otras etiquetas y otra salida.
7. La victoria ocurre al recorrer la ruta completa hasta el portal.

No hay vidas, tiempo, puntuación, regreso a una habitación anterior ni `Game Over`.

## Generación

`script.mjs` contiene ocho plantillas estructurales pequeñas y asimétricas. Cada partida:

- elige una plantilla distinta de la anterior;
- asigna temas de emojis por nivel;
- usa de 2 a 5 niveles;
- limita cada nodo a un máximo de 3 ramas;
- escoge como salida una hoja de máxima profundidad;
- conserva la estructura lógica separada de la presentación física de las puertas.

Las funciones puras `createMaze` y `shuffle` se exportan para verificar la generación sin depender de la interfaz.

## Accesibilidad

- botones de puerta con nombre accesible;
- mapa representado mediante listas jerárquicas;
- panel del mapa plegable con `details`;
- estado textual anunciado al cambiar de nivel, mapa o alcanzar la salida;
- foco trasladado al título de la nueva habitación o al resultado;
- animaciones reducidas cuando el sistema solicita menos movimiento;
- ninguna decisión depende del color, la velocidad o el sonido.

## Casos que deben conservarse

- todas las metas son hojas;
- la ruta termina exactamente en la meta;
- las etiquetas de puertas hermanas son distintas;
- ninguna habitación supera tres puertas;
- existen mapas con nodos de una puerta y mapas con tres puertas;
- un error genera inmediatamente una plantilla diferente;
- una ruta completa muestra la victoria y permite iniciar otro mapa.
