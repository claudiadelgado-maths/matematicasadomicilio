# Juego: El taller del corte exacto

Juego educativo publicado para la sesión de Alejandrina. Presenta pedidos de un taller y pide cortar una cinta en la posición porcentual correspondiente a un cuartil, decil, percentil o a la mediana.

## Objetivo educativo

Reconocer las medidas de posición como puntos exactos dentro de un recorrido del 0% al 100%:

- `Q1 = P25 = 25%`;
- `Q2 = D5 = P50 = Mediana = 50%`;
- `Q3 = P75 = 75%`;
- `Dn = P(n × 10) = n × 10%`;
- `Pn = n%`.

No se ordenan datos, aplican fórmulas de posición, interpolan valores ni trabajan frecuencias.

## Reglas

1. Un turno contiene ocho pedidos.
2. Cada pedido utiliza una notación o nombre verbal diferente.
3. El jugador mueve las tijeras entre 0% y 100% con precisión de 1%.
4. La posición puede cambiarse con el control deslizante, teclado o botones de ajuste fino.
5. `Hacer el corte` evalúa el porcentaje de forma exacta.
6. Después de cada intento se muestra la equivalencia correcta.
7. Un error no bloquea el turno ni resta puntos; únicamente reinicia la racha.
8. Tras ocho pedidos aparece un resumen y se puede comenzar un turno nuevo.

## Progresión

- pedidos 1 a 3, **Fundamentos**: cuartiles, mediana y equivalencias habituales;
- pedidos 4 a 6, **Taller**: deciles y percentiles comunes;
- pedidos 7 y 8, **Precisión**: percentiles menos habituales y práctica mixta.

Dos pedidos consecutivos nunca utilizan el mismo porcentaje ni la misma medida. El material, el color de la cinta y la redacción del pedido cambian para dar variedad visual.

## Lógica

`script.mjs` importa las conversiones de `../../posiciones.mjs` para mantener una sola fuente matemática. Exporta:

- `GAME_LENGTH`;
- `levelForRound`;
- `createOrder`;
- `evaluateCut`.

Estas funciones permiten verificar la generación y la evaluación sin depender del navegador.

## Accesibilidad

- control nativo de rango compatible con flechas del teclado;
- botones de ajuste con nombres accesibles y áreas táctiles amplias;
- porcentaje seleccionado visible y anunciado;
- feedback mediante texto, símbolo y color;
- respuesta correcta señalada sobre la regla después de un error;
- foco trasladado al pedido, feedback o resumen según el avance;
- progreso representado también con `progressbar`;
- animación reducida cuando el sistema solicita menos movimiento;
- sin límite de tiempo, sonido, vidas ni decisiones que dependan solo del color.

## Casos que deben conservarse

- todas las posiciones generadas están entre 1% y 99%;
- cada respuesta correcta coincide exactamente con el porcentaje de la medida;
- el control acepta cada entero entre 0% y 100%;
- un error muestra el porcentaje objetivo y la equivalencia completa;
- el turno termina exactamente después del octavo pedido;
- reiniciar restablece aciertos, racha y progreso;
- la interfaz no introduce cálculo estadístico con datos.
