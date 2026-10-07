# Extra mate parte 3

Sesión independiente de KENISA, Asesoría Erik. ID `extra-mate-parte-3-kenisa-erik`; entrada pública `/asesores/erik/kenisa/extra-mate-parte-3/index.html`.

## Contenido publicado

La portada conserva la estructura, navegación y paleta de las partes anteriores. Tres tarjetas presentan **Misión polígonos**, **El mapa del polígono** y **Fórmulas del polígono**, con accesos directos a su exploración y práctica. No hay componentes vacíos, pantallas de desbloqueo ni enlaces a las partes 1 o 2.

La primera actividad trabaja el nombre según el número de lados. Presenta primero triángulo, cuadrilátero, pentágono, hexágono, heptágono, octágono, eneágono, decágono, endecágono y dodecágono. El cuadrilátero regular se identifica también como cuadrado. La ampliación opcional incluye «polígono de 13 lados» hasta «polígono de 19 lados» e icoságono (20).

La galería permite seleccionar figuras y recorrer sus lados con un conteo animado de colores. El botón Jugar abre una ventana arcade que ocupa casi toda la pantalla, con X y Escape para regresar. Hay 20 defensas poligonales (4 filas de 5): cada número aparece dentro de su propia figura. El nombre se integra junto a la nave; no hay panel lateral ni pistas. Acertar retira una defensa; equivocarse añade la figura delante de su columna. Vaciar una columna permite alcanzar al rival >:v. El recorrido va del nivel 3 al 20: cada jefe N-ágono solo cae con un proyectil de N lados; un error rebota en su escudo. Con un camino libre, la figura necesaria aparece en tres turnos como máximo. La victoria y la ayuda para torres altas aparecen sobre el mismo campo, sin desplazamientos. Se conserva la colección y se pueden generar misiones ilimitadas. Las defensas iniciales usan 3–12 lados y el selector permite 3–20 sin desbloqueos; los jefes siempre recorren 3–20. Tras cada victoria se puede avanzar al siguiente nivel y después del 20 volver al inicio. La paleta combina turquesa, azul, verde, violeta, amarillo y rosa; no usa rojo.

La segunda actividad, **El mapa del polígono**, tiene tres vistas: un explorador de nueve partes aplicado a polígonos regulares de 3–9 lados, elegir la figura correcta entre cuatro dibujos y elegir la palabra correcta entre cuatro nombres. Cubre lado, vértice, diagonal, ángulo interior, ángulo exterior, centro, radio, apotema y ángulo central. Mantiene la parte seleccionada al cambiar de figura y explica que el triángulo no tiene diagonales. Los retos varían orientaciones y figuras, recorren los nueve conceptos y ofrecen reintentos, progreso independiente y avance automático opcional. No se trabajan fórmulas ni cálculos.

Cada victoria de Misión polígonos muestra solo **Continuar** y **Repetir**. Continuar avanza al siguiente nivel; después del jefe 20 lleva a la actividad de las partes, que también está disponible desde la navegación inferior y desde la portada de la sesión.

La tercera actividad, **Fórmulas del polígono**, añade un catálogo animado de siete temas para polígonos de 3–9 lados, una práctica de 14 tipos de cálculo y otra de reconocimiento visual de N y cinco despejes sencillos. Incluye perímetro, área, diagonales y ángulos; los casos de apotema y lado usan área y perímetro. Pitágoras solo aparece en la exploración visual, nunca en los ejercicios. Hay casos seleccionables, mezcla equilibrada, retos ilimitados, pistas, reintentos y progreso independiente. Se indican medidas aproximadas y los ángulos se redondean a dos decimales. Se accede desde la portada o con Continuar al final de El mapa del polígono.

## Archivos y mantenimiento

- `index.html`, `estilos.css`: menú y estilos locales, sin depender de las otras sesiones.
- `sesion.json`: metadatos publicados; únicamente `juegos` está activo.
- `juegos/mision-poligonos/`: interfaz arcade, motor, SVG, metadatos, pruebas y documentación de reglas.
- `juegos/partes-poligonos/`: explorador, dos prácticas, geometría SVG, generador, pruebas y documentación.
- `juegos/formulas-poligonos/`: catálogo animado, dos prácticas de fórmulas, generador, pruebas y documentación.

HTML, CSS y módulos JavaScript nativos. Las fórmulas reutilizan KaTeX 0.18.1 por CDN con SRI, ya utilizado en la biblioteca, y tienen respaldo MathML sin red; no se añadieron paquetes ni compilación. La navegación global, logotipo, pie y botones flotantes usan los recursos compartidos existentes, sin modificarlos. El avance vive solo en la página; cambiar el rango de defensas o reiniciar regenera el nivel actual, pero conserva la colección y el contador de misiones hasta recargar.

## Verificación

Ejecutar desde la raíz:

```sh
node --test asesores/erik/kenisa/extra-mate-parte-3/juegos/mision-poligonos/modelo.test.mjs asesores/erik/kenisa/extra-mate-parte-3/juegos/partes-poligonos/modelo.test.mjs asesores/erik/kenisa/extra-mate-parte-3/juegos/formulas-poligonos/modelo.test.mjs
npm run catalogo
npm run validar
```

Revisar menú y juego a 360, 768, 1024 y 1440 px, teclado, controles táctiles, movimiento reducido, consola y enlaces. Probar acierto, error acumulado, recuperación, límite de torre, camino libre, escudo ante un proyectil incorrecto, victoria con la figura del jefe, niveles 3–20 y cambio de misión durante un disparo. Probar abrir/cerrar la ventana, restaurar foco y posición de la sesión, flecha arriba y Espacio, victoria sin cambio de dimensiones, y orientación horizontal. Cerrar o redimensionar durante el vuelo cancela ese lanzamiento y conserva todas las defensas. Verificar además las 63 combinaciones del explorador (incluida la excepción de la diagonal en el triángulo), respuesta única de los dos modos, reintentos, temporizadores y Continuar desde la victoria. Verificar las 49 vistas de fórmulas, los casos de cálculo y descubrimiento, la ausencia de ejercicios de Pitágoras, el redondeo angular y la alternativa MathML sin CDN. Mantener sincronizados los JSON y los README.

Referencia educativa para los nombres: [Currículum Nacional de Chile, clasificación de polígonos](https://www.curriculumnacional.cl/estudiante/621/articles-145593_recurso_pdf.pdf). Las figuras de cuatro lados se nombran por su familia en la clasificación por cantidad de lados; la nota explica el caso regular.
