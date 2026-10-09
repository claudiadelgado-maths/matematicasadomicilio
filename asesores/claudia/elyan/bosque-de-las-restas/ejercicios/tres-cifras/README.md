# Restas de tres cifras

Ejercicio `bosque-elyan-tres-cifras` de la sesión `bosque-restas-elyan`. Genera dos operandos de tres cifras con primero mayor o igual que segundo. Dificultades: sin préstamos, a unidades, a decenas, a través de ceros, dos préstamos y mixto.

El niño hace sus intercambios, ve tachados los valores anteriores y escribe una cifra por columna. Comprobar conserva las respuestas, identifica columnas correctas y orienta sobre las que debe revisar; las respuestas vacías no equivalen a cero. Pistas, deshacer y reiniciar disponibles. Una resta puede contarse una sola vez en el contador de práctica aunque se reinicie. Otra resta conserva la dificultad y evita repetir los mismos operandos inmediatamente.

No guarda resultados ni altera el poder de la aventura. El contador dura mientras está abierta la página. Sonidos opcionales; no son necesarios para jugar.

Lógica local en `script.mjs`; depende únicamente de `../../recursos/{modelo,interfaz,mesa}.mjs` y `bosque.css`, además de la base global del sitio. Pruebas: seis dificultades, respuestas vacías/incorrectas, ceros, préstamos manuales y deshacer, acierto, nuevos retos, reinicio sin duplicar estrellas, entrada con teclado/Enter y versión móvil.
