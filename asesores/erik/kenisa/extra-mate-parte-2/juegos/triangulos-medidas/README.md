# Triángulos: área y perímetro

Primera actividad de Extra mate parte 2, KENISA → Erik.

## Enseñanza

Cinco tarjetas con ejemplos ilustrados: tres lados → perímetro; base y altura perpendicular → área; equilátero → 3 veces el lado; isósceles → dos lados iguales más base; rectángulo → perímetro o área con Pitágoras. El taller revela pasos, cambia ejemplos y anima el recorrido del contorno. Al unir dos copias del triángulo se forma un paralelogramo de base b y altura h: cada copia ocupa bh/2. El recordatorio de Pitágoras distingue hipotenusa y catetos, suma de cuadrados para c y resta para un cateto.

## Generación y matemáticas

modelo.mjs genera cinco familias; rectángulos tiene cuatro variantes: falta hipotenusa para P, falta cateto para P, falta cateto para A, y dos catetos para A. Usa ternas (3,4,5), (5,12,13), (8,15,17), (7,24,25), (20,21,29) escaladas por 1–3. Lados, alturas dadas y respuestas son enteros. Los demás triángulos cumplen la desigualdad triangular; las coordenadas se deducen de sus medidas. La altura de un isósceles/equilátero puede ser irracional internamente, pero nunca se solicita ni se presenta como dato.

Las marcas representan longitudes iguales. Solo se muestra un lado en el equilátero y dos datos en el isósceles. Los incógnitos de Pitágoras se revelan al acertar. Las áreas se expresan en unidades cuadradas y los perímetros en unidades lineales.

## Interacción

Filtro de cinco casos o mezcla, ejercicios nuevos sin límite, cuatro aciertos por ronda y progreso acumulado. Nuevo ejercicio permite saltar sin puntos. Enter comprueba; acierto verde con ✓, error rojo con × temporal de 1.1 s, pista y reintentos. Los campos inválidos no gastan intentos y un reto nunca puntúa dos veces. Siguiente requiere acierto. Sin reloj ni persistencia: recargar reinicia.

SVG accesible, foco visible, formularios con etiquetas, controles de 48 px y movimiento reducido. CSS propio más ../../estilos.css de esta sesión; recursos globales de identidad. No modifica ni depende de estilos de Extra mate parte 1.

## Verificación

node --test asesores/erik/kenisa/extra-mate-parte-2/juegos/triangulos-medidas/modelo.test.mjs comprueba 5000 problemas, geometría compatible, soluciones enteras, cuatro variantes de Pitágoras y puntuación. Ejecutar también npm run catalogo y npm run validar. Revisar casos, pasos, animaciones, todos los filtros, teclado, móvil/escritorio 360/768/1024/1440, consola y enlaces, incluida la entrada desde KENISA.

La práctica aparece directamente, sin botón de inicio. La navegación final continúa hacia ../cuadrados-rectangulos/index.html, actividad 02 de esta sesión.

La página comienza con el título, sin migas de navegación ni leyenda de actividad encima. Los enlaces de sesión están al final.
