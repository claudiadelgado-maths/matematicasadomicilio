# Examen de planteamiento de ecuaciones y despejes

Quinta actividad de EXAMEN GEOMETRÍA, KENISA / Asesor Erik. Entrada: index.html. Práctica intensiva sin calificación, independiente del modelo de entrega de las series A–D.

## Contenido

Banco finito y reproducible de **768 preguntas**, organizado en **64 familias con 12 variantes**. Solo texto y fórmulas Unicode; no contiene dibujos ni imágenes en los reactivos. Todas las respuestas son positivas y enteras; las longitudes y áreas de círculos conservan π. Cada pregunta incluye cuatro opciones distintas, una única clave y un procedimiento que se revela después de responder.

| Tema | Preguntas | Familias |
| --- | ---: | ---: |
| Relaciones entre ángulos | 144 | 12 |
| Ángulos de triángulos | 72 | 6 |
| Perímetros | 132 | 11 |
| Áreas | 132 | 11 |
| Círculos | 48 | 4 |
| Polígonos regulares | 144 | 12 |
| Semejanza | 48 | 4 |
| Pitágoras | 48 | 4 |

El análisis de la Serie A identifica **3, 9, 10, 12, 14 y 15**; consultar ANALISIS-SERIE-A.md. CATALOGO-DE-PLANTEAMIENTOS.md muestra un ejemplo resuelto de cada familia. El banco amplía los planteamientos con relaciones entre medidas, fórmulas inversas, magnitudes intermedias y situaciones sencillas. No introduce sistemas, trigonometría ni resolución general de ecuaciones cuadráticas. Pitágoras usa ternas enteras y raíces exactas antes de despejar una expresión lineal.

Las áreas de polígonos regulares no cuadrados usan una apotema geométricamente calculada y redondeada a centímetros; el enunciado avisa expresamente que el área es aproximada y se ha calculado con ese redondeo. Los cuadrados usan la apotema exacta. Esto evita presentar datos incompatibles como exactos. El contenido original de las series A–D y el PDF del autor se mantienen intactos.

## Interacción y avance

- La primera pregunta aparece inmediatamente; se puede elegir cualquiera de los ocho temas o combinarlos.
- Seleccionar una opción comprueba la respuesta de inmediato, bloquea las cuatro opciones y muestra la correcta y el procedimiento. Verde para aciertos y rosa para errores, con símbolos y texto.
- Siguiente pregunta se habilita después de responder. No hay nota, porcentaje de aciertos ni pantalla de evaluación final.
- El orden intercala familias aleatorias; una ronda recorre las 768 preguntas sin repetir ninguna respondida. El registro es global y se conserva al cambiar de tema, incluso para respuestas incorrectas. Las preguntas abandonadas sin responder siguen disponibles.
- Al terminar un tema, se puede continuar con los demás. Una nueva ronda solo se habilita cuando se agota todo el banco.
- Estado local en memoria: recargar o salir de la página reinicia la práctica, como informa la interfaz. No hay envío de respuestas, almacenamiento personal ni dependencias externas.
- Controles nativos, navegación por teclado, foco al avanzar y mensajes de estado accesibles. Diseño adaptable a móvil y escritorio.

## Archivos

- banco.mjs: 64 generadores, metadatos de los ocho temas, ecuaciones, respuestas, opciones, procedimientos y datos geométricos de verificación.
- modelo.mjs: orden, filtros, control de respuestas, progreso y rondas; sin DOM.
- script.mjs: presentación e interacción con el modelo.
- index.html, estilos.css: interfaz y estilos locales. Importa ../../estilos.css, compartido por la portada, las series A–D y esta actividad; revisar los seis consumidores si se modifica.
- examen.json: metadatos del catálogo, sincronizados con las 768 preguntas y 64 familias.
- banco.test.mjs: verifica todo el banco, la geometría, las opciones y el ciclo completo de práctica.

## Verificación

Desde la raíz del repositorio:

    node --test asesores/erik/kenisa/examen-geometria/examenes/planteamiento-de-ecuaciones-y-despejes/banco.test.mjs asesores/erik/kenisa/examen-geometria/recursos/modelo.test.mjs
    npm run catalogo
    npm run validar

Las pruebas recorren todas las variantes: ecuación con solución única, objetivo solicitado, cuatro opciones distintas y exactamente una válida; también comprueban de forma independiente las propiedades geométricas. El modelo recorre las 768 preguntas, agota todos los filtros y comienza otra ronda sin calificación.

Revisar en navegador 360, 768, 1024 y 1440 px; respuestas correctas e incorrectas, bloqueo, procedimiento, foco, filtros, ausencia de repeticiones, agotamiento y nueva ronda. Comprobar la portada y A–D por el estilo compartido, menú móvil/Escape, consola, enlaces y descarga del PDF.
