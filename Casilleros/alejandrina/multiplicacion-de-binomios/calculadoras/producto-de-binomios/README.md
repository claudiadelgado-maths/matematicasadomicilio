# Calculadora

Calcula exactamente el producto `(Ax+B)(Cx+D)` y muestra el procedimiento completo en LaTeX.

## Modos de entrada

- **Enteros:** una casilla visible para cada valor `A`, `B`, `C` y `D`.
- **Fracciones:** se activa con el botón **Usar fracciones** y presenta numerador y denominador en disposición vertical.

Debajo de los cuatro coeficientes se muestra una vista previa en LaTeX que sustituye `A`, `B`, `C` y `D` por los valores escritos y se actualiza inmediatamente con cada cambio.

## Procedimiento mostrado

1. Expresión original.
2. Distribución de cada término del primer binomio.
3. Cálculo de los cuatro productos.
4. Suma de los dos términos semejantes con `x`.
5. Trinomio ordenado y simplificado.

La calculadora conserva fracciones exactas, valida casillas vacías, denominadores cero y coeficientes `A` o `C` iguales a cero. `index.html` define la interfaz, `estilos.css` contiene sus estilos locales y `script.mjs` realiza el cálculo racional y el renderizado con KaTeX.
