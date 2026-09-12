# Examen Matemáticas · Raúl

Sesión integrada en una sola página para `raul-erik`. Se registra en el casillero mediante `sesion.json`. Diseño propio de examen, con navegación y pie globales. No modifica las sesiones anteriores.

## Recorrido

La entrada ofrece **Modo normal** y **Modo con ayuda**. Ambos presentan una pregunta mezclada, expresión grande, cuatro opciones A–D y Responder. No se muestran familias, subtipos ni dificultad. No hay temporizador, extensión fija ni calificación persistente; el alumno puede continuar tantas preguntas como quiera. El contador de aciertos considera únicamente el primer intento de cada pregunta.

Ambos modos muestran Usar ayuda desde el inicio, antes o después de responder. La selección de modo conserva el nombre del recorrido, pero no bloquea la sustitución. Conserva la pregunta original y permite probar valores, volver a elegir una respuesta o avanzar. Cambiar modo vuelve a la entrada; iniciar otro modo reinicia los contadores. No almacena respuestas ni envía datos.

## Banco dinámico

`generador.mjs` implementa 42 estructuras parametrizadas: A1–A10, B1–B10, C1–C10, D1–D10 y B11–B12 con residuo. Las denominaciones son exclusivamente internas. Cada estructura cambia coeficientes, signos, constantes o soluciones; las de dos variables pueden usar x/y o a/b y algunas de una variable usan t. La dificultad interna es easy/hard.

| Familia interna | Cobertura |
| --- | --- |
| A1–A3 | Sistemas enteros positivos, restas y soluciones con negativos. |
| A4–A6 | Coeficientes fraccionarios en ambas ecuaciones, una ecuación o un único coeficiente. |
| A7–A10 | Soluciones y términos independientes racionales, signos mixtos y ecuación escalada. |
| B1–B3 | Productos desde divisor lineal y cocientes lineales/cuadráticos. |
| B4–B6 | Dividendo de grados 4/5, divisor cuadrático, términos faltantes y desordenados. |
| B7–B10 | Dos variables homogéneas, signos mixtos, coeficientes mayores y racional ocasional. |
| B11–B12 | Divisor lineal/cuadrático, residuo no nulo de grado menor; pregunta por cociente o residuo. |
| C1–C5 | Denominadores monomiales/binomiales, dos o tres fracciones, signos y términos semejantes. |
| C6–C10 | Resultado constante o 1, dos variables, denominador cuadrático y coeficiente racional ocasional. |
| D1–D4 | Diferencia de cuadrados, factor lineal común, resultado constante/lineal sobre denominador. |
| D5–D7 | Dos variables y diferencia de cuadrados, factor común numérico/algebraico y trinomio factorizable. |
| D8–D10 | Diferencias de cuadrados en numerador/denominador, tres fracciones con signos mixtos y términos desordenados. |

El banco mezcla bolsas barajadas A/B/C/D, cada familia con un cuarto de las preguntas. No permite repetir familia entre bolsas. Evita la última plantilla de cada familia y enunciados de las últimas veinte preguntas. Las variantes fraccionarias B10/C10 ocupan una fracción pequeña del examen. No utiliza una lista fija de ejercicios ni expone la familia en HTML.

## Validación algebraica

`algebra.mjs` opera con coeficientes racionales BigInt y polinomios canónicos de dos variables. Suma/multiplicación simbólica exacta; las fracciones se comparan por productos cruzados de polinomios. No se utiliza muestreo numérico como demostración de identidad, coma flotante para coeficientes ni eval de entradas.

Cada pregunta se valida antes de mostrarse: cuatro opciones, ninguna pareja de opciones equivalente, una única correcta, denominadores no idénticamente nulos y suficientes puntos sencillos del dominio para investigar. Si falla, se descarta y regenera con un límite de seguridad.

- Sistemas: se elige la solución y se construyen las ecuaciones. Se verifica determinante no nulo y exactamente una pareja que satisfaga ambas.
- División: se construye P = DQ + R; en exactas R = 0. Se comprueba la identidad y grado(R) < grado(D). Los problemas con residuo conservan internamente la parte complementaria para la comprobación numérica de la ayuda; no se imprime como dato debajo del problema.
- Fracciones: se construye el numerador combinado desde el resultado, incluyendo los factores que se cancelan. Se conserva el dominio de la expresión original aunque una opción simplificada ya no muestre esos factores.
- Distractores: signos, coeficientes, términos o denominadores modificados. Se filtran simbólicamente las equivalencias disfrazadas.

## Sustitución

`ayuda.mjs` acepta enteros, decimales con punto/coma o fracciones exactas; hasta 24 caracteres por entrada y valores entre −1000 y 1000. Todas las variables de la expresión y las opciones se sustituyen en la misma prueba. Los valores siempre aparecen entre paréntesis antes de evaluar, incluidos negativos y fracciones.

Cada tarjeta muestra original → sustitución literal → cálculo exacto. Las divisiones también comparan P con DQ o DQ + R. Todas las divisiones ofrecen Mostrar partes de una división: un esquema estático con cociente encima, divisor a la izquierda, dividendo dentro y residuo debajo. Para sistemas se prueban ambas ecuaciones de una pareja escrita o elegida mediante Probar A–D; las opciones ya son parejas numéricas y no se calculan todas automáticamente.

Se rechazan valores que anulen un denominador original, sin modificar pregunta, contador o historial. Una opción indefinida se identifica solo para esa prueba, sin concluir por ello que sea incorrecta. Se informa de coincidencias numéricas entre opciones y de cuáles coinciden en esa prueba, sin presentarlo como prueba algebraica. Las pruebas anteriores quedan accesibles en desplegables al generar nuevas. No se muestra el procedimiento tradicional ni se marca la opción correcta automáticamente al abrir la ayuda.

## Renderizado y accesibilidad

KaTeX 0.18.1 con los mismos recursos CDN e integridad utilizados por las sesiones existentes. LaTeX generado desde el árbol matemático, con displaystyle, fracciones verticales y exponentes entre llaves. Si KaTeX no está disponible, el mismo árbol produce MathML nativo, sin dejar comandos LaTeX crudos. No añade paquetes de ejecución ni depende de otra sesión.

Opciones con radios nativos, etiquetas completas, teclado (Tab, flechas y espacio), foco visible, estados anunciados, errores de dominio con role=alert y animación respetuosa de movimiento reducido. Las expresiones largas se desplazan dentro de sus tarjetas en móvil, sin desbordar toda la página.

## Archivos y pruebas

- `index.html`, `estilos.css`: página y diseño local.
- `algebra.mjs`: aritmética racional, polinomios, expresiones, LaTeX y MathML.
- `generador.mjs`: estructuras, distractores, validación y mezcla.
- `ayuda.mjs`: evaluación de pruebas y coincidencias numéricas.
- `vista.mjs`: presentación matemática y tarjetas de ayuda.
- `examen.mjs`: flujo de modos, respuestas y pruebas.
- `pruebas.test.mjs`: 1,260 instancias de las 42 estructuras, mezcla de 200 preguntas, dominio, sistemas y coincidencias accidentales.
- `sesion.json`: sesión publicada; componentes opcionales falsos porque el examen y la ayuda están integrados aquí.

Comandos: `node --test asesores/erik/raul/examen-matematicas/pruebas.test.mjs`, `npm run catalogo`, `npm run validar`. Revisar flujo normal/asistido, acierto/error, reintento, varias pruebas, dominio, ecuaciones y residuo, 360/768/1024/1440 px, consola, menú y enlaces de regreso.

La detección de variables recorre el árbol original sin simplificar: una variable que se cancela sigue visible y tiene su campo de sustitución. La regresión D8 cubre este caso.
