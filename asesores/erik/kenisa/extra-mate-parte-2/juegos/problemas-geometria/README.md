# Problemas de geometría

Actividad 04 de Extra mate parte 2, KENISA → Erik. Acceso desde la portada o Continuar al final de Trapecios. Estática, sin dependencias nuevas ni almacenamiento persistente. Usa ../../estilos.css y los recursos globales de marca, navegación y pie. Empieza con el título; navegación de la sesión al final y sin enlaces a la parte 1.

## Enseñanza

Ejemplo de rectángulo de base doble y perímetro 24 cm: tres pasos seleccionables para elegir x, plantear 2(x + 2x) = 24 y obtener el área de 32 cm². La práctica está visible desde la carga y comienza con un cuadrado de perímetro conocido. Todos los casos y familias están disponibles sin desbloqueos. El dibujo lleva las relaciones del enunciado (x, kx, x + d), las medidas dadas y el área o perímetro conocido cuando corresponde.

El botón Ver fórmulas abre un dialog modal nativo con dibujos de rectángulo, cuadrado, triángulo isósceles y trapecio: área, perímetro, altura perpendicular y marcas de igualdad. Cerrar, Escape o clic en el fondo devuelven al ejercicio, conservando entrada, pistas y progreso. El foco vuelve al botón que abrió la ventana; el fondo queda inerte mientras está abierta.

## Plantillas

| Caso | Relación y dato conocido | Se pide |
| --- | --- | --- |
| R1 | b = kx, h = x, perímetro | Área |
| R2 | b = x + d, h = x, perímetro | Altura o base |
| R3 | b = kx, h = x, perímetro | Altura o base |
| R4 | b = x + d, h = x, perímetro | Área |
| C1 | Perímetro de cuadrado | Lado |
| C2 | Perímetro de cuadrado | Área |
| C3 | Área cuadrada perfecta | Lado |
| C4 | Área cuadrada perfecta | Perímetro |
| T1 | Isósceles: base x, lados kx, perímetro | Base |
| T2 | Isósceles: base x, lados x + d, perímetro | Base |
| T3 | Dos lados iguales conocidos y diferencia con la base | Perímetro |
| T4 | Lados x, x + d, 2x, perímetro | Primer lado |
| TR1 | Bases x y x + d, altura y área | Base menor |
| TR2 | Bases x y kx, altura y área | Base menor |
| TR3 | Base menor, diferencia entre bases y altura | Área |
| TR4 | Área, altura y base menor | Base mayor |
| TR5 | Isósceles: bases x y x + d, laterales y perímetro | Base menor |
| TR6 | Isósceles: bases x y 2x, laterales y perímetro | Base menor |

modelo.mjs construye primero dimensiones enteras y luego los datos conocidos. k es principalmente 2 y ocasionalmente 3; diferencias pequeñas y lados de cuadrado entre 4 y 12. Las alturas de los problemas de área de trapecio son pares, de modo que 2A/h y las demás operaciones requeridas son enteras. T4 usa x entre 4 y 9 y d entre 1 y 3, asegurando desigualdad triangular. En TR5/TR6 el lateral supera la mitad de la diferencia de bases, así que el trapecio existe. Su altura puede ser irracional internamente, pero no se pide, no se muestra ni se necesita.

La mezcla elige entre rectángulos/cuadrados, triángulos y trapecios. T4 tiene menor peso que los isósceles y TR1 tiene mayor peso dentro de trapecios. Cada caso varía medidas y varias plantillas también cambian unidades, contexto o redacción. No se evalúa texto como código. figuras.mjs crea SVG a partir de la geometría: solo labels antes de resolver; solvedLabels tras acertar. La solución y sus ecuaciones no se insertan en la práctica hasta el acierto, salvo la ecuación orientadora de la tercera pista solicitada.

## Interacción

Respuesta final entera mediante Enter o Comprobar. Se responde lo solicitado, que no siempre es x. Tres pistas progresivas sin respuesta numérica: significado, fórmula y planteamiento; resaltan las etiquetas de la figura. Verde y ✓ al acertar; rojo y × temporal de 1.1 s al fallar. Reintentos sin límite. Al acertar se completan las medidas y aparecen los pasos resueltos.

Cuatro aciertos por ronda y contadores de resueltos/primer intento. Nuevo problema puede usarse siempre y no da puntos; Siguiente requiere acierto. Cada problema puntúa una sola vez. Entradas inválidas no consumen intentos. Cambiar filtro conserva los contadores pero reinicia respuesta y pistas. Recargar reinicia la actividad. Sin botón de comienzo, cronómetro ni niveles bloqueados. Etiquetas accesibles, estados aria-live, foco visible y diseño móvil/escritorio.

## Verificación

node --test asesores/erik/kenisa/extra-mate-parte-2/juegos/problemas-geometria/modelo.test.mjs cubre 18000 problemas: reconstrucción independiente desde los datos dados, resultados y pasos necesarios enteros, figuras posibles, límites, variedad, SVG, filtros, reintentos y puntuación. Ejecutar npm run catalogo y npm run validar. En navegador revisar los 18 casos, pistas, modal (Escape, foco y respuesta conservada), ejemplo, teclado/tacto, errores de consola, enlaces y anchos 360/768/1024/1440.
