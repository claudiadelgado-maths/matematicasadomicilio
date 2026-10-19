# Examen 01 · Opción múltiple de Biología

Identidad `biologia-examen-opcion-multiple-kenisa-erik`, sesión `biologia-examen-kenisa-erik`, usuario `kenisa-erik`. Entrada: `/Casilleros/kenisa/biologia-examen/examenes/opcion-multiple/index.html`.

## Banco completo y fuentes

`banco.mjs` importa directamente los módulos existentes, normaliza opciones y claves sin modificar los bancos fuente y asigna IDs con prefijo de actividad. Conserva explicaciones y enlaces a las guías. Las preguntas sin ID de Parte 2 usan su posición original: al reordenar ese banco, revisar migración del historial.

| Parte | Actividad | Preguntas | Fuente en ejercicios/ salvo indicación |
|---|---|---:|---|
| 1 | Célula animal | 99 | partes-de-la-celula-animal/banco-preguntas.mjs: DESCRIPTION_BANK + REASONING_BANK |
| 1 | Biomoléculas | 105 | biomoleculas/datos.mjs: FUNCTION_BANK + SORTING_BANK |
| 1 | Niveles de organización | 24 | niveles-de-organizacion/datos.mjs: PREGUNTAS |
| 2 | ADN y cromosomas | 14 | adn-y-cromosomas/datos.mjs: questions |
| 2 | Mitosis | 16 | mitosis/datos.mjs: questions |
| 2 | Meiosis | 18 | meiosis/datos.mjs: questions |
| 2 | Mitosis, meiosis y reproducción | 22 | mitosis-meiosis-y-reproduccion/datos.mjs: questions |
| 3 | Procariotas y eucariotas | 20 | recursos/contenido.mjs: bank |
| 3 | Célula vegetal | 48 | celula-vegetal/banco-preguntas.mjs |
| 3 | Clasificación de los seres vivos | 60 | clasificacion-de-los-seres-vivos/banco-preguntas.mjs |
| 3 | Reino Fungi | 60 | reino-fungi/banco-preguntas.mjs |
| 4 | Membrana y transporte | 60 | membrana-y-transporte/banco-preguntas.mjs |
| 4 | Metabolismo y ATP | 48 | metabolismo-y-atp/banco-preguntas.mjs |
| 4 | Respiración celular | 48 | respiracion-celular/banco-preguntas.mjs |
| 4 | Fermentación | 48 | fermentacion/banco-preguntas.mjs |

Total: **690**, agrupadas en **15 temas**, uno por actividad principal. Las prácticas internas de célula animal se agrupan en su actividad. Se incluyen las 56 tarjetas de biomoléculas con las siete categorías como opciones, sin arrastre. Se muestran todas las opciones originales disponibles y se mezclan conservando la clave.

La pregunta de respiración sobre ubicación de glucólisis añade contexto procariota en este importador para diferenciar su enunciado del de metabolismo; conserva respuesta y explicación originales. Dos preguntas con el enunciado genérico «¿Cuál afirmación es INCORRECTA?» se distinguen por tema y opciones completamente diferentes. No son un mismo reactivo.

`figuras.mjs` reutiliza funciones puras de las escenas de Mitosis, Meiosis y Reproducción (Parte 2). Nueve preguntas tienen dibujo: dos de mitosis, tres de meiosis y cuatro integradoras. Se conserva tipo de proceso y fase; no se sustituye un dibujo de mitosis por uno de meiosis. Los módulos originales no se modifican.

## Modos y contrato de no repetición

- **Todo aleatorio:** mezcla todas las preguntas todavía no contestadas, sin cuotas por tema.
- **Por tema:** selecciona una actividad de las quince y mezcla sus preguntas disponibles.
- **1 de cada actividad:** selecciona exactamente una nueva de cada tema no agotado y mezcla el orden de los temas. Primera ronda: quince. Las rondas siguientes omiten temas agotados hasta completar todo el banco, sin volver a introducir sus preguntas antes de tiempo.

Los dos primeros modos ofrecen rondas de 10, 20, 40 o todas las disponibles. Se ajustan a lo que queda. El tercero fija automáticamente la cantidad según los temas disponibles. Ningún límite de ronda excluye preguntas del banco: continuar ofrece las restantes hasta agotarlas.

Historial único entre modos: confirmar consume el ID tanto si fue correcto como incorrecto. Seleccionar sin confirmar no puntúa. No hay saltos ni reinicios prematuros. La pregunta en curso queda guardada y al volver se retoma, no se genera otra ronda. Después de confirmar puede cerrarse la ronda antes de su final; sus preguntas todavía no mostradas quedan disponibles.

Al agotar un tema se invita a continuar con otros; no se reinicia ese tema aisladamente. Solo al completar las 690 se habilita una nueva vuelta. La revisión de resultados muestra respuestas ya contestadas como consulta, nunca como preguntas puntuables nuevas.

Calificación 0–100 de la ronda, aciertos/total y desglose solo de temas respondidos. Una respuesta definitiva, explicación inmediata y resultado al terminar o cerrar tras confirmar. Los resultados quedan guardados hasta elegir otra ronda. No se generan paneles opcionales vacíos.

El controlador compartido muestra también la respuesta correcta escrita junto a la explicación (19-10-2026). Las tarjetas opcionales «Para recordarlo» solo aparecen cuando el reactivo las incluye; el banco general conserva sus 690 preguntas originales y no muestra tarjetas vacías.

## Estado, privacidad y accesibilidad

`modelo.mjs` reexporta `../../recursos/modelo.mjs`: mezcla, planificación sin reemplazo, respuesta, avance, cierre parcial, puntuación, vuelta nueva y restauración validada. No accede al DOM. `script.mjs` configura `../../recursos/controlador.mjs` para formularios, historial y revisión. El motor y el controlador se comparten con el examen del temario, con bancos y claves de almacenamiento independientes. `localStorage`, clave `kenisa-biologia-examen-v1`: IDs contestados, número de vuelta y ronda actual con orden, respuestas y opciones. No guarda datos personales ni envía respuestas. Mantiene avance al cerrar o recargar en ese navegador/origen. Si no se permite almacenamiento, avisa y conserva estado solo durante la visita. No hay sincronización entre dispositivos. Cambios desde otra pestaña del mismo origen se reflejan mediante evento storage.

La restauración filtra IDs inexistentes y rechaza rondas incoherentes conservando el historial válido. Al añadir preguntas fuente, sus IDs nuevos quedan disponibles; al retirar preguntas, se descartan sus referencias. Borrar datos del navegador elimina el historial. Sin cuentas, analítica ni servicios externos.

Controles nativos de radio/select/form, etiquetas, foco visible, feedback textual que no depende del color, mensajes anunciados, dibujos accesibles originales y movimiento reducido. Una sola pregunta visible. HTML estático informa que JavaScript es necesario y enlaza a las guías si está desactivado.

Importa exclusivamente la identidad propia `../../recursos/examen.css`, recursos originales indicados y base/navegación/marca globales. No reutiliza el motor anterior de rondas por categoría, porque aquí el historial debe abarcar todas las actividades y modos.

## Verificación

Ocho pruebas con `node --test Casilleros/kenisa/biologia-examen/examenes/opcion-multiple/modelo.test.mjs`: integridad y claves de las 690 preguntas, nueve figuras, agotamiento en los tres modos (105 rondas de una por actividad para agotar bancos desiguales), historial cruzado, cierre parcial, bloqueo de doble respuesta, nota, persistencia y datos inválidos. Verifican también enlaces a las guías y sus anclajes.

En navegador: tres modos, tema agotado, mensajes sin respuesta, opciones/confirmación, cierre parcial, resultado, revisión, recarga antes y después de confirmar, continuidad e imágenes. Móvil/escritorio 360/768/1024/1440, teclado, menú/Escape, foco, consola y enlaces. Ejecutar `npm run catalogo` y `npm run validar` al entregar.

Verificado el 18-10-2026: ocho pruebas aprobadas; tres modos probados en navegador, tema ADN agotado y excluido de la siguiente ronda, historial cruzado sin repetición, recarga con opciones estables, confirmación bloqueada y cierre parcial. Dibujo de metafase visible. Menú y examen sin desbordamiento a 360/768/1024/1440 px; imágenes cargadas, teclado y Escape correctos, consola limpia y navegación desde el casillero comprobada. Catálogo y validación global sin errores ni advertencias.

Después de integrar el examen 02, se repitieron las ocho pruebas del primero y la comprobación de guardado/restauración en navegador con el controlador compartido. Se mantiene su banco de 690, sus modos y la clave de avance anterior.

Revisado el 19-10-2026 tras ampliar el segundo examen: banco general de 690 intacto, ocho pruebas aprobadas, respuesta correcta explícita, sin tarjetas vacías, teclado/recarga y tamaños 360/768/1024/1440 comprobados.
