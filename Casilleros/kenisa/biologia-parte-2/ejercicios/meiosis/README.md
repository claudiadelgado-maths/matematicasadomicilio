# 03 — Meiosis: formación de gametos

Actividad introductoria de preparatoria para KENISA (`kenisa-erik`), en `biologia-parte-2-kenisa-erik`. Entrada: `/Casilleros/kenisa/biologia-parte-2/ejercicios/meiosis/index.html`. Se accede desde el menú y desde Continuar a Meiosis al finalizar Mitosis. Fecha editorial: 2026-10-14.

## Contenido real

- Finalidad de la meiosis, gametos humanos, diploidía/haploidía y 46 → 23 cromosomas por célula. La fecundación se anticipa brevemente para la actividad 04, sin desarrollarla.
- Una replicación previa, dos divisiones; ninguna replicación entre Meiosis I y II.
- Laboratorio de nueve vistas: preparación después de replicar, Profase/Metafase/Anafase/Telofase I y Profase/Metafase/Anafase/Telofase II. Las telofases se agrupan con la citocinesis.
- Modelo animal diploide 2n = 4: un par largo y uno corto. Los orígenes materno y paterno usan morado y verde; la identidad de las ocho moléculas de ADN persiste en toda la animación. El huso conecta homólogos a polos opuestos en I y hermanas a polos opuestos en II. Flechas y contadores acompañan cada fase.
- Nueve selectores libres, Anterior/Siguiente, reproducción cada seis segundos, pausa y repetición al finalizar. No hay reproducción al cargar. Una casilla y la preferencia del sistema eliminan la interpolación. Ocultar/salir de la página, navegar, iniciar el repaso o cambiar el movimiento pausa la secuencia.
- Comparación ilustrada entre separación de homólogos y separación de hermanas.
- Explorador de entrecruzamiento antes/después entre dos cromátidas no hermanas de un par. Los fragmentos intercambiados de ambos pares se mantienen en el laboratorio hasta sus cuatro productos finales. Dibujo adicional con dos distribuciones posibles de homólogos, sin entrecruzamiento para aislar esa idea.
- Resumen: dos divisiones, cuatro productos haploides, la mitad del número cromosómico y variabilidad. Nota breve: la ovogénesis humana no produce cuatro óvulos funcionales; el reparto desigual genera cuerpos polares.
- Práctica 1, ¿Qué se separa?: tres imágenes mezcladas (Anafase I, Anafase II, anafase mitótica), dos opciones, pistas y reintentos. Reinicio al completar.
- Práctica 2, Sigue los cromosomas: cinco paradas; se elige la siguiente imagen entre tres opciones mezcladas. El estado inicial permanece visible, los errores no avanzan y hay reinicio en cualquier momento.
- Repaso de 18 preguntas con tres dibujos: tres opciones mezcladas, primera respuesta confirmada puntuable, explicación, resultado, revisión de errores con enlaces y repetición.

## Criterios científicos

Haploide/diploide se refiere a juegos de cromosomas, no al número de cromátidas por cromosoma. Tras Meiosis I cada célula es haploide con cromosomas aún duplicados. En Anafase II las hermanas separadas pasan a ser cromosomas independientes: en el modelo hay temporalmente cuatro en cada célula todavía sin dividir, dos hacia cada polo; el resultado final es dos por célula. No se modela una segunda síntesis de ADN.

Se intercambian segmentos correspondientes entre cromátidas no hermanas del mismo par, nunca entre el cromosoma largo y el corto. Las hermanas conservan ese nombre por su origen aunque tras el intercambio puedan diferir genéticamente. El dibujo elige una combinación concreta de orientaciones y un intercambio por par; no representa todas las posibilidades ni garantiza que todo producto de toda meiosis sea único. Las cuatro combinaciones dibujadas son diferentes.

Los núcleos, la condensación y las separaciones se simplifican. No se explican subfases, quiasmas ni mecanismos moleculares. La citocinesis puede solaparse con fases finales. Volver atrás es navegación de estudio, no reversión biológica. El modelo general de cuatro productos no equivale a cuatro gametos funcionales en la ovogénesis humana. El cierre enlaza a la actividad 04, ya disponible.

Fuentes de consulta: [NHGRI, meiosis](https://www.genome.gov/genetics-glossary/Meiosis), [NHGRI, entrecruzamiento](https://www.genome.gov/es/genetics-glossary/Cruzamiento), [OpenStax Biology 2e, meiosis](https://openstax.org/books/biology-2e/pages/11-1-the-process-of-meiosis), [OpenStax, gametogénesis](https://openstax.org/books/biology-2e/pages/43-3-human-reproductive-anatomy-and-gametogenesis). Texto, banco e ilustraciones propios.

## Archivos y dependencias

- `index.html` y `estilos.css`: página local con identidad global y estilo de Biología parte 2.
- `datos.mjs`: nueve etapas, tres casos de separación, cinco paradas visuales y 18 preguntas.
- `escena.mjs`: geometría pura, SVG accesible y animación mediante requestAnimationFrame durante un segundo. Conserva ocho nodos de ADN. Los fragmentos se obtienen por subdivisión de la misma curva para que no se despeguen durante el movimiento.
- `modelo.mjs`: recorrido por paradas; reutiliza `shuffled` de `../mitosis/modelo.mjs` y el modelo de puntuación común.
- `script.mjs`: laboratorio, entrecruzamiento, prácticas y conexión con el repaso. Reutiliza `sceneMarkup(3)` de `../mitosis/escena.mjs` para reconocer la anafase mitótica, sin modificarla. Los cambios de esa escena o su banco requieren revisar también esta práctica.
- `modelo.test.mjs`: bancos, recorrido, conservación de ADN, distribución por polo/célula, intercambio entre no hermanas, exportación y puntuación.
- `generar-ilustraciones.mjs`: herramienta de autoría ejecutable con Node, no cargada por el sitio. Actualiza los bloques marcados del HTML y `../../recursos/meiosis.svg`, utilizado por portada de actividad y menú. Ejecutarla después de modificar dibujos o descripciones. No es una compilación obligatoria: los SVG están guardados.
- `../../recursos/biologia.css`, `repaso.css`, `repaso.mjs` y `modelo-repaso.mjs`: identidad y repaso de la familia, reutilizados sin cambiar su comportamiento. Consumidores del repaso: las cuatro actividades de Biología parte 2.
- Logotipo, base, menú, pie y flotantes: recursos globales con rutas relativas. Fuente Fredoka del casillero.

Sin paquetes nuevos, cuentas, almacenamiento ni envío de respuestas. Con JavaScript desactivado permanecen los dibujos y explicaciones, incluida la lista de nueve vistas; los controles opcionales se ocultan. Botones nativos, radios con leyenda, descripciones SVG, estados aria-pressed, foco visible y avisos de resultados con role=status.

## Verificación

Desde la raíz:

```
node Casilleros/kenisa/biologia-parte-2/ejercicios/meiosis/generar-ilustraciones.mjs
node --test Casilleros/kenisa/biologia-parte-2/ejercicios/meiosis/modelo.test.mjs Casilleros/kenisa/biologia-parte-2/ejercicios/mitosis/modelo.test.mjs Casilleros/kenisa/biologia-parte-2/ejercicios/adn-y-cromosomas/modelo.test.mjs
npm run catalogo
npm run validar
```

Revisar 360/768/1024/1440 px, menú y Escape, teclado, consola, enlaces, imágenes y desbordamiento. Comprobar las nueve fases, movimiento y pausa/final/reinicio, cambio de preferencia, intercambio antes/después, ambas prácticas con errores y reinicios, repaso sin respuesta y resultados 0/18 y 18/18, dibujos, revisión y repetición. Revisar menú, continuación desde Mitosis y casillero generado.

Comprobación del 14 de octubre de 2026: 19 pruebas aprobadas entre las tres actividades (8 de Meiosis), 153 enlaces/recursos locales verificados y SVG exportado válido. Meiosis y el menú se revisaron en los cuatro anchos sin desbordamiento ni imágenes rotas. Se verificaron en navegador las nueve etapas, animación, reproducción/final/reinicio/pausa, movimiento reducido, entrecruzamiento, prácticas con error/acierto/reinicio, teclado y Escape, y resultados 0/18 y 18/18 con revisión de 18 errores o revisión oculta al acertar todo. Consola sin errores. La navegación Mitosis → Meiosis → menú → casillero funciona. `npm run catalogo` genera 279 módulos públicos; `npm run validar` conserva los 10 errores previos de carpetas declaradas pero ausentes en Andrés (interés simple y compuesto) y Renata (determinantes 2×2), sin errores de esta sesión.

La actividad 04 reutiliza las escenas SVG de este módulo para la comparación, separación y preguntas visuales. Tras modificar `escena.mjs`, revisar también la actividad 04 y regenerar sus ilustraciones estáticas.
