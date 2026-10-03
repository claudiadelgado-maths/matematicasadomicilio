# Trapecios: área y perímetro

Actividad 03 de Extra mate parte 2, KENISA → Erik. Entrada desde la portada o Continuar al final de Cuadrados y rectángulos. Comienza con su título; navegación de sesión al final, sin conexiones con Extra mate parte 1. HTML, CSS, SVG y módulos JavaScript locales, sin dependencias ni persistencia.

## Laboratorio

Bases B y b, altura h y posición horizontal ajustables. La base mayor siempre supera a la menor, siguiendo la convención de exactamente un par de lados paralelos. Altura punteada perpendicular con marca de 90°, flechas de paralelismo y marcas de igualdad en isósceles. Centrar produce un isósceles; alinear a un extremo produce un rectángulo. Área y perímetro se actualizan con los controles. Desplazar la base sin cambiar B, b, h conserva el área, aunque puede cambiar el perímetro. El laboratorio muestra longitudes exactas con raíces cuando corresponde; los ejercicios solo requieren enteros. Incluye recordatorio de Pitágoras para altura o lado inclinado.

## Casos de práctica

El primer reto es A1, para empezar con una sustitución directa. Todos están disponibles desde la carga, con selector individual o mezclas de área, perímetro y ambos. Cuatro aciertos por ronda, contadores de resueltos y primer intento. Nuevo ejercicio permite saltar sin sumar puntos; Siguiente se habilita al acertar.

| Caso | Datos entregados | Recorrido hasta la respuesta |
| --- | --- | --- |
| A1 | B, b, h | Área directa |
| A2 | B, b, L₁, trapecio rectángulo | x = B − b; hallar h por Pitágoras; área |
| A3 | B, b, L, trapecio isósceles | x = (B − b)/2; hallar h; área |
| A4 | b, h, x, y | B = x + b + y; área |
| A5 | B, b, y, L₁ | x = B − b − y; hallar h; área |
| P1 | Cuatro lados | Perímetro directo |
| P2 | B, b, L, trapecio isósceles | P = B + b + 2L |
| P3 | B, b, h, trapecio rectángulo | x = B − b; hallar L₁; perímetro |
| P4 | b, h, x, y | Hallar B y ambos laterales; perímetro |
| P5 | B o b, x, y, L₁, L₂ | Hallar la otra base; perímetro (dos variantes) |
| P6 | b, x, L, trapecio isósceles | B = b + 2x; perímetro |

modelo.mjs construye las figuras desde ternas pitagóricas y pares de triángulos con altura compartida. No se generan al azar para luego descartar soluciones irracionales. Bases de igual paridad aseguran que incluso el promedio de las bases sea entero. A1 y A4 pueden tener laterales irracionales internos, que nunca se muestran ni se necesitan. En rectángulos, el lateral vertical está a la derecha; x y el lado inclinado están a la izquierda.

El SVG usa medidas proporcionales, alturas auxiliares y segmentos x/y según el caso. En isósceles se marca x en ambos extremos. datosFigura entrega solo los valores dados y las incógnitas necesarias; ni texto visible ni descripción accesible revelan los datos ocultos. Al acertar se completan las incógnitas y se muestran los pasos numéricos.

## Interacción y accesibilidad

Respuesta entera con Enter o Comprobar. Verde y ✓ al acertar; rojo y × temporal de 1.1 segundos al fallar. Pistas de procedimiento y reintentos libres, sin revelar resultados antes del acierto. Entradas vacías, decimales o inválidas no consumen intentos. Un ejercicio puntúa una sola vez. Cambiar de caso conserva contadores, reinicia el reto y mantiene el foco en el selector. Sin botón de comienzo, bloqueos ni reloj. Formularios etiquetados, SVG accesible, mensajes aria-live y foco visible. Estilos propios más ../../estilos.css y recursos globales de identidad.

## Verificación

node --test asesores/erik/kenisa/extra-mate-parte-2/juegos/trapecios-medidas/modelo.test.mjs comprueba 11000 ejercicios: geometría, datos mínimos por caso, reconstrucción de soluciones solo con datos dados, todos los pasos esperados enteros, las dos variantes de P5, variedad, invariancia del área, filtros y puntuación.

Ejecutar npm run catalogo y npm run validar. Revisar escritorio/móvil, selector con los once casos, controles del laboratorio, teclado/tacto, reintentos, señal temporal, solución, progreso, consola y enlaces de las cuatro páginas de la sesión.

Continuar a problemas enlaza a ../problemas-geometria/index.html, actividad 04 de esta sesión.
