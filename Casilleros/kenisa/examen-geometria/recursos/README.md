# Recursos de EXAMEN GEOMETRÍA

Familia exclusiva de esta sesión de KENISA. Leer primero ../README.md.

examenes.mjs conserva 80 preguntas y sus claves. fuente-original.tex es la entrada original entregada por el autor. Los cuatro exámenes tienen contenido HTML idéntico a su parte del banco; cualquier edición autorizada debe sincronizar ambos y los metadatos.

modelo.mjs mantiene el estado de cada intento. elegirRespuesta admite cambios solo antes de entregar; entregar es idempotente; calificacion devuelve null antes de entregar y después una nota de 0–100, con omisiones separadas pero sin puntos. alternarRespuestas solo actúa tras la entrega.

examen.mjs conecta ese estado con las cuatro páginas usando data-examen=A/B/C/D. No transmite ni almacena información fuera de memoria. No inserta la clave en las soluciones del DOM hasta que se solicita. La revisión y el reintento mantienen accesibilidad de teclado y foco.

Consumidores: ../examenes/examen-a/index.html, examen-b/index.html, examen-c/index.html y examen-d/index.html. Revisar los cuatro al modificar estos recursos; ejecutar modelo.test.mjs, catálogo y validación.

## Revisión matemática

contenido.test.mjs verifica con cálculos independientes las 48 preguntas numéricas de A–D y que exista una sola opción válida. REVISION.md registra además la revisión de las 32 conceptuales y el funcionamiento de los cinco exámenes. Los casos de apotema se comprueban por aplicación de A = Pa/2, conforme a la indicación del autor.
