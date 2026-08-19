# Calculadora: Conversor de medidas de posición

Herramienta educativa publicada para la sesión de Alejandrina.

## Entrada

- cuartiles Q1, Q2 y Q3;
- deciles D1 a D9;
- percentiles P1 a P99;
- mediana.

## Resultado

- notación elegida;
- porcentaje correspondiente;
- percentil equivalente;
- otras medidas que coinciden exactamente;
- marcador visual entre 0% y 100%;
- explicación breve de la conversión.

La herramienta nunca inventa equivalencias. Por ejemplo, P75 muestra Q3 pero no un decil, y P43 indica que no tiene cuartil ni decil entero equivalente.

## Validación

El percentil debe ser un entero entre 1 y 99. Los demás tipos se limitan mediante selectores.

## Límites

Es un conversor de notaciones. No recibe listas, no localiza valores dentro de datos ordenados y no utiliza interpolación.

## Lógica

`script.mjs` reutiliza `../../posiciones.mjs` como fuente de porcentajes y equivalencias exactas.
