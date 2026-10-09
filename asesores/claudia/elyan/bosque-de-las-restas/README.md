# El bosque de las restas

Segunda sesión de Elyan (8 años, 3.º de Primaria) con Claudia. ID `bosque-restas-elyan`. Entrada `index.html`; publicada el 2026-10-07. Sitio estático, sin dependencias de producción ni servicios externos.

## Contenido real

- `juegos/aventura/`: una aventura de 55 misiones y 11 rangos que enseña a restar e intercambiar recursos con un tablero de frutas. Ventana de juego inmersiva, premios de tres estrellas y respuestas exclusivamente con botones + y −, también en el último mundo.
- `ejercicios/tres-cifras/`: restas generadas de tres cifras por dificultad, con respuestas de teclado e intercambios manuales.
- `calculadoras/paso-a-paso/`: operandos del 0 al 999, resolución paso a paso o completa, incluidos préstamos a través de ceros.

Las tres columnas mantienen el orden C, D, U: hojas (100), plátanos (10), manzanas (1). Internamente las listas se ordenan U, D, C. No se permiten cantidades ni resultados negativos. Los primeros diez pedidos son restas independientes de montones, que pueden contener hasta 20 recursos; no se presentan como un número de tres cifras.

El tablero de la aventura tiene una franja de títulos (hojas, plátanos, manzanas) y tres franjas horizontales: **TIENES**, **ENTREGAS** y **TE QUEDAN**. Las tres muestran dibujos individuales con cantidades exactas, incluido cero. Las frutas de la respuesta se actualizan al pulsar + y −. Una línea oscura de 7 px separa el resultado. El pedido no lleva signo menos. La práctica y la calculadora conservan la notación vertical convencional.

## Ventana de juego

Al pulsar **Jugar** desde el menú se abre una sola ventana superpuesta con la aventura en un iframe del mismo origen. El clic solicita la Fullscreen API con `navigationUI: hide`; si el navegador no la permite, la ventana ocupa el espacio visible y se puede seguir jugando. No se simula F11 ni se fuerza la orientación. El tablero se adapta a horizontal y vertical sin reconstruir la misión. En pantallas bajas se desplaza el tablero dentro del juego, manteniendo sus controles superiores e inferiores.

Mapa, colección de rangos, intercambios, pistas, opciones y premios son diálogos dentro de esa ventana. Los rangos futuros tienen candado. Cada nivel superado muestra siempre tres estrellas, avance y **Continuar**; las estrellas totales son tres por nivel completado y repetir no las duplica. La tachita cierra el juego, restaura la navegación y conserva las respuestas mientras no se recargue la página. El acceso directo a la URL de la aventura también ofrece un botón Jugar. No hay un bloque obligatorio de instrucciones iniciales.

Cada uno de los 11 rangos tiene un retrato SVG propio, con accesorios y siluetas diferentes. Se utiliza el mismo retrato en la portada, el indicador de rango, la colección y el premio de ascenso. Los pollitos evolucionan mediante cascarón, pañuelo, sombrero y birrete; los dinosaurios incorporan gafas, rayos, hojas, coronas, capa y armadura. Los dibujos son locales y no dependen de los emojis instalados en el dispositivo; los nombres siguen presentes como texto accesible.

## Recursos y límites

`recursos/modelo.mjs` contiene generación, intercambios y resolución. `interfaz.mjs` dibuja tableros, pistas y celebraciones; `mesa.mjs` coordina las interacciones comunes de aventura y práctica. `reproductor.mjs` abre y conserva la ventana desde el menú; `pantalla.mjs` encapsula la Fullscreen API y su alternativa sin pantalla completa. `bosque.css` contiene los estilos compartidos únicamente por las cuatro páginas de esta sesión. Cada página conserva su CSS de entrada, JSON y README. La ilustración y su procedencia están documentadas en `recursos/README.md`.

Dependencias globales: `recursos/css/base.css`, `recursos/js/navegacion.js` y SVG de marca. La sesión Sumas Molonas no se modifica ni se importa. Menú, pie y controles flotantes los mantiene la base del sitio.

## Progreso, privacidad y accesibilidad

`localStorage`, clave `mad-bosque-restas-v1`, guarda exclusivamente `{completadas: 0..55, semilla: entero uint32}`. No contiene identidad, respuestas ni historial personal y no se transmite. Si el almacenamiento falla, la aventura sigue en memoria y avisa de que no persistirá. Las partidas anteriores conservan la misma semilla y todas sus misiones completadas; quien tenía 45 continúa en la misión 46. Desde el menú se puede reiniciar este progreso mediante un diálogo con confirmación. No se borran otros datos.

Solo una misión nueva completada aumenta el poder. Repetir o entrenar no lo aumenta. Los 11 rangos llegan en 0, 1, 3, 6, 10, 15, 21, 28, 36, 45 y 55 misiones (cada ascenso requiere 1, 2, 3… 10 misiones adicionales); el último es **Super Dinosaurio Rex Mega pro**. No hay vidas, reloj ni penalizaciones. Sonidos sintetizados opcionales, desactivados inicialmente; todo se entiende sin audio. Animaciones breves, compatibles con `prefers-reduced-motion`; controles etiquetados, foco visible, diálogos nativos y mensajes de estado. La página exterior queda inerte mientras el juego está abierto y el foco vuelve al botón de entrada al cerrarlo. Los mensajes entre menú y juego verifican origen y ventana emisora; mantienen el progreso temporal también cuando localStorage falla.

## Verificación

Desde la raíz: `node --test asesores/claudia/elyan/bosque-de-las-restas/recursos/modelo.test.mjs`, `npm run catalogo` y `npm run validar`.

Probar las cuatro páginas a 360, 768, 1024 y 1440 px, teclado, consola y enlaces. En aventura, girar entre 768×1024 y 1024×768 con una respuesta en curso, revisar horizontal con poca altura, pantalla completa aceptada/rechazada, entrada desde el menú y directa, tachita, reapertura y foco. Recorrer las 55 misiones, comprobar cambios de mundo/rango, tres estrellas por victoria, bloqueo del mapa y rangos, repetir con otros números, deshacer, reiniciar, progreso tras recargar y error de almacenamiento. En práctica: entradas vacías/incorrectas, dificultades y nuevos retos. En calculadora: 305−178, 600−249, 100−1, 999−999, 0−0, valores inválidos y primer operando menor. La resolución paso a paso y completa deben coincidir. No publicar sin la revisión habitual del sitio.
