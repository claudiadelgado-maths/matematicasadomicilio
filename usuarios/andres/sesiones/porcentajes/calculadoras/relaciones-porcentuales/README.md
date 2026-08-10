# Calculadoras sincronizadas de porcentajes

Componente publicado de la sesión Porcentajes de Andrés. Reúne tres herramientas automáticas que permiten observar una relación porcentual tanto en sentido directo como inverso, sin botón de cálculo.

## Modelo de interacción

Una relación porcentual necesita dos datos independientes. El selector **Mantener fijo** conserva uno de ellos; la casilla que el alumno modifica funciona como segundo dato. En cada pulsación, las demás casillas se reconstruyen y la interfaz muestra la fórmula aplicada.

El valor fijo es de solo lectura y está señalado con texto y color. Puede cambiarse en cualquier momento desde el selector. Cada calculadora también ofrece un botón para recuperar su ejemplo inicial.

## Herramientas publicadas

### 1. Porcentajes

Relaciona cantidad total, porcentaje y parte correspondiente. Inicia con `100`, `100%` y `100`, con la cantidad total fija. Admite tasas mayores que 100%.

- `P = T · p/100`
- `p = (P/T) · 100`
- `T = P/(p/100)`

### 2. Descuentos

Relaciona cantidad original, porcentaje de descuento, cantidad descontada y cantidad resultante. Inicia con `100`, `100%`, `100` y `0`, con la cantidad original fija. La tasa está limitada al intervalo de 0% a 100%.

- `D = O · p/100`
- `resultado = original − descontada`
- `O = R/(1 − p/100)` cuando la tasa no es 100%

### 3. Aumentos

Relaciona cantidad original, porcentaje de aumento, cantidad aumentada y cantidad resultante. Inicia con `100`, `100%`, `100` y `200`, con la cantidad original fija. Admite aumentos mayores que 100%.

- `A = O · p/100`
- `resultado = original + aumentada`
- `O = R/(1 + p/100)`

## Validación y formatos

- Acepta coma o punto decimal, separadores de miles y entradas con `$` o `%`.
- Rechaza cantidades negativas, resultados no finitos y descuentos mayores que 100%.
- Explica los casos indeterminados, por ejemplo intentar recuperar una cantidad original a partir de un descuento fijo de 100% y un resultado.
- Calcula con precisión interna y presenta hasta cuatro cifras decimales, sin encadenar redondeos visibles.
- Los mensajes se anuncian mediante una región viva y cada entrada incorrecta usa `aria-invalid`.

## Archivos y pruebas

- `index.html`: contenido, controles, navegación y regiones accesibles.
- `estilos.css`: diseño responsivo y estados fijo, resultado y error.
- `script.mjs`: analizadores, solucionadores matemáticos puros y sincronización del DOM.
- `../../matematicas.mjs`: renderizado compartido con KaTeX para fórmulas y fracciones verticales.
- `calculadora.json`: metadatos del componente publicado.

Las funciones directas e inversas se verifican para cada pareja posible de datos, además de cero, 100%, tasas decimales, porcentajes mayores que 100%, valores negativos y formatos numéricos regionales.

Las relaciones y los resúmenes que cambian al escribir se renderizan con KaTeX en tamaño legible; las divisiones matemáticas se presentan como fracciones con numerador y denominador.
