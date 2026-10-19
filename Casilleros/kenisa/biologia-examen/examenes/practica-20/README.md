# Examen de práctica · 20 preguntas

Actividad 03 de Biología examen, para KENISA. Ruta pública: `/Casilleros/kenisa/biologia-examen/examenes/practica-20/index.html`.

## Contrato

- Selector de versiones: **Versión 1 y Versión 2** disponibles; veinte preguntas por versión (40 en total). Cada entrada real de `VERSIONS` genera su opción; no hay versiones futuras vacías.
- En cada versión, veinte preguntas fijas y sin barajar: diez de opción múltiple y diez de verdadero/falso. En la versión 1 se conservan literalmente los 19 enunciados, las opciones y la clave recibidos en `ORIGINAL.md`. Se añadió V/F 10, sobre membrana y pared vegetal.
- La versión 2 contiene veinte reactivos nuevos basados en los once temas de la actividad 2 (incluye cinco V y cinco F). No se repiten enunciados exactos de la versión 1 ni del banco del temario. Ninguna pregunta necesita un dibujo; la ilustración de cabecera es de apoyo.
- Todas se muestran juntas. Se puede cambiar cualquier elección hasta entregar. El mapa indica contestadas/pendientes y lleva a cada reactivo.
- Entregar con preguntas pendientes no revela ni calcula resultados; anuncia cuántas faltan y enfoca la primera. Solo una entrega completa habilita resultados.
- Nota 0–100 (cinco puntos por coincidencia con la clave), desglose 10 + 10, filtro de errores o revisión de las veinte, respuesta elegida/esperada, explicación y fuentes. No hay temporizador ni retroalimentación durante el intento.
- La clave original de la versión 1 incluye ambigüedades: la interfaz explica que la nota mide coincidencias con ella. La revisión distingue esas claves de afirmaciones científicas concluyentes. Véase `VERIFICACION.md`; no afirmar que todas las preguntas tienen una respuesta única científicamente demostrada.
- Después de entregar no se editan respuestas. «Comenzar otro intento» reemplaza únicamente el intento de esa versión, repitiendo el mismo examen. Se informa antes del botón. No aplica el historial sin repeticiones de las otras dos actividades.

## Archivos y privacidad

`versiones.mjs` contiene preguntas, claves, aclaraciones y fuentes. `modelo.mjs` controla el intento y la calificación; `script.mjs` construye la interfaz con nodos y texto. Sin dependencias, sin servidor ni envíos externos de respuestas. Las fuentes externas solo se abren al pulsarlas.

Guardado local por versión: `kenisa-biologia-practica-20-v1:version-1` y `kenisa-biologia-practica-20-v1:version-2`. La selección se recuerda en `kenisa-biologia-practica-20-selection-v1`; recargar vuelve a la misma versión. Se guardan elecciones, número de intento y estado, nunca nombres ni datos personales. La nota se vuelve a calcular desde respuestas válidas. Datos corruptos se descartan; una entrega incompleta se recupera como borrador. Si el navegador impide guardar, se avisa y se puede continuar durante la visita. Los cambios desde otra pestaña actualizan la vista.

Los bancos y claves de almacenamiento de las otras actividades no se tocan. Se importa `../../recursos/examen.css` y se usa `../../recursos/examen.svg`, además de base, marca, navegación y flotantes globales por rutas relativas. Los estilos nuevos son exclusivos de `.practice-exam`.

Para añadir una versión, añadir un objeto con ID estable, etiqueta y 20 preguntas (10 + 10) a `VERSIONS`; conservar las versiones anteriores, documentar su clave y actualizar cantidades, JSON y pruebas. No renumerar ni cambiar IDs de preguntas ya publicadas.

## Comprobación

`node --test Casilleros/kenisa/biologia-examen/examenes/practica-20/modelo.test.mjs`

Pruebas: integridad 10 + 10, fidelidad literal al material, claves, entrega incompleta, notas 0/85/100, desglose, edición previa/bloqueo posterior, restauración, datos inválidos e independencia entre versiones e intentos.

En navegador: responder con teclado, entrega incompleta, cambiar elección, recargar borrador, entregar las veinte, revisar errores y todas, recargar resultado, nuevo intento, selector, navegación, menú móvil/Escape, consola y anchos 360/768/1024/1440. Ejecutar `npm run catalogo` y `npm run validar` desde la raíz.

## Distribución de la versión 2

Opciones: organización celular (1), desarrollo (2), adaptación morfológica (3), procariotas (4), Golgi (5), lípidos (6), anabolismo (7), mitosis (8), meiosis (9) y nutrición de hongos (10). V/F: irritabilidad (1), reproducción asexual (2), mimetismo (3), ribosomas (4), mitocondrias (5), sacarosa (6), glucógeno (7), catabolismo (8), esporas (9) y estivación (10).

Clave V2, opciones: **b, a, d, c, b, d, c, a, d, b**. V/F: **V, F, V, F, V, V, F, F, F, V**. Las explicaciones y sus fuentes están en cada reactivo; la nota de esta versión corresponde a respuestas correctas, sin la advertencia de ambigüedad del material original.

Verificado en navegador el 19-10-2026: versión 1 con 19/20 impide entregar; entrega completa con tres diferencias obtiene 85/100 y desglose 8/10 + 9/10. Versión 2 con dos errores obtiene 90/100 (9/10 + 9/10); un nuevo intento completo correcto obtiene 100/100 y mensaje sin errores. Revisar las veinte no modifica la nota. Borradores, elección de versión y resultados sobreviven a recargas; cambiar/reintentar una versión conserva la otra. Se comprobó actualización desde otra pestaña incluso cuando esa versión no estaba visible. No hay explicaciones en el DOM del borrador. Teclado, foco visible, menú móvil/Escape, mapa de pendientes y enlaces del menú correctos. Formulario, resultados y menú sin desbordamientos en 360/768/1024/1440 px; imágenes completas y consola sin errores. Las otras dos actividades cargan correctamente desde el menú. Se corrigió el desplazamiento a resultados y la referencia externa de usos de hongos.
