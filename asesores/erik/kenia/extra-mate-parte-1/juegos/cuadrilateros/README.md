# Cuadriláteros y trapecios

Actividad 4 de Extra mate parte 1, Kenia → Erik. Ruta pública `/asesores/erik/kenia/extra-mate-parte-1/juegos/cuadrilateros/`. Triángulos enlaza con Continuar y el inicio de la sesión ofrece accesos directos. Enlaces relativos con `index.html`; `#cuadrilateros`, `#trapecios` y `#practica` identifican secciones reales.

## Objetivo y convenciones

Reconocer figuras por propiedades, no orientación; distinguir lados, vértices, ángulos, altura y diagonales; usar sumas angulares e igualdad de elementos. Trabaja cuadriláteros simples convexos. Todos tienen cuatro lados, cuatro vértices y cuatro ángulos interiores que suman 360°. Una diagonal los divide visualmente en dos triángulos de 180°.

La convención coincide con la solicitud y se declara en la interfaz: paralelogramos con dos pares paralelos, trapecios con **exactamente un par**, trapezoides sin pares. El cuadrado también es rectángulo y rombo; el juego pide el **nombre más específico**. Los ejemplos de rectángulo y rombo no son cuadrados. Romboide se reserva al paralelogramo sin ángulos rectos ni cuatro lados iguales. Los trapecios rectángulos tienen laterales distintos; para separar las tres opciones, escaleno significa aquí laterales distintos **sin ángulos rectos**.

## Laboratorios

- **Cuadriláteros:** seis selectores agrupados según paralelismo; cambiar forma/tamaño y girar 30°. Se puede investigar paralelismo, lados iguales, ángulos rectos o la división que justifica 360°. Las flechas de uno/dos trazos distinguen pares paralelos; marcas iguales identifican longitudes iguales y un cuadrado señala 90°. La explicación se actualiza con la figura real.
- **Trapecios:** isósceles, rectángulo y escaleno; selectores de bases, laterales, altura, diagonales y ángulos. Ocho botones para seleccionar AB/BC/CD/DA o A/B/C/D resaltan sus conexiones. El isósceles tiene laterales iguales, ángulos iguales en cada base y diagonales iguales. El rectángulo tiene dos ángulos rectos. Todos cumplen A+D=180° y B+C=180°. AB es la base mayor y CD la menor en los ejemplos, incluso al girarlos. DH representa una altura perpendicular; H coincide con A si corresponde. Se distingue altura de lateral y diagonal, sin afirmar que las diagonales se bisecan en cualquier trapecio.

## Juegos y avance

Dos recorridos independientes de 16 retos cada uno, en cuatro rondas de cuatro:

1. Cuadriláteros: reconocer, sí/no, deducir tres pistas y calcular un ángulo usando 360°. Reconocimiento y pistas cubren los seis nombres. En los enigmas, la figura aparece solo al acertar para que no sustituya al razonamiento.
2. Trapecios: reconocer tipos, identificar partes resaltadas, sí/no y medidas basadas en propiedades (suplementarios junto al lateral, igualdad en la base del isósceles, igualdad de diagonales y rectitud).

Los dibujos varían orientación, tamaño y proporciones conservando su clasificación. Las medidas numéricas se generan desde figuras válidas: son enteras y las etiquetas coinciden con la geometría. Cada serie de sí/no tiene dos respuestas verdaderas y dos falsas. Las opciones se mezclan y son únicas.

El error muestra rojo y una × durante 1,1 segundos, con pista textual persistente y reintentos sin límite. El acierto muestra verde y ✓, una explicación y habilita Siguiente. Se cuentan retos resueltos y primer intento por separado; no se puntúa dos veces. Vacíos y entradas inválidas no consumen intentos; se acepta coma o punto decimal. Cada cuatro retos aparece un resumen. Al terminar se puede crear otra serie; desde Cuadriláteros se continúa a Trapecios y al final se vuelve a la sesión. Cambiar de recorrido conserva avance, borrador y feedback. Nueva serie reinicia solo el recorrido activo. No hay temporizador ni almacenamiento persistente.

## Implementación y accesibilidad

HTML/CSS/JS/SVG nativos, sin dependencias de producción ni peticiones externas. `modelo.mjs` calcula longitudes, ángulos, paralelismo, clasificación, transformación euclidiana y generadores. `script.mjs` controla dibujos, exploración y juegos. Mantiene la identidad de `../../recursos/geometria.css` sin modificar ese recurso. Cada página conserva estilos, README y JSON locales.

Controles HTML etiquetados de al menos 44 px, foco visible, Enter/Espacio, formularios con Enter, `aria-pressed` en selecciones y `aria-live` en observaciones y feedback. Los SVG describen propiedades y elementos relevantes sin revelar el nombre del reto. Colores acompañados de letras, marcas, símbolos y texto. No hay animaciones de movimiento; la señal de error desaparece sin mover contenido esencial. Navegación, pie y controles flotantes globales a seis niveles.

## Verificación

```powershell
node --test asesores/erik/kenia/extra-mate-parte-1/juegos/cuadrilateros/modelo.test.mjs
npm run catalogo
npm run validar
```

Las pruebas cubren 8000 figuras (convexidad, suma de ángulos, clasificaciones, giros, diagonales y perpendicularidad de la altura), convenciones, 16000 preguntas, cobertura, opciones, soluciones y avance sin duplicados. Revisar seis tipos de cuadriláteros, tres trapecios y todas las selecciones; completar ambos recorridos con reintentos, resúmenes y nueva serie; conservar borradores al cambiar; comprobar móvil, escritorio a 360/768/1024/1440 px, teclado, menú Escape, consola y enlaces desde Triángulos y el inicio.
