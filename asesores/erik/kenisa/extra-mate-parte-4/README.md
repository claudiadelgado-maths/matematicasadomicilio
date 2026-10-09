# Extra mate parte 4

Sesión independiente de KENISA (casillero de Erik), con fecha editorial 2026-10-09. Tiene una portada visual y tres actividades publicadas: **Triángulos semejantes**, **Congruencia de triángulos** y **Mini examen**. No se muestran tarjetas ni componentes vacíos.

## Contenido

- Portada propia con accesos a exploración, criterios y práctica.
- [Triángulos semejantes](juegos/triangulos-semejantes/index.html): animación ABC/AXY, correspondencias, explorador AA/LAL/LLL y tres modos de práctica ilimitada.
- [Congruencia de triángulos](juegos/triangulos-congruentes/index.html): clon desplazable, giratorio y reflejable, superposición, criterios LLL/LAL/ALA y tres modos de práctica ilimitada. Acceso propio en el menú y Continuar desde semejanza.
- [Mini examen](juegos/mini-examen/index.html): práctica libre de 14 temas de Extra mate partes 1–4 y examen aleatorio de 28 preguntas (dos por tema), siempre con cuatro opciones. Incluye respuestas definitivas, calificación de 1–100, revisión y accesos a practicar por tema. Acceso propio en el menú y Continuar desde congruencia.
- Casos y orientaciones seleccionables desde el inicio; sin bloqueos ni botón previo para empezar retos.
- Paleta morada, turquesa, azul, verde y rosa, sin rojo. SVG locales, teclado, tacto y movimiento reducido.

La explicación y los ejercicios están integrados en el juego. Por eso sesion.json declara únicamente juegos como componente independiente. No hay dependencias de las partes 1, 2 o 3 ni enlaces entre esas sesiones.

## Archivos y mantenimiento

- index.html: portada; estilos.css: diseño local de la sesión.
- sesion.json: conservar id extra-mate-parte-4-kenisa-erik, slug extra-mate-parte-4, usuario kenisa-erik, ruta /asesores/erik/kenisa/extra-mate-parte-4/ y fecha editorial.
- juegos/triangulos-semejantes/: actividad, modelo matemático, SVG, pruebas y metadatos propios. Leer su README antes de modificarla.
- juegos/triangulos-congruentes/: generador propio de congruencia, animación del clon, pruebas y metadatos.
- juegos/mini-examen/: 238 casos estructurales, generadores, dibujos, modos de práctica/examen y pruebas propias.
- recursos/: aritmética exacta, geometría SVG y CSS reutilizados por las tres actividades; interfaz de práctica compartida por los dos laboratorios de triángulos. Leer recursos/README.md y revisar los consumidores afectados al modificarlos.
- Mantener navegación, logotipo, pie, enlace de salto y controles flotantes del script global. Rutas relativas con directorios e index.html.

Sitio estático sin bibliotecas nuevas, compilación, servicios externos ni almacenamiento de respuestas. Los contadores de práctica se conservan al cambiar de pestaña mientras la página permanece abierta; se reinician al recargar.

## Verificación

Desde la raíz: ejecutar node --test para modelo.test.mjs de las tres actividades; después npm run catalogo y npm run validar. Probar menú y actividad a 360, 768, 1024 y 1440 px, teclado/Enter/Escape, cambio de orientación, fracciones equivalentes, reintentos y nuevos retos. Revisar consola, enlaces, movimiento reducido y ausencia de desbordamiento. En Mini examen, comprobar las 28 respuestas, bloqueo, calificación, revisión, filtros y conservación del estado al cambiar de modo.
