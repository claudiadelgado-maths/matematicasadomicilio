# Datos no agrupados

Fecha editorial de la versión publicada: `2026-07-24`.

## Objetivo

Comprender desde cero cómo una lista de datos no agrupados se ordena, resume e interpreta mediante frecuencias, porcentajes, acumulados, gráficas y medidas de tendencia central. La sesión pertenece al espacio de Alejandrina y no forma parte de la Biblioteca general.

## Componentes

- `explicacion/`: definiciones, teoría progresiva, tabla de seis columnas, gráficas y ejemplos reales.
- `ejercicios/organiza-y-analiza/`: cinco actividades con retroalimentación y procedimientos.
- `calculadoras/estadistica-descriptiva/`: análisis automático de enteros y decimales, tabla completa y dos gráficas.
- `juegos/entrevista-musical/`: aplicación contextual.

## Recursos compartidos dentro de la sesión

- `estadistica.mjs`: parseo, orden, frecuencias, acumulados, media, mediana, moda, KaTeX dinámico y gráficas.
- `estadistica.css`: diseño común de teoría, ejercicios, tablas, procedimientos y gráficas.

No copies estos recursos en cada componente. El juego conserva su lógica independiente porque no fue rehecho.

## Convenciones matemáticas

- \(x_i\): valor distinto.
- \(f_i\): frecuencia absoluta.
- \(h_i=f_i/n\): frecuencia relativa.
- \(p_i=h_i\cdot100\%\): porcentaje.
- \(F_i\): frecuencia acumulada.
- \(P_i=F_i/n\cdot100\%\): porcentaje acumulado.
- La moda no se fuerza cuando todos los valores tienen la misma frecuencia.
- Los cálculos internos no se redondean; solo se redondea la presentación.

## Comprobaciones

Prueba valores repetidos, sin moda y con varias modas; cantidades pares e impares; negativos y decimales; entradas inválidas; tablas y gráficas coincidentes; dimensiones controladas; KaTeX estático y dinámico; teclado, 360–1440 px, enlaces y consola.

Para modificar una parte, lee su README y JSON. Trabaja solo dentro de esta sesión, conserva la relación con Alejandrina, no expongas datos sensibles y no edites Biblioteca.
