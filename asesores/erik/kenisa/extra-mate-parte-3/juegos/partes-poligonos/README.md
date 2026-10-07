# El mapa del polígono

Actividad 02 de **Extra mate parte 3**, casillero KENISA de Asesoría Erik. Usuario `kenisa-erik`, sesión `extra-mate-parte-3-kenisa-erik`. Entrada pública: `/asesores/erik/kenisa/extra-mate-parte-3/juegos/partes-poligonos/index.html`.

La navegación inferior incluye **Continuar** hacia `../formulas-poligonos/index.html`, actividad 03 de la sesión.

## Alcance y acceso

Se reconocen nueve conceptos, sin fórmulas, medidas numéricas ni cálculos: lado, vértice, diagonal, ángulo interior, ángulo exterior, centro, radio, apotema y ángulo central. Todas las figuras son regulares, de 3 a 9 lados. Se mantiene la estética de la sesión, con violeta, turquesa, azul, verde y rosa, sin rojo.

Hay tres vistas accesibles desde el inicio, sin desbloqueos ni botón para comenzar los retos:

1. **Explora** (`#explora`): siete figuras y nueve partes seleccionables, más Girar figura. El concepto elegido se conserva al cambiar la figura y la figura se conserva al cambiar el concepto. Esto permite revisar las 63 combinaciones. En triángulo + diagonal se explica la excepción: el triángulo no tiene diagonales; no se dibuja una falsa diagonal. Un contador registra conceptos explorados.
2. **Elige la figura** (`#imagenes`): aparece el nombre de una parte y cuatro dibujos con conceptos distintos, polígonos y orientaciones variables. Solo uno resalta la parte pedida.
3. **Elige la palabra** (`#palabras`): aparece un dibujo y cuatro nombres distintos, uno correcto. Usa los nueve conceptos.

La portada de la sesión enlaza directamente al explorador y a la práctica. La victoria de Misión polígonos ofrece **Continuar** hacia esta actividad; también hay un enlace al final de aquella página. Esta actividad conserva enlaces al menú de la parte 3 y al juego anterior.

## Representación geométrica

`figuras.mjs` calcula todas las coordenadas desde un polígono regular y el centro C. La parte seleccionada se destaca completa; el resto queda en tonos neutros. Los colores de las preguntas cambian independientemente del concepto, y las cuatro imágenes de una pregunta comparten color para evitar pistas cromáticas.

- Lado: un segmento del contorno, entre dos vértices consecutivos.
- Vértice y centro: se distingue el punto de la esquina del punto C.
- Radio: segmento completo de C a un vértice, con ambos extremos marcados.
- Apotema: segmento completo de C al punto medio de un lado, con marca de perpendicularidad. La escuadra es una ayuda neutra, no otro ángulo resaltado.
- Diagonal: une dos vértices no consecutivos, con ambos extremos marcados. Puede pasar por C, pero se resalta el segmento entero entre esquinas, nunca solamente un radio. El triángulo se excluye de los dibujos de diagonales en ambas prácticas.
- Interior: sector dentro del contorno entre los dos lados que llegan a una esquina.
- Exterior: sector fuera del contorno entre un lado y la prolongación del lado vecino, que se dibuja discontinua.
- Central: sector con vértice en C entre dos vértices consecutivos, acompañado por dos radios auxiliares neutros y discontinuos.

Las opciones visuales tienen descripciones accesibles de su geometría, sin escribir el nombre de la respuesta en la imagen. La letra C se explica como centro. La rotación y la esquina elegida pueden variar sin modificar estas relaciones.

## Práctica y progreso

Cada modo conserva por separado pregunta, aciertos y conceptos reconocidos durante la visita. Una bolsa aleatoria recorre los nueve conceptos antes de volver a mezclarlos; no repite el último al empezar la siguiente bolsa. Cada pregunta tiene cuatro conceptos diferentes y exactamente una solución. Hay ejercicios nuevos ilimitados.

El error deja un aviso rosa con una pista, una tachita temporal y la opción descartada marcada para permitir otro intento. Un acierto marca la respuesta en verde, explica la parte y se cuenta una sola vez. Por defecto, la siguiente pregunta aparece tras 3,2 segundos. La casilla «Siguiente pregunta automática» permite leer a su ritmo; también hay un botón Siguiente y un botón Nuevo reto. Cambiar de vista o esconder la pestaña cancela el avance pendiente; volver no pierde la pregunta ni las marcas. Al reconocer los nueve conceptos se muestra «Colección completa» y se puede seguir practicando.

No hay reloj, derrota, puntuaciones negativas ni persistencia en servidor. Recargar reinicia los avances. HTML, CSS, SVG y JavaScript nativos, sin dependencias añadidas. La navegación, logotipo, pie y botones flotantes usan los recursos globales existentes sin modificarlos; la base visual de la sesión está en `../../estilos.css`.

## Archivos y comprobación

- `modelo.mjs`: definiciones, generador equilibrado y respuestas.
- `figuras.mjs`: geometría y SVG.
- `script.mjs`: exploración, vistas, feedback, foco y cancelación de temporizadores.
- `index.html`, `estilos.css`, `juego.json`: interfaz y metadatos publicados.
- `modelo.test.mjs`: pruebas de las 63 combinaciones, extremos de los segmentos, perpendicularidad, diagonales, sectores dentro/fuera en múltiples rotaciones, 2.000 preguntas con solución única y 62 combinaciones geométricas válidas, cobertura por bolsas y reintentos.

Desde la raíz:

```sh
node --test asesores/erik/kenisa/extra-mate-parte-3/juegos/partes-poligonos/modelo.test.mjs
npm run catalogo
npm run validar
```

Revisar las tres vistas a 360, 768, 1024 y 1440 px, teclado, tacto, movimiento reducido, consola, enlaces y retorno a los ejercicios. Comprobar el avance automático, su desactivación, cambio de vista durante la espera, Nuevo reto, ausencia de dobles aciertos, las 63 selecciones del explorador y el enlace Continuar desde una victoria real del arcade. Mantener sincronizados este README, el README de la sesión y los JSON.
