# Fórmulas del polígono

Actividad 03 de **Extra mate parte 3**, casillero KENISA, Asesoría Erik. Usuario `kenisa-erik`; sesión `extra-mate-parte-3-kenisa-erik`. Ruta pública: `/asesores/erik/kenisa/extra-mate-parte-3/juegos/formulas-poligonos/index.html`.

## Vistas y aprendizaje

Tres vistas abiertas desde el inicio, sin desbloqueos ni botón para comenzar. Se accede desde la tercera tarjeta del menú de la sesión y desde **Continuar** al final de El mapa del polígono. La navegación inferior regresa a la sesión o a la actividad anterior.

1. **Explora** (`#explora`): catálogo de siete temas para cada figura regular de 3 a 9 lados. Conserva el tema seleccionado al cambiar la figura. Incluye perímetro, área, diagonales desde un vértice, diagonales totales, tres ángulos, suma interior y triángulo de radio/apotema/medio lado. Las animaciones recorren el borde, rellenan los triángulos del área, revelan diagonales o destacan sectores angulares. Se pueden repetir y respetan movimiento reducido. Un glosario desplegable explica N, L, P, A, a, R, S, d y D.
2. **Calcula** (`#calcular`): 14 tipos seleccionables, o mezcla equilibrada. Calcula perímetro, lado, área, apotema, perímetro a partir de área, diagonales desde un vértice o totales, central/exterior/interior, relaciones entre ángulos y suma interior. En esta vista S solo se pide; nunca se da como dato.
3. **Descubre** (`#descubrir`): siete modos para encontrar N a partir de exterior, central, interior, S, d, D o P/L, más cinco despejes de apotema, lado, perímetro e interior/exterior. Al buscar N aparecen cuatro polígonos distintos de 3 a 9 lados con una única solución. El enunciado usa una figura misteriosa para no revelar el número de lados; los demás despejes sí muestran su polígono de referencia. Las diagonales totales se descubren probando los candidatos, sin ecuaciones cuadráticas.

**Pitágoras solo se muestra en el explorador**, como `R² = a² + (L/2)²`, con los tres segmentos y la escuadra. No existe ningún tipo de ejercicio de Pitágoras ni se busca R en la práctica. Los despejes de apotema utilizan `a = 2A/P`; los de lado, `L = P/N`.

## Precisión y generación

- Todos los dibujos son polígonos regulares. La apotema llega al punto medio y es perpendicular al lado; las diagonales enlazan vértices no consecutivos y cada pareja se cuenta una vez. El triángulo tiene cero diagonales.
- Las longitudes de lado para ejercicios de perímetro son 2, 4, 6 u 8 cm. Las apotemas de los ejercicios de área se obtienen de la geometría real y se redondean a una décima: no se inventan pares P/a incompatibles. Para buscar a se parte de una apotema entera (1–5 cm), se calcula y redondea P y se construye A con esos datos. La respuesta se obtiene siempre de los números mostrados. Se indican las medidas aproximadas; los cuadrados usan valores exactos. No se enseña ni se pide trigonometría.
- Los ángulos se redondean a dos decimales. Si un ángulo dado es aproximado se indica; al buscar N se conserva una única opción correcta. Para hallar interiores a partir de N se redondea solo al terminar. Los cálculos que parten de un ángulo ya redondeado utilizan ese dato visible.
- Las entradas admiten coma o punto decimal, incluyendo 0 para las diagonales del triángulo. Se rechazan campos vacíos, texto, expresiones y notación exponencial. Se espera la respuesta indicada a dos decimales cuando corresponda, no una aproximación a una sola décima.
- La mezcla recorre todos los tipos en una bolsa aleatoria, sin repetir el tipo al cambiar de bolsa. En un caso fijo, dos preguntas consecutivas cambian de polígono. Los ejercicios son ilimitados; no hay reloj ni obligación de acertar para generar otro.

## Interacción y accesibilidad

Respuesta por formulario (Enter o Comprobar) o por tarjetas visuales. Verde con ✓ al acertar; rosa con aviso, pista y tachita temporal al fallar. Se puede reintentar; un acierto se cuenta una sola vez. Las opciones erróneas de reconocimiento quedan descartadas. Cada modo conserva su pregunta, filtro y progreso al visitar el explorador. Nuevo reto y Siguiente generan preguntas nuevas; la solución aparece solo tras un acierto. La pista y fórmula están disponibles sin resolver. No hay avance automático que impida leer.

Paleta sin rojo: violeta, azul, turquesa, verde, rosa y amarillo suave. Textos y símbolos acompañan los colores. Controles HTML, foco visible, etiquetas, SVG accesibles, feedback `aria-live`, inputs decimales para móvil y navegación por teclado. El progreso vive en memoria y se reinicia al recargar, sin cuentas ni almacenamiento.

## Archivos y dependencias

- `modelo.mjs`: fórmulas LaTeX y respaldo MathML, generadores, bolsas y validación.
- `figuras.mjs`: geometría regular, diagonales únicas, sectores y SVG animados.
- `script.mjs`: vistas, exploración, respuestas, feedback y progreso.
- `index.html`, `estilos.css`, `juego.json`: interfaz local y catálogo.
- `modelo.test.mjs`: pruebas matemáticas y del generador.

Base visual de la sesión: `../../estilos.css`. Navegación, logotipo, pie y botones flotantes usan los recursos globales sin modificarlos. Se reutiliza la versión fijada de **KaTeX 0.18.1** por CDN con SRI que ya emplea la biblioteca del sitio. La aplicación no depende de su disponibilidad para funcionar: las fórmulas conservan su fracción y exponentes en MathML nativo si no hay red. No se añadieron paquetes de producción ni paso de compilación. Los estilos y scripts de las otras actividades permanecen independientes.

## Verificación

```sh
node --test asesores/erik/kenisa/extra-mate-parte-3/juegos/formulas-poligonos/modelo.test.mjs
npm run catalogo
npm run validar
```

Las pruebas cubren las 49 vistas geométricas, diagonales, perpendicularidad y ángulos; todos los cálculos a partir de los datos visibles; coherencia de medidas aproximadas; 1.400 preguntas de N con solución única; bolsas y casos fijos; ausencia de ejercicios de Pitágoras; reintentos, cero y redondeo. Revisar también las tres vistas a 360/768/1024/1440 px, interacción táctil, teclado, animaciones y movimiento reducido, MathML sin CDN, enlaces, conservación del avance, ausencia de desbordamiento y consola.
