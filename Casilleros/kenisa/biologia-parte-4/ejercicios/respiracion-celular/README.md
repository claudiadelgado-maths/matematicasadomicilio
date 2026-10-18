# Actividad 03 · Respiración celular

**Actividad completa (2026-10-18).** Usuario `kenisa-erik`, sesión `biologia-parte-4-kenisa-erik`, ejercicio `respiracion-celular-biologia-4-kenisa-erik`. Entrada: `/Casilleros/kenisa/biologia-parte-4/ejercicios/respiracion-celular/index.html`.

## Contenido disponible

Guía ilustrada de respiración celular y pulmonar; aerobia, anaerobia y diferencia con fermentación; cuatro etapas de respiración aerobia; reactivos, productos, ecuación balanceada y rendimiento aproximado; mitocondrias, procariotas, fotosíntesis y plantas; seis conceptos desplegables. El detalle de fermentación láctica/alcohólica se estudia en la actividad 04, ya disponible y enlazada al cierre.

- **Mapa:** cuatro etapas seleccionables con ubicación, transformación y aporte energético. El número del SVG se resalta; anterior/siguiente tienen límites. Se cuentan etapas visitadas sin duplicados. La primera cuenta al abrir; reiniciar deja cero y vuelve al primer paso, que puede seleccionarse de nuevo. Diagrama conceptual, sin escala ni animación de reacciones individuales.
- **Orden:** cuatro selectores sin arrastre obligatorio. Validación de vacíos, etapas duplicadas, corrección por posición, pistas y reintento. Se completa una sola vez hasta reiniciar.
- **Casos:** dieciséis situaciones de ubicaciones, reactivos/productos, tipos respiratorios y relación con fotosíntesis. Selección libre, corrección, reintentos y contador de aciertos únicos.
- **Ideas:** ocho afirmaciones verdadero/falso, cuatro de cada tipo, con explicaciones. Mismo funcionamiento accesible de los casos.
- **Examen:** 48 preguntas originales, ocho categorías con seis preguntas cada una. Motor existente con rondas 8/16, explicación y práctica de errores conservando la nota inicial. `preguntas.md` es la copia docente del banco.

Tablero con cuatro prácticas; cada una tiene reinicio independiente. El progreso no bloquea navegación. Solo vive durante la visita; al recargar se reinicia. Sin almacenamiento, cuentas, temporizadores, servicios ni dependencias nuevas. Guía y diccionario funcionan sin JavaScript; controles opcionales se revelan tras inicializarse.

## Archivos y consumidores

`index.html` y `estilos.css`: contenido y estilos locales `.respiration-page`. `modelo.mjs`: datos y corrección pura del orden. `script.mjs`: controles nativos, dibujo, progreso y montaje del examen. `banco-preguntas.mjs`: fuente del examen, sincronizar `preguntas.md` al cambiarlo. `modelo.test.mjs`: cinco pruebas. `ejercicio.json`: contrato del módulo.

`recursos/mitocondria.svg` se usa en cabecera y portada de la sesión. Una copia exacta incrustada permite resaltar etapas del mapa; conservarlas sincronizadas, lo comprueba el test. Controles externos al SVG con nombres de etapa y `aria-pressed`; título/descripción del dibujo, textos, etiquetas y foco visible. No depende solo del color. Tablas con desplazamiento interno y región enfocable; movimiento reducido mediante estilos comunes.

Importa `../../recursos/sesion.css` y los recursos de examen `../../../biologia-parte-1/recursos/cuestionarios.css`, `cuestionarios.mjs` y `modelo-repaso.mjs`, sin modificarlos. Conserva marca, navegación, pie y flotantes globales. Entrada desde portada y cierre de la actividad 02; regreso al menú y recordatorio de ATP en la actividad 02.

## Criterios científicos

La necesidad de energía no implica que todas las células realicen respiración aerobia. Respiración pulmonar y respiración celular se relacionan, pero no son equivalentes. La oxidación implica transferencia de electrones, no consumo directo obligatorio de O₂ en cada reacción. Glucólisis está en el citosol y no consume O₂ directamente.

Mapa y conteos referidos a una glucosa en una célula eucariota. Glucólisis: 4 ATP formados menos 2 invertidos = 2 netos; 2 piruvatos y 2 NADH. Oxidación del piruvato: matriz, 2 CO₂ y 2 NADH, sin ATP directo. Krebs: principalmente matriz, dos vueltas, 4 CO₂, 6 NADH, 2 FADH₂ y 2 ATP/GTP equivalentes. Fosforilación oxidativa: membrana interna, aproximadamente 26–28 ATP. Total orientativo 30–32, no universal. El O₂ acepta electrones y se forma agua. Electrones en la cadena y H⁺ por ATP sintasa no se confunden. La ecuación global simplificada conserva átomos y omite ADP/Pi; no convierte materia en energía.

Respiración anaerobia tiene cadena y aceptor distinto del O₂. Fermentación no usa cadena respiratoria en ese mecanismo; aquí solo se introduce su diferencia, sin desarrollar sus tipos. Plantas respiran de día y de noche; no todas sus células tienen cloroplastos. Procariotas respiratorios pueden usar su membrana plasmática, sin mitocondrias. Fotosíntesis y respiración no son una misma ruta invertida.

Fuentes consultadas el 2026-10-18: OpenStax Biology 2e 7.2–7.5, enlazadas al pie. Texto y materiales originales conforme al temario docente.

## Comprobaciones

Ejecutar `node --test Casilleros/kenisa/biologia-parte-4/ejercicios/respiracion-celular/modelo.test.mjs`, `node --check Casilleros/kenisa/biologia-parte-4/ejercicios/respiracion-celular/script.mjs`, `npm run catalogo` y `npm run validar`.

Revisar cuatro etapas y límites, orden vacío/duplicado/incorrecto/correcto, dieciséis casos y ocho ideas con errores/reintentos, conteo sin duplicados, progreso 4/4 y reinicios independientes. Examen 8/16 y repaso sin alterar nota inicial; teclado, menú/Escape, imágenes, consola y pantallas 360/768/1024/1440. Comprobar portada, 02 → 03 y regreso.

Verificado el 2026-10-18: cinco pruebas aprobadas; sintaxis válida. Navegador: cuatro etapas, límites y visitas únicas; orden vacío, duplicado, 0/4 y 4/4; 16 casos y ocho ideas correctas con errores/reintentos; tablero 4/4 y reinicios independientes. Examen 7/8 y repaso 1/1 conservando la nota inicial, más inicio de ronda de 16. Teclado y foco visibles, menú Enter/Escape. Sin errores de consola ni imágenes rotas; sin desbordamiento a 360/768/1024/1440 px. Ilustración ajustada a todo el ancho disponible en tableta. Navegación portada → 02 → 03 y regreso comprobada. Catálogo y auditoría de enlaces registrados en el README de sesión. No quedan interacciones pendientes en esta actividad.
