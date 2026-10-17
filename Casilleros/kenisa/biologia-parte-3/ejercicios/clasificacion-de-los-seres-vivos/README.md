# Actividad 03 · Clasificación de los seres vivos

Biología Parte 3, KENISA (`kenisa-erik`). Ruta pública: `/Casilleros/kenisa/biologia-parte-3/ejercicios/clasificacion-de-los-seres-vivos/index.html`.

## Contenido y estado

Los siete criterios están desarrollados en orden: número de células, nutrición, tipo celular, oxígeno, reproducción, taxonomía y hábitat. El concepto central es que distintos criterios se complementan. Se diferencian los cinco reinos tradicionales y los tres dominios; se incluyen jerarquía taxonómica, especie con límites del concepto biológico y nomenclatura binomial.

Pasaportes interactivos: ser humano, pino, ameba, alga verde unicelular fotosintética, cianobacteria unicelular, levadura y champiñón. Cada pasaporte requiere tres decisiones simultáneas: tipo celular, organización y nutrición. Valida campos vacíos, explica las correcciones y permite reintentar. Conserva selecciones durante la visita al cambiar de organismo; cuenta cada pasaporte logrado una sola vez. El botón de reinicio borra exclusivamente los pasaportes. La tabla de consulta y los detalles tras acertar permiten repasar sin presión de examen.

Seis retos verdadero/falso con corrección y explicación: combinaciones compatibles, incompatibles y generalizaciones falsas. Tras un acierto se bloquea la tarjeta y se cuenta una sola vez; se reinician al recargar. No se califican como examen ni penalizan reintentos.

Examen conectado: 60 preguntas originales, diez categorías de seis variantes; rondas de 10 o 20. Primera respuesta definitiva, explicación, resultado por tema, revisión de errores y ronda de errores con nota inicial conservada. Reutiliza el motor existente de Parte 1 y agota variantes antes de repetir.

No quedan funciones de esta actividad por conectar. El estudio detallado corresponde a la actividad 04, disponible en `../reino-fungi/index.html`, enlazada al cierre de esta página. Se menciona Fungi solo para clasificar y comparar, sin adelantar su estudio detallado.

## Archivos y dependencias

- `index.html`, `estilos.css`: guía, interfaz y estilos locales bajo `.classification-page`.
- `modelo.mjs`: siete fichas, tres campos, evaluación pura de pasaportes y seis afirmaciones.
- `script.mjs`: formularios, estado de práctica, tarjetas y montaje del examen. Sin almacenamiento ni transmisión de respuestas; recargar reinicia todo.
- `banco-preguntas.mjs`: fuente de verdad del examen. `preguntas.md`: copia legible docente; sincronizar ambos al editar.
- `recursos/atlas.svg`: símbolos propios de humano, pino, alga, cianobacteria unicelular y champiñón. No representan tamaño real.
- `../../recursos/organismos.svg`: símbolos ameba y levadura; levadura también en cabecera y en la tarjeta de portada de sesión. Se reutiliza sin modificar.
- `../../recursos/sesion.css`: identidad compartida de la sesión; fuente Fredoka local de KENISA y estilos comunes sin modificar.
- `../../../biologia-parte-1/recursos/cuestionarios.css`, `cuestionarios.mjs` y `modelo-repaso.mjs`: motor y estilos existentes del examen; sin cambios.
- CSS base, logotipo, pie, navegación y flotantes globales por rutas relativas.

## Criterios científicos

Los pasaportes describen ejemplos concretos: pino fotosintético y una forma unicelular de cianobacteria como Synechococcus. No se generaliza que toda cianobacteria esté aislada ni que toda alga tenga una única nutrición. El alga se evalúa en el modo fotosintético descrito; la guía introduce mixotrofía y advierte diferencias entre sistemas de clasificación de algas. El champiñón visible es una parte del hongo pluricelular.

No se confunden fermentación y respiración anaerobia. El anaerobio facultativo depende también de nutrientes y condiciones adecuadas. La reproducción sexual no exige necesariamente dos individuos y la asexual no excluye mutaciones. Los reinos tradicionales se presentan como modelo escolar histórico, no como clasificación filogenética definitiva.

Referencias verificadas: OpenStax Microbiology 1.2 (historia de clasificación), 8.1 (nutrición y energía), 9.2 (oxígeno), y Biology 2e 20.1 (taxonomía), enlazadas al pie. Contenido y ejercicios propios a partir del temario docente.

## Verificación y continuidad

Desde la raíz: `node --test Casilleros/kenisa/biologia-parte-3/ejercicios/clasificacion-de-los-seres-vivos/modelo.test.mjs`, `npm run catalogo` y `npm run validar`.

Comprobar pasaporte vacío, error, corrección, cambios de organismo, borradores, siete logros y reinicio; seis afirmaciones; examen 10/20 y repaso de errores; navegación menú/actividad, teclado, consola, imágenes, anclajes y anchos 360/768/1024/1440. Las regiones de tabla admiten desplazamiento con teclado cuando no caben. Los controles nativos y mensajes de estado tienen etiquetas; el acierto no depende solo del color. Sin dependencias nuevas.

Verificado el 2026-10-16: cuatro pruebas automáticas aprobadas; siete pasaportes logrados sin duplicar el contador, validación vacía, error/corrección, borradores y reinicio probados; seis tarjetas aclaradas con un error previo. Examen completo 19/20 y repaso 1/1 con nota inicial conservada; inicio de ronda breve de 10 verificado. Sin desbordamiento en 360/768/1024/1440 px; menú móvil Enter/Escape, campos y botones con teclado, navegación de sesión y consola correctos. Auditoría de las cuatro páginas: 134 referencias locales y fragmentos válidos. Catálogo: 290 módulos y 21 casilleros. `npm run validar` mantiene diez errores anteriores de carpetas ausentes en Andrés y Renata, ninguno de esta actividad.
