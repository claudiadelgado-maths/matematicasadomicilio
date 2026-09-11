# Introducción · José Pérez

Sesión de reconocimiento para un estudiante universitario de ingeniería. No presupone dominio de los temas ni asigna calificación. Se recorre en orden o usando el selector de temas. Ninguna respuesta bloquea la navegación.

## Contenido real

La primera hoja, `index.html`, adapta la presentación de Raúl: nombre, edad, carrera u ocupación y gustos con lectura en voz alta; cuatro conversaciones marcables; cinco fichas de plan que se añaden por arrastre o botón y se pueden quitar. Sus datos y marcas solo viven en la página, no se guardan ni se envían. El botón Siguiente no exige completarlos. La voz depende del navegador/dispositivo.

Después, veinte vistas dentro de `recorrido/index.html`: bases aritméticas y algebraicas; puntos; distancia; pendiente; recta; funciones; dominio e imagen; familias; límites; laterales y discontinuidades; derivada; reglas; vectores; varias variables; parciales; integral indefinida; definida; métodos; múltiples; cierre.

Cada vista incluye la idea, fórmulas, condiciones relevantes y una conexión cotidiana. Hay ejemplos con avance por pasos, preguntas explicadas y siete tipos de práctica numérica con cinco variantes cada uno. Son pausas breves integradas, no módulos separados de ejercicios o juegos; por eso los componentes opcionales del JSON permanecen en false.

Las gráficas SVG permiten mover coordenadas, comparar pendientes y familias, aproximar límites, comparar secante/tangente, operar vectores, leer un mapa de valores y observar áreas con signo y regiones rectangulares. Las gráficas muestran ventanas finitas y las funciones pueden continuar fuera de ellas.

## Archivos

- `contenido.mjs`: contenido editorial, diez familias, generadores y analizador de respuestas (enteros, decimales, fracciones).
- `graficas.mjs`: SVG y controles nativos accesibles. No usa librerías de gráficas.
- `sesion.mjs`: navegación por fragmentos, ejemplos, práctica y resumen.
- `presentacion.mjs` y `estilos.css`: actividades y diseño de la presentación, copiados localmente de Raúl y adaptados. No hay dependencia entre alumnos.
- `recorrido.css`: apariencia del recorrido; `recorrido/estilos.css` lo importa.
- `recorrido/index.html`: entrada a las veinte vistas. Conserva regreso al alumno y a la presentación. Los antiguos fragmentos de tema en la entrada principal redirigen al recorrido.
- `sesion.json`: metadatos de la sesión; `AVANCE.md`: registro de terminación.

Se reutilizan la marca, base y navegación globales. KaTeX 0.18.1 se carga del CDN con SRI, igual que las sesiones existentes; si no está disponible, las fórmulas conservan su texto LaTeX. Requiere JavaScript para el recorrido; hay aviso en `noscript`.

## Estado local

`mad:erik-jose-perez:introduccion:v1` guarda únicamente marcas de autoevaluación por tema (`clear`, `guided`, `revisit`). No registra resultados de preguntas ni envía datos. La sesión soporta almacenamiento bloqueado o contenido inválido. El cierre permite imprimir el resumen o borrar las marcas con confirmación. La URL conserva el tema actual y permite volver con el navegador.

## Verificación

Ejecutar `node --test asesores/erik/jose-perez/introduccion/contenido.test.mjs`, `npm run catalogo` y `npm run validar`. Revisar las veinte vistas, KaTeX, los controles SVG, preguntas y soluciones, cambiar de tema, marcas y resumen. Comprobar 360/768/1024/1440 px, teclado, menú, consola y enlaces desde Erik y el alumno.

