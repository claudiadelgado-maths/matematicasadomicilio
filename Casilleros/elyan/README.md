# Casillero de Elyan

Alumno de 8 años y 3.º de Primaria. ID `elyan-claudia`.

Tres sesiones publicadas:

- **Tablas de multiplicar**, dos juegos sin cronómetro: diez niveles de sumas repetidas con saltos y desbloqueos, más trivia ordenada o mezclada de las tablas 1–10. Solo las metas del camino se guardan localmente; ver su README.
- **✨ Sumas Molonas**, laboratorio con menú de seis juegos: Saltitos, Forma el número, Elige los billetes, Cambio de billetes, Sumas verticales y calculadora Paso a paso.
- **🍃 El bosque de las restas**, aventura de 55 misiones y 11 rangos con evolución de personaje, práctica de tres cifras y calculadora paso a paso.

Las tarjetas proceden de `academia.json`, mediante `Casilleros/recursos/js/alumno.js`, como en el casillero de Luca.

Usa base.css, navegacion.js y SVG de marca globales. Estilos locales. El casillero no almacena datos. La sesión del bosque guarda solo progreso y semilla en el navegador, como documenta su README; no registra respuestas ni datos personales. Verificar entrada desde la portada, las tres tarjetas de sesión, vuelta al casillero y presentación móvil.

## Identidad del banner

México: verde, crema y rojo; papel picado, nopales y flores de inspiración popular.

`recursos/identidad.css` y los dos SVG decorativos de `recursos/` se comparten únicamente entre la portada y este índice. El nombre sigue siendo texto HTML accesible. Los adornos se acomodan a las esquinas en móvil; la portada conserva la escala del 75 % y la paginación de 7. El banner interior usa el mismo diseño a tamaño completo. Los recursos no se cargan en las sesiones ni cambian sus reglas, contenido o estilos.

Al editar esta identidad, revisar ambos consumidores a 360, 768, 1024 y 1440 px: nombre legible, adornos completos, teclado, menú y Escape, enlaces a las sesiones, consola y ausencia de desplazamiento horizontal. Ejecutar `npm run catalogo` y `npm run validar`.
