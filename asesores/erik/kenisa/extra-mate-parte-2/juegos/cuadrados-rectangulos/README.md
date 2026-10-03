# Cuadrados y rectángulos

Actividad 02 de Extra mate parte 2, KENISA → Erik. Entrada desde el menú o Continuar al final de Triángulos. Página estática con recursos propios, más ../../estilos.css de su sesión y recursos globales de marca. No hay dependencias adicionales, almacenamiento persistente ni servicios externos.

## Contenido

Laboratorio con selección de cuadrado/rectángulo, perímetro/área y deslizadores de lados. El perímetro recorre el contorno animado y el área se representa con una cuadrícula. Cuadrado: un lado dado, P=4l y A=l². Rectángulo: dos lados dados, P=2(b+h) y A=bh.

Práctica de medidas visible desde la carga: filtros de figura y objetivo, dibujos a escala, unidades y ejercicios nuevos sin límite. El segundo laboratorio dibuja la diagonal como hipotenusa, d²=b²+h², con ejemplos 3×4 (d=5) y cuadrado de lado 1 (d=√2). Después aparece directamente una práctica independiente de diagonales.

## Raíces y validación

El botón √ Raíz activa una raíz con barra sobre el campo. La alumna escribe solo el radicando; la etiqueta accesible cambia a Número dentro de la raíz. Pulsarlo de nuevo vuelve a respuesta numérica. Se aceptan raíces sin simplificar y enteros equivalentes (5 o √25). No se solicitan aproximaciones decimales. La validación compara n con d² en modo raíz, o n² con d² en modo número: no evalúa texto ni usa tolerancias flotantes. Solo longitudes positivas pueden acertar.

Lados enteros 1–24; algunos rectángulos de diagonales usan ternas pitagóricas escaladas para alternar resultados enteros e irracionales. Cuadrados dan un lado; rectángulos dan dos lados diferentes. La explicación reconoce que un cuadrado también cumple las propiedades de un rectángulo.

## Interacción

No hay pantalla de inicio ni niveles bloqueados. Cada juego conserva sus propios aciertos y primer intento; cuatro aciertos forman una ronda. Cambiar filtro o pulsar Nuevo ejercicio no suma puntos. Verde y ✓ al acertar; rojo y × temporal de 1.1 segundos al fallar, con pistas y reintentos. Enter comprueba, no hay doble puntuación, y Siguiente se habilita al acertar. Cambiar ejercicio restablece la raíz. Recargar reinicia todos los contadores. SVG accesible, mensajes aria-live, controles de 48 px, foco visible y animación reducida según preferencias.

## Verificación

Ejecutar node --test asesores/erik/kenisa/extra-mate-parte-2/juegos/cuadrados-rectangulos/modelo.test.mjs, npm run catalogo y npm run validar. Las pruebas cubren 6000 casos, fórmulas, filtros, 3/√9 y √2, raíces enteras/irracionales, entradas inválidas y puntos únicos. Revisar navegador: ambas prácticas, todos los filtros, teclado, botón raíz, reintentos, saltos, teoría y enlaces; 360/768/1024/1440 px, consola y movimiento reducido.

La página comienza con el título, sin migas de navegación ni leyenda de actividad encima. Los enlaces de sesión están al final.
Continuar a trapecios enlaza a ../trapecios-medidas/index.html, actividad 03 de esta sesión.
