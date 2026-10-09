# Congruencia de triángulos

Actividad 02 de Extra mate parte 4, KENISA / Erik. Entrada: index.html. Está en el menú de la sesión y se abre con Continuar al final de Triángulos semejantes. Su navegación final incluye Continuar hacia Mini examen, dentro de esta misma sesión. No crea otra sesión ni enlaza a otras partes de Extra mate.

## Recorrido

- **Explora**: un triángulo ABC de lados 6, 8 y 10 cm se clona como XYZ. Clonar y mover, Girar y Espejo conservan las medidas finales. Superponer deshace el giro y el reflejo antes de reunir todos los vértices. Las etiquetas permanecen legibles al girar y reflejar. El espejo se anima como el volteo de una hoja (proyección), no como un cambio de medidas. No hay sonido, límite de tiempo ni velocidad requerida. Movimiento reducido muestra directamente cada estado.
- **Criterios**: LLL (tres lados iguales), LAL (dos lados y el ángulo comprendido iguales) y ALA (dos ángulos y el lado comprendido iguales). Se distinguen Nos dan y Podemos concluir. Primero se resaltan únicamente los datos; un botón revela las igualdades deducidas mediante trazos discontinuos. Se usan letras para medidas que no se calculan; nunca se inventan longitudes o se pide Pitágoras/trigonometría. Los ángulos decimales del ejemplo son aproximados y están identificados como tales.
- **Decide**: seis casos, mezclados inicialmente: LLL, LAL, ALA, misma forma/distinto tamaño, conjuntos de ángulos distintos y lados distintos. La pregunta pide el criterio justificable con los datos marcados. Cada negativo demuestra no congruencia incluso permitiendo otra correspondencia: conjuntos angulares distintos, ternas de lados distintas o ángulos distintos entre sí con el lado comprendido de diferente tamaño. No se presenta ausencia de datos como prueba de no congruencia. AA solo no es criterio de congruencia.
- **Encuentra**: un lado entero, un lado fraccionario, tres lados, un ángulo o tres ángulos. Se declara ABC ≅ XYZ y se usa igualdad de correspondientes. Nunca se mezclan preguntas de lados y ángulos en el mismo reto. Lados enteros o fracciones exactas, fracciones equivalentes aceptadas, ángulos pedidos enteros. Al acertar se completan los campos señalados del dibujo.
- **Resuelve x**: x más un número, múltiplos de x, ax+b, x en ambos lados correspondientes o en un ángulo. Una única ecuación lineal, solución entera positiva; sin sistemas, cuadráticas, Pitágoras ni ejercicios de trigonometría.

## Interacción

Casos y orientación (alineada, girada, reflejada o variada) seleccionables inmediatamente. Nuevo reto ilimitado, mezcla que recorre todos los casos, pistas, reintentos y pasos de solución. Cada práctica tiene su propio contador de resueltos y primeros intentos, conservado al cambiar de vista durante la visita; recargar reinicia los contadores. Sin persistencia ni recopilación de respuestas.

Comprobar admite Enter. Verde y ✓ indican acierto; rosa y × temporal indican error. Los campos correctos se conservan en un reintento parcial. Datos inválidos no consumen intentos. Un acierto se cuenta una sola vez y habilita Siguiente reto, que recibe foco. No se exige resolver para cambiar de caso, orientación o vista.

## Archivos

- modelo.mjs: generadores propios, opciones LLL/LAL/ALA/NO y catálogo de criterios.
- animacion.mjs: SVG del clon y animación cancelable con requestAnimationFrame; responsive y movimiento reducido.
- script.mjs: criterios y conexión de la interfaz común.
- estilos.css: importa el CSS común y añade únicamente la apariencia del clon.
- juego.json: metadatos de esta actividad.
- modelo.test.mjs: 6 400 casos, medidas reales del dibujo, negativos concluyentes, correspondencias, ecuaciones, fracciones, criterios, transformaciones y contadores.

Comparte aritmética, geometría SVG, corrección, interfaz de práctica y CSS con semejanza desde ../../recursos/. Leer su README y comprobar ambos consumidores al modificarlo. Los ejercicios de congruencia muestran las figuras a una escala común: una rotación no debe aparentar un cambio de tamaño. Los cálculos geométricos internos son solo para dibujar.

## Verificación

Desde la raíz: node --test asesores/erik/kenisa/extra-mate-parte-4/juegos/triangulos-congruentes/modelo.test.mjs. Ejecutar también las pruebas de semejanza, npm run catalogo y npm run validar. Revisar ambas actividades y portada a 360, 768, 1024 y 1440 px, teclado, Enter, Escape del menú global, consola, enlaces y ausencia de desbordamiento. Probar clonación, giro, reflejo y regreso, también con clics rápidos y movimiento reducido.
