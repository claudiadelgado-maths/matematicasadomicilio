# Extra mate parte 2

Sesión independiente de KENISA → Erik, fecha 2026-10-02. Portada visual con título e ilustración lateral y cuatro tarjetas de actividad. La navegación enlaza sus propias actividades y el casillero de KENISA, sin enlaces a Extra mate parte 1. El casillero descubre la sesión mediante sesion.json y npm run catalogo.

- juegos/triangulos-medidas/index.html: cinco casos de área/perímetro, altura perpendicular, lados iguales y Pitágoras con enteros. Ejemplos y práctica con filtros, visible sin botón de inicio. Al final enlaza a la actividad 02.
- juegos/cuadrados-rectangulos/index.html: área y perímetro, laboratorio de diagonales con Pitágoras y respuestas exactas en forma de entero o raíz. Dos juegos visibles desde la carga, filtros y generación ilimitada.

- juegos/trapecios-medidas/index.html: laboratorio con bases, altura y desplazamiento; once casos seleccionables (cinco de área y seis de perímetro), Pitágoras con enteros, pistas y práctica ilimitada. Acceso desde la portada o Continuar al final de Cuadrados y rectángulos.

- juegos/problemas-geometria/index.html: 18 plantillas sencillas con respuestas enteras, dibujos de las relaciones con x, ejemplo guiado, modal Ver fórmulas, pistas progresivas y práctica ilimitada. Continúa desde Trapecios.

Las actividades comienzan con su título, sin rutas de migas ni leyendas de actividad encima. La navegación de la sesión está al final.

Cada actividad conserva su README y juego.json. No hay componentes vacíos, bloqueos de niveles, persistencia ni dependencias nuevas. Las explicaciones y ejercicios están integrados en los juegos: componentes.juegos=true; no existen carpetas separadas de explicación/ejercicios.

Estilos compartidos: estilos.css, consumido por las cinco páginas; la portada usa reglas adicionales bajo .session-home para no cambiar las actividades. Recursos globales para marca, navegación, pie y botones flotantes. Rutas relativas con index.html.

Ejecutar los modelo.test.mjs de las cuatro actividades, npm run catalogo y npm run validar. Revisar las cinco páginas a 360/768/1024/1440 px, teclado, tacto, consola y enlaces, incluido el acceso desde KENISA.
