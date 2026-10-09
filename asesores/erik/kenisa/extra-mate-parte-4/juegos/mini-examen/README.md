# Mini examen

Actividad 03 de **Extra mate parte 4**, KENISA / Erik. Entrada: index.html, con práctica en #practica y evaluación en #examen. Tiene tarjeta propia en la portada y se accede también con Continuar al final de Congruencia de triángulos. Repasa contenidos de las partes 1–4 sin importar archivos ni enlazar a esas otras sesiones.

## Recorrido

- **Práctica libre**: los 14 temas están disponibles desde el inicio. Cada ejercicio ofrece cuatro opciones, pista, feedback inmediato, reintentos y Nuevo ejercicio. Un error descarta solo esa opción; un acierto cuenta una vez y permite pasar al siguiente. Los contadores de resueltos y aciertos al primer intento son independientes por tema.
- **Mini examen**: 28 preguntas mezcladas, exactamente dos de cada tema y con casos distintos dentro de cada pareja. Se ve una pregunta a la vez. Cualquier respuesta queda fijada, sin posibilidad de cambiarla; un error queda tachado en rosa. Siguiente requiere haber respondido. Sin reloj.
- **Resultado**: aciertos, calificación entre 1 y 100, resumen por tema y revisión desplegable con pregunta, dibujos, respuesta elegida, opción correcta y explicación. El filtro muestra inicialmente los errores. Cada tema enlaza a su práctica conservando el resultado. Otro mini examen genera un intento nuevo.

La calificación es max(1, redondear(aciertos × 100 / 28)), conforme a la escala solicitada de 1–100; cero aciertos produce 1. No hay penalización adicional. El examen se crea al abrir su modo y solo se reemplaza al pulsar un control explícito de reinicio.

## Los 14 temas

1. Tipos de ángulos: nulo, agudo, recto, obtuso, llano, cóncavo y completo/perigonal. Los dibujos distinguen 0° y 360°.
2. Paralelas: correspondientes, alternos internos/externos, colaterales internos/externos, adyacentes y opuestos por el vértice. Se resaltan solo los dos sectores preguntados, con letras A y B.
3. Triángulos: clasificación por lados o por ángulos, con medidas geométricamente correctas. La cuarta opción es No es un triángulo.
4. Ángulos de triángulos: dos interiores para hallar el tercero; interiores para hallar un exterior; exterior para hallar el adyacente o un interior remoto. Solo sumas de 180°, sin trigonometría ni Pitágoras.
5. Cuadriláteros: pistas y cuatro figuras con nombre. Cuadrado, rectángulo, rombo, romboide, trapecio y trapezoide, con condiciones que determinan una única opción.
6. Trapecios: isósceles, rectángulo o escaleno, con los cuatro lados medidos y marcas de ángulo recto. La cuarta opción es No es un trapecio.
7. Círculo: cuerda, diámetro, radio, tangente, secante, circunferencia y arco.
8. Perímetros: cuadrado, rectángulo, trapecio con todos sus lados y circunferencia con radio.
9. Áreas: cuadrado, rectángulo, trapecio con bases y altura perpendicular, y círculo con radio.
10. Nombres de polígonos regulares de 3–12 lados: figura a nombre, nombre a figura o conteo de lados.
11. Nueve partes de polígonos regulares de 3–9 lados: elegir palabra o dibujo. No se dibujan diagonales en triángulos.
12. Fórmulas de polígonos regulares: perímetro, área, diagonales desde un vértice y totales, ángulos central/interior/exterior y suma interior. Siempre aparece la figura con su nombre. Hay 13 variantes.
13. Semejanza y congruencia: triángulos con lados y ángulos, a escala común, incluyendo giros y reflejos. Opciones Semejantes, Congruentes, Ninguno y No son triángulos.
14. Ecuaciones lineales ax+b=c, con sumas, restas o múltiplos sencillos y solución entera positiva.

## Convenciones y exactitud

- Trapecio tiene exactamente un par de lados paralelos; trapezoide, ninguno. Se distingue trapecio rectángulo del escaleno: este último tiene laterales distintos y ningún ángulo recto.
- En cuadriláteros se pide el nombre específico: las pistas del rectángulo excluyen cuatro lados iguales; las del rombo excluyen ángulos rectos; las del romboide excluyen ambos casos. En triángulos se indica igualmente el nombre más específico.
- El diámetro también es una cuerda; por eso el círculo pide el nombre más específico. La cuerda mostrada no pasa por el centro. La secante lleva flechas y continúa fuera, mientras la cuerda termina en el borde.
- En el tipo 13, Congruentes es la respuesta específica si el tamaño coincide; Semejantes se reserva explícitamente para igual forma con distinto tamaño. Los ángulos mostrados se redondean a dos decimales a partir de la geometría real.
- Los resultados numéricos correctos son enteros; los círculos conservan π y las unidades. No se pide escribir decimales ni utilizar una calculadora.
- Las apotemas del área regular proceden de la geometría real y se redondean a una décima cuando no son exactas. Se muestran ≈ y la indicación de calcular el área aproximada con los datos presentados. Las combinaciones se eligen para que ese cálculo produzca un entero; no se asignan apotemas incompatibles con el lado. El cuadrado utiliza una apotema exacta.
- Los trapecios tienen lados enteros construidos con ternas geométricas válidas. La construcción interna no se convierte en un ejercicio de Pitágoras.

## Generación, estado e interacción

modelo.mjs contiene 238 casos estructurales. Cada tema consume una bolsa mezclada completa antes de repetir casos; el siguiente ciclo evita repetir inmediatamente el último. Nombres intercala los diez números de lados, partes intercala los nueve conceptos y paralelas intercala las siete relaciones. Se generan además medidas, orientaciones y distractores variables. El examen usa una bolsa nueva e independiente de la práctica.

El avance vive solo en memoria durante la visita. Cambiar de modo o tema lo conserva; recargar lo reinicia. No hay envíos, persistencia ni almacenamiento de respuestas. Los errores de práctica usan rosa y una × temporal; los aciertos usan verde y ✓. En examen la tachadura permanece. No se usa rojo ni se depende solo del color.

Los controles nativos funcionan con teclado, tacto y ratón. El foco pasa a Siguiente tras responder, a la nueva pregunta al avanzar y al encabezado del resultado al terminar. Las opciones visuales tienen un encuadre cercano para móvil. Se conserva el menú global con Escape, logo, pie, enlace de salto y controles flotantes. No se muestra un botón previo para desbloquear la práctica.

## Archivos y dependencias

- index.html y estilos.css: dos modos, práctica, examen, resultado y revisión; estilo local que importa la familia de laboratorios.
- modelo.mjs: catálogo, generadores, bolsas y estado de respuesta/calificación, sin DOM.
- figuras.mjs: SVG nativos para ángulos, paralelas, círculos, polígonos y cuadriláteros; reutiliza la geometría de triángulos de ../../recursos/.
- script.mjs: presentación y navegación por hash; la revisión dibuja sus opciones al abrir cada pregunta.
- modelo.test.mjs: pruebas matemáticas, geometría, variedad y estados.
- juego.json: mantener id extra-mate-4-kenisa-mini-examen, sesión extra-mate-parte-4-kenisa-erik y usuario kenisa-erik.

No hay bibliotecas nuevas. Reutiliza matematicas-triangulos.mjs, figuras-triangulos.mjs y laboratorio-triangulos.css; no utiliza practicas-triangulos.mjs. Antes de modificar recursos compartidos, leer su README y revisar los consumidores afectados.

## Verificación

Desde la raíz: node --test asesores/erik/kenisa/extra-mate-parte-4/juegos/mini-examen/modelo.test.mjs. Las cuatro pruebas cubren 5 950 preguntas, bolsas completas, geometría y soluciones, 80 exámenes equilibrados, respuestas bloqueadas, calificaciones extremas y reintentos de práctica.

Ejecutar npm run catalogo y npm run validar. Revisar a 360, 768, 1024 y 1440 px los 14 temas, figuras y cuatro opciones, examen completo y revisión, filtros, cambios de modo, reinicios, teclado, Enter, Escape, consola y enlaces desde portada y congruencia. Comprobar que no haya desbordamiento ni etiquetas cortadas.
