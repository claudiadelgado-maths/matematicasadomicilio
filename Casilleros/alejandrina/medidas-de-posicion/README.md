# Medidas de posición

Fecha editorial de la versión publicada: `2026-07-29`.

## Estado

Sesión publicada para el espacio de Alejandrina. La teoría, los ejercicios, la calculadora y el juego están disponibles.

## Objetivo

Comprender cuartiles, deciles, percentiles y mediana como formas equivalentes de expresar posiciones dentro de un recorrido del 0% al 100%.

## Componentes

- `explicacion/`: teoría visual publicada.
- `ejercicios/relaciona-las-medidas/`: tres ejercicios generativos publicados.
- `calculadoras/conversor-de-medidas/`: conversor visual publicado.
- `juegos/recorrido-de-posiciones/`: juego **El taller del corte exacto**, con ocho pedidos progresivos y cortes sobre una regla del 0% al 100%.

## Alcance matemático

La sesión se limita a reconocer y convertir notaciones:

- `Q1 = 25% = P25`;
- `Q2 = 50% = D5 = P50 = Mediana`;
- `Q3 = 75% = P75`;
- `Dn = n × 10%`;
- `Pn = n%`.

No incluye interpolación, fórmulas para localizar posiciones, tablas de frecuencias, datos agrupados ni cálculo de medidas a partir de listas.

## Lógica compartida

`posiciones.mjs` es la fuente única de porcentajes y equivalencias exactas para ejercicios, calculadora y juego. La teoría documenta las mismas reglas de forma estática.

## Para una IA

Trabaja dentro de esta sesión salvo por los archivos de Alejandrina que la integran. Conserva las rutas, la separación entre componentes y el alcance introductorio. Si se amplía el juego, no introduzcas cálculo con conjuntos de datos ni cambies su práctica de equivalencias porcentuales.
