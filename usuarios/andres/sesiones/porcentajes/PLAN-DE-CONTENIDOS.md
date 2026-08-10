# Plan de contenidos — Porcentajes

Este documento registra los cuatro componentes publicados de la sesión de Andrés. La teoría funciona como contrato pedagógico y los ejercicios, las calculadoras y el juego aplican únicamente relaciones que el alumno ya estudió.

## Bloque 1 — Explicación / Teoría · Publicado

### Resultado alcanzado

Después de una lectura de 10 a 15 minutos, Andrés puede reconocer qué cantidad representa el 100%, traducir entre porcentaje, decimal y fracción, calcular una parte, descubrir una tasa, reconstruir el total y explicar el efecto de un aumento o una disminución.

### Contenido disponible

1. **Una comparación de cada cien:** significado de `p%`; equivalencia con `p/100` y decimal; porcentajes menores que 1% y mayores que 100%; barra de parte y resto.
2. **Tres preguntas fundamentales:** “¿cuánto es `p%` de `X`?”, “¿qué porcentaje representa `A` de `X`?” y “si `A` es `p%`, ¿cuál era el total?”, con tres ejemplos que usan los mismos datos para mostrar la relación inversa.
3. **Datos y poblaciones:** lectura contextual de porcentajes del Censo 2020, identificación de la población que representa 100% y diferencia entre porcentaje y cantidad absoluta. Se mencionan usos en probabilidad, medicina, ingeniería, ciencias, educación y finanzas.
4. **Cambios porcentuales:** aumento, disminución y factor multiplicativo; cálculo del cambio relativo; diferencia entre porcentaje y puntos porcentuales; cambios sucesivos que usan bases diferentes.
5. **Precios y descuentos:** precio original, cantidad descontada, precio final, tasa, recuperación del precio original y descuentos sucesivos.
6. **IVA como aplicación:** base, impuesto y total; cálculo directo e inverso con la tasa general mexicana de 16%; explicación del error de restar 16% al precio con IVA.
7. **Descuento e IVA:** descuento antes del impuesto, procedimiento por etapas y factor combinado.
8. **Estrategia de decisión:** identificar el 100%, nombrar datos e incógnita, convertir la tasa, elegir multiplicación o división y comprobar si el resultado tiene sentido.

### Recursos visuales implementados

- Barra que distingue la parte porcentual y el resto del total.
- Diagrama parte–porcentaje–total y familia de fórmulas relacionada.
- Transformaciones visuales de `cantidad inicial → factor → cantidad final`.
- Barras de datos reales con texto alternativo y fuentes oficiales.
- Anatomía de precio original, cantidad descontada y precio final.
- Tabla de relaciones directas e inversas para descuentos.
- Descomposición de base, IVA y total, con tres casos resueltos.
- Guía final de decisión, seis errores comunes y hoja de fórmulas esenciales.

### Contrato para los componentes derivados

- Cada problema debe indicar o permitir deducir con claridad qué cantidad representa 100%.
- `parte = total · p/100`, `p = (parte/total) · 100` y `total = parte/(p/100)` son las tres relaciones centrales; en la interfaz, los cocientes se muestran con fracciones verticales de LaTeX.
- Para un aumento o disminución se usa `nuevo = inicial × (1 ± p/100)`; para recuperar el inicial se divide entre el factor aplicado.
- Los cambios sucesivos multiplican factores y no se suman salvo que compartan exactamente la misma base.
- En compras de esta sesión, primero se descuenta y después se calcula el IVA sobre el precio descontado.
- Los mensajes de ayuda deben distinguir porcentaje, puntos porcentuales, cantidad monetaria y base.
- Las situaciones de datos deben declarar población, lugar o periodo cuando sean relevantes.
- Los valores generados deben poder resolverse con lo enseñado aquí; no se introducirán interés compuesto, tasas fiscales especiales ni asesoría médica o fiscal.

La teoría evita fórmulas aisladas: cada relación aparece después de su interpretación y se acompaña de una comprobación o de la operación inversa.

## Bloque 2 — Ejercicios · Publicado

### Cobertura implementada

1. **Relación porcentual:** alterna entre calcular una parte, descubrir una tasa y recuperar el total. El contexto de estudiantes exige identificar el grupo completo como 100%.
2. **Cambios porcentuales:** alterna aumento y disminución, aplicación directa, cálculo de la tasa y recuperación del valor inicial mediante el factor inverso.
3. **Descuentos:** alterna cantidad descontada y precio final, recuperación del precio original y cálculo de la tasa aplicada.
4. **IVA:** alterna base conocida, total conocido, IVA conocido y una compra con descuento antes del IVA.

### Mecánica implementada

Cada familia muestra un problema a la vez, uno a tres campos con unidad visible, botón **Comprobar respuesta**, retroalimentación por campo, procedimiento de comprobación y botón **Nuevo ejercicio**. El encabezado de la actividad recuerda qué razonamiento se evalúa y el enunciado declara la base o pide identificarla.

La generación aleatoria parte de una solución compatible y construye el enunciado alrededor de ella. Así se evitan decimales arbitrarios y números exagerados. Se aceptan punto o coma decimal, separadores de miles, símbolos de moneda y porcentaje; las cantidades monetarias conservan dos decimales.

### Evaluación formativa implementada

- Cada casilla se marca por separado como correcta o por corregir y recibe una orientación ligada a la operación necesaria.
- Los procedimientos distinguen tasa, cantidad monetaria y base; también señalan el error de restar 16% al total o sumar un porcentaje al precio rebajado.
- El resumen muestra cuántas de las cuatro áreas visibles están correctas. Generar un problema nuevo reinicia solamente el área correspondiente.
- El progreso permanece en memoria durante la visita y no se guarda ni se convierte en una calificación permanente.
- Las 16 variantes posibles se sustentan en la teoría publicada y mantienen una dificultad de preparatoria inicial.

## Bloque 3 — Calculadoras · Publicado

### Resolución de la ambigüedad

Una sola cantidad no determina una relación porcentual completa. Cada herramienta incluye un selector **Mantener fijo**: el dato elegido permanece como referencia y la casilla que el alumno edita aporta el segundo dato independiente. Con ambos se calculan inmediatamente los valores restantes. De este modo no se adivina qué entrada debe dominar ni se conservan datos incompatibles.

### Herramientas implementadas

1. **Porcentajes:** cantidad total, porcentaje y parte correspondiente. Resuelve parte, tasa o total y permite tasas mayores que 100%.
2. **Descuentos:** cantidad original, porcentaje descontado, cantidad descontada y cantidad resultante. Resuelve las seis parejas de datos posibles y limita la tasa entre 0% y 100%.
3. **Aumentos:** cantidad original, porcentaje aumentado, cantidad aumentada y cantidad resultante. Resuelve las seis parejas de datos posibles y admite aumentos mayores que 100%.

Los ejemplos iniciales usan una base de 100: `100`, `100%`, `100`; en descuentos el resultado es `0` y en aumentos es `200`.

### Experiencia y cálculo implementados

- Actualización en cada entrada, sin botón **Calcular**.
- Campo fijo de solo lectura, señalado visualmente y descrito en los mensajes.
- Fórmula utilizada, lectura verbal del resultado y botón para restablecer el ejemplo.
- Coma o punto decimal, separadores de miles y símbolos opcionales de moneda o porcentaje.
- Mensajes específicos para cero, descuentos fuera de rango, cantidades negativas y relaciones indeterminadas.
- Funciones matemáticas puras separadas del DOM y redondeo únicamente para presentación.
- Diseño en columna, pares de porcentaje y cantidad agrupados, adaptación móvil y navegación por teclado.

## Bloque 4 — Juego: Ticket bajo la lupa · Publicado

### Simplificación aplicada

La idea de tienda y auditoría se conservó, pero se eliminó la economía internacional, el carrito con varios artículos y las tasas por país. Esa versión exigía demasiadas decisiones ajenas al objetivo matemático. La partida publicada utiliza una tienda ficticia y pesos como formato familiar. Cada producto genera una tasa ficticia visible entre 10%, 12%, 16%, 19% y 21%. Esta variación es mecánica de juego, no información fiscal; obliga a leer y aplicar la tasa en vez de asumir siempre 16%. La teoría y los ejercicios conservan 16% cuando explican el caso mexicano.

Cada ticket requiere únicamente estas tres operaciones:

1. `después del descuento = original × (1 − descuento/100)`;
2. `IVA = después del descuento · tasa del ticket/100`;
3. `total = después del descuento + IVA`.

### Bucle implementado

`elegir producto → revisar tres líneas → aceptar o reclamar → localizar el error si existe → leer explicación → continuar`

Toda la partida funciona mediante clics. No hay campos numéricos, arrastre, cronómetro, sonido ni obligación de usar una calculadora externa. Los diez productos tienen cantidades y descuentos preparados para conservar operaciones breves.

### Condiciones de partida

- Cuatro dictámenes correctos producen la victoria y la credencial de **Auditor Estrella**.
- Tres dictámenes incorrectos producen la derrota.
- La partida termina en un máximo de seis tickets.
- Dos pistas recuerdan el factor restante y la base del IVA; cada una puede usarse una sola vez y no se repite una pista en la misma ronda.
- Una respuesta incorrecta conserva una explicación y permite continuar o reiniciar inmediatamente.

### Ticket canónico y error único

Cada compra se calcula primero en centavos enteros y genera un ticket canónico. Las seis rondas posibles se balancean con tres tickets correctos y tres defectuosos en orden aleatorio. Un ticket defectuoso modifica exclusivamente una de estas líneas:

- cantidad después del descuento;
- IVA;
- total.

El resto del ticket conserva los valores canónicos. La respuesta correcta es la identidad del único campo mutado, y la resolución compara lo impreso con la operación y el valor esperados.

### Arquitectura visual e interacción

- Bienvenida con reglas, meta y oportunidades.
- Barra de estado con ronda, sellos, oportunidades y pistas.
- Escaparate de tres productos elegidos desde un catálogo de diez.
- Mesa en tres piezas: producto verdadero, ticket visual y panel de decisión.
- Líneas del ticket convertidas en botones únicamente cuando debe localizarse el error.
- Pantallas diferenciadas de sello, aprendizaje, victoria y derrota.
- Credencial visual de cuatro sellos y enlaces de regreso a teoría y calculadoras.
- Color, emojis, figuras CSS y movimiento decorativo reducido cuando el sistema lo solicita.

La interfaz mantiene foco visible, nombres accesibles, estado textual, regiones vivas, objetivos táctiles amplios y composición sin desbordamiento entre 360 y 1440 px.
