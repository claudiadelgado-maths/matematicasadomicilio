# Misión polígonos

Juego de `extra-mate-parte-3-kenisa-erik`, usuario `kenisa-erik`. Ruta pública: `/asesores/erik/kenisa/extra-mate-parte-3/juegos/mision-poligonos/index.html`.

## Aprendizaje e interfaz

Galería de 3–12 lados con ampliación 13–20, inspector y conteo animado de lados. Los nombres dependen del número de lados; todos los dibujos son regulares. Para 4 se enseña «Cuadrilátero» y se aclara que el regular es el cuadrado. Para 13–19 se usa «Polígono de n lados»; 20 es icoságono. No se trabajan medidas, partes adicionales ni fórmulas.

El botón Jugar abre un `dialog` nativo casi de pantalla completa; X o Escape lo cierra y restaura la posición y el foco en la sesión. Recorrido de 18 jefes: niveles 3–20, con el N-ágono en el nivel N. Las defensas se generan inicialmente entre 3–12 lados; el selector permite 3–20 en cualquier nivel. El rango de defensas no limita los lados del jefe. El nombre aparece bajo la nave, dentro del campo. No hay panel lateral, tarjeta de turno, botón textual Disparar ni pistas. La nave, el rival >:v, el fondo espacial y las partículas dan una presentación arcade. Los tableros se regeneran sin límite ni reloj; no hay castigos por tiempo o intentos.

Cada defensa tiene tantos vértices como indica su número, incluso las figuras acumuladas. La paleta compartida usa turquesa, azul, verde, violeta, amarillo y rosa: ni el conteo ni los errores usan rojo. Los aciertos producen partículas de esos colores; los errores rebotan hasta apilarse y muestran un aviso rosa. La victoria se superpone al campo con «¡VICTORIA!» y solo dos opciones visibles: «Continuar» y «Repetir», manteniendo su posición y dimensiones. Continuar avanza al siguiente nivel y Repetir reinicia el nivel actual. Tras el 20-ágono, Continuar lleva a `../partes-poligonos/index.html`, la actividad 02 de la misma sesión, y Repetir permite jugar desde el inicio. El enlace a las partes no aparece junto al avance de nivel; se conserva también en la navegación inferior de la sesión. El botón del siguiente nivel recibe el foco sin desplazar el campo; tras el último jefe lo recibe Continuar. Todos participan en el ciclo de teclado del diálogo.

## Reglas del motor

1. Se generan cinco columnas de cuatro defensas (20 en total) poligonales. Cada número es aleatorio uniforme dentro del rango seleccionado. Se permiten repeticiones.
2. El frente de cada columna es su bloque más bajo: el primero con el que choca el proyectil. Las alturas pueden diferir al jugar. El contorno grueso identifica los frentes.
3. El nombre del turno se elige entre los números de los frentes disponibles, evitando repetir el anterior cuando hay otra alternativa. Al abrir una columna se añade el número de lados del jefe a los posibles proyectiles y se garantiza que aparezca en tres selecciones como máximo, incluso con defensas de 3–12 y jefe de más de 12 lados. Nunca hay un turno sin objetivo correcto accesible.
4. Un acierto elimina exclusivamente el primer bloque de esa columna. Los demás conservan su posición; no se rellenan columnas ni se desplazan números lateralmente.
5. Un error conserva el objetivo y añade debajo un polígono con el número de lados del proyectil. Esa pieza ahora pertenece al frente y se retira acertando su nombre en otro turno.
6. Con seis piezas en una columna se pausa el disparo y se ofrece retirar únicamente la última figura añadida. Esto impide desbordar el tablero; conserva todos los bloques originales y los demás avances. No hay derrota ni reinicio obligatorio.
7. Una columna vacía es un camino libre al jefe N-ágono. Solo un proyectil de N lados lo derrota: el 5-ágono requiere un pentágono, por ejemplo. Un proyectil distinto rebota en el escudo rosa, conserva el tablero y prepara la figura correcta para reintentar. No es necesario destruir los 20 bloques.
8. Ganar habilita el siguiente nivel, que genera cuatro defensas nuevas por columna. Reiniciar o cambiar el rango de defensas repite el nivel actual. El recorrido empieza en 3 y termina en 20; no hay nivel 21.

El contador «bloques iniciales retirados» excluye las figuras añadidas. La colección registra nombres acertados en defensas y jefes y el contador de misiones registra victorias; ambos se conservan durante la visita, incluso al repetir o avanzar de nivel. Recargar la página reinicia todo. No se usan almacenamiento persistente, peticiones externas ni cuentas.

## Controles y accesibilidad

- Ratón o tacto: tocar/arrastrar horizontalmente en el campo, dos flechas de movimiento y botón circular con icono de lanzamiento. La página de fondo queda fija e inerte mientras el diálogo está abierto.
- Campo enfocado: flechas izquierda/derecha para mover, flecha arriba o Espacio para lanzar; se conservan también 1–5 y Enter. Los atajos solo actúan en el diálogo y respetan el selector y los botones de cierre, nueva misión, victoria y ayuda.
- Controles HTML nativos, foco visible, descripción accesible del número frontal de cada columna y anuncios de figura/resultado. El feedback combina texto, color y símbolos; la tachita rosa se retira después de 1,1 segundos. El foco de ayuda y victoria usa `preventScroll`.
- SVG con geometría exacta de 3–20 vértices. Movimiento reducido elimina los desplazamientos y el conteo progresivo, manteniendo todos los resultados.
- El disparo bloquea acciones simultáneas. Cambiar de modo o reiniciar cancela animaciones pendientes; una resolución del tablero anterior no puede modificar el nuevo. Cerrar o redimensionar el campo durante el vuelo cancela el lanzamiento sin cambiar las defensas. Reabrir conserva la partida. El SVG ajusta sus cinco columnas al espacio disponible; el apuntado táctil usa la transformación real del SVG.

## Organización y pruebas

`modelo.mjs` contiene estado y reglas puras; `figuras.mjs`, los SVG; `script.mjs`, interacción y animaciones; `estilos.css`, presentación adaptable. `juego.json` contiene los metadatos del catálogo.

`modelo.test.mjs` comprueba geometría, rangos, 600 tableros iniciales distribuidos por los niveles, acumulación y recuperación, objetivo oculto, victoria, ayuda, bloqueo de dobles disparos y cancelación segura. Además simula 300 partidas variadas y comprueba que después de los errores se puede terminar acertando. Verifica el escudo ante figuras incorrectas, la munición garantizada del jefe, ambos recorridos completos 3–20, el bloqueo de avances sin victoria y el final en 20.

Ejecutar `node --test asesores/erik/kenisa/extra-mate-parte-3/juegos/mision-poligonos/modelo.test.mjs`. Para actualizar el catálogo local, ejecutar también `npm run catalogo` y `npm run validar` desde la raíz. La comprobación de navegador debe incluir menú y galería, un disparo real con animación, victoria estable, reinicio/cierre durante vuelo, reapertura, rescate, teclado, tacto, 360/768/1024/1440 px, orientación horizontal, movimiento reducido, foco modal, ausencia de tonos rojos, enlaces y consola.
