# La gran aventura del bosque

Juego `bosque-elyan-aventura`, componente de la sesión `bosque-restas-elyan`. Enseña a restar cantidades, intercambiar órdenes y relacionar los recursos con centenas, decenas y unidades.

## Reglas y avance

Una sola aventura, 55 misiones consecutivas:

1. Mercado, misiones 1–10: tres montones independientes; cinco con cantidades 0–9 y cinco con 0–20. El pedido nunca supera las existencias de una columna.
2. Magia, misiones 11–30: cinco préstamos a unidades, cinco a decenas, cinco a través de ceros y cinco combinados. Inventarios y pedidos iniciales son números de tres cifras. El niño pulsa los intercambios; ninguno se ejecuta automáticamente.
3. Cima, misiones 31–55: tres sin préstamos, cuatro a unidades, cuatro a decenas y catorce combinadas, con ceros garantizados. Conserva las franjas y frutas; se tachan todos los valores reemplazados. El resultado requiere una cifra por columna. Las misiones 46–55 amplían el recorrido sin alterar los retos anteriores para una misma semilla.

Tablero semántico con cuatro franjas: títulos de recursos; TIENES (verde); ENTREGAS (ámbar); TE QUEDAN (lila), esta última precedida de una barra oscura de 7 px. Cantidades sin signo menos y dibujos exactos en las tres filas; las frutas del resultado cambian con cada botón. Respuestas solo con botones + y −. Los intercambios respetan 1 C = 10 D y 1 D = 10 U. No se cambia desde una columna vacía, ni se añade otro grupo de diez si ya hay diez o más en la receptora. Deshacer revierte un cambio; Reiniciar misión restaura el inventario y respuestas. Las pistas son progresivas, sin rellenar respuestas. En el mundo 2 se aceptan descomposiciones equivalentes aunque no estén normalizadas.

Comprobar un pedido correcto desbloquea la misión siguiente y añade una chispa al poder por primera vez. Siempre abre un premio de tres estrellas, avance, nuevo rango cuando corresponde y botón **Continuar**. Los errores y las pistas no reducen las estrellas. El total equivale a tres por nivel completado, hasta 165; repetir no aumenta el total ni el poder.

Once rangos, contando el inicial; ascensos tras 1, 2, 3… 10 misiones adicionales, hasta 55 acumuladas. La barra indica cuánto falta para el siguiente rango. El botón de rango abre la colección completa con los futuros bloqueados y el actual destacado. Rangos y persistencia: README de la sesión. Completar las 55 misiones desbloquea **Super Dinosaurio Rex Mega pro**. El mapa permite repetir niveles superados y **Opciones** permite cambiar los números de la misión actual; la variante conserva su dificultad. El botón del último premio abre el mapa, sin salir del juego. Se pueden repetir todas las misiones después de terminar.

## Pantalla y ventanas

Los 11 rangos usan retratos diferentes de `../../recursos/rangos/`, dibujados en SVG con accesorios propios. `pintarIconoRango()` de `interfaz.mjs` comparte su representación entre indicador, colección y premio de ascenso; el menú de la sesión usa el mismo recurso. Las imágenes son decorativas junto al nombre textual del rango. Los retratos bloqueados se muestran en gris y mantienen el candado y la indicación de niveles pendientes.

**Jugar** solicita pantalla completa desde un gesto del usuario. En la entrada directa se muestra antes una portada con la navegación habitual; desde la sesión se utiliza el reproductor de `../../recursos/reproductor.mjs`, cuyo iframe del mismo origen carga `index.html?ventana=1`. Solo se entra automáticamente al detectar tanto ese parámetro como el contenedor del reproductor. El juego permanece utilizable si la API no existe o rechaza la solicitud. El botón ⛶ alterna la pantalla completa y ✕ cierra el juego. La orientación nunca se bloquea: cliente junto al tablero en horizontal y encima en vertical; HUD y barra de acciones permanecen disponibles y el centro puede desplazarse en pantallas bajas.

Todos los diálogos (victoria, mapa, rangos, intercambios, pista y opciones) viven dentro de `#juego-app` para funcionar en pantalla completa. No hay instrucciones iniciales superpuestas. La magia muestra el inventario actualizado, permite intercambiar y deshacer, y regresa al tablero con **Listo**. Cerrar el premio permite reabrirlo mediante **Continuar**. Escape cierra un diálogo; fuera de un diálogo y de la pantalla completa cierra el juego. Se conserva el foco dentro de la aplicación y se vuelve al botón de entrada al salir.

El iframe se conserva al cerrar para no perder respuestas parciales. Los mensajes `bosque-listo`, `bosque-cerrar`, `bosque-pausa`, `bosque-reanudar` y `bosque-progreso` verifican origen y ventana emisora. El último sincroniza la memoria del menú si no hay almacenamiento; reanudar también incorpora un reinicio del progreso realizado desde el menú. No se guardan respuestas parciales tras recargar la página.

## Archivos y pruebas

`script.mjs` controla mapa, clientes, progreso, mundos, rangos y ventanas. Usa `../../recursos/{modelo,interfaz,mesa,progreso,pantalla}.mjs` y `bosque.css`; no depende de otras sesiones. `estilos.css` contiene el diseño inmersivo, sus orientaciones y los premios. Sonidos opcionales con Web Audio, sin archivos remotos.

Verificar partida completa y recarga, mapa y rangos bloqueados, variantes, controles sin teclado numérico, ceros, deshacer y reiniciar. Probar que un error o repetir una misión no alteran el poder ni el premio de tres estrellas; confirmar rango final solo tras 55 misiones. Revisar cuatro anchuras, ambos sentidos de la tablet, horizontal de poca altura, teclado, Escape en diálogos y movimiento reducido. Probar pantalla completa real y rechazada, cierre/reapertura y reinicio desde el menú con localStorage disponible y bloqueado. Confirmar que se cargan los 11 SVG distintos y que el retrato del ascenso coincide con el indicador y la colección, también en móvil.
