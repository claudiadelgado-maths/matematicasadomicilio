# Biología parte 1

Sesión independiente de Kenia, del asesor Erik. Incluye un plan de estudio para secundaria, guías breves, tres actividades de once estructuras y un laboratorio de siete grupos de sustancias con dos prácticas. El repaso de organelos conserva sus 99 preguntas sin duplicarlas y muestra tres opciones por pregunta. La fecha editorial se conserva en 2026-09-29.

Lee este README y sesion.json antes de trabajar, también si eres una IA.

## Estructura y contenido real

- index.html: presentación, plan Comprende → Practica → Refuerza, cuatro accesos a actividades, enlaces a ambas guías y lista de autoevaluación sin almacenamiento.
- estilos.css: composición exclusiva del menú.
- recursos/biologia.css: identidad local de las tres páginas; su utilidad [hidden] tiene prioridad para ocultar componentes opcionales incluso si son botones flex. recursos/estudio.css comparte las guías, vocabulario, tablas adaptables y autoevaluación. Revisar las tres páginas cuando cambien.
- recursos/celula-animal.svg: ilustración educativa vectorial de 680 × 820, común a las dos páginas. Membrana turquesa y organelos diferenciados por forma y color; revisar las coordenadas de los indicadores de la actividad cuando se modifique.
- ejercicios/partes-de-la-celula-animal/: las tres actividades en un solo index.html, con README y ejercicio.json sincronizados. Actividad 1 conserva banco vertical izquierdo, líneas resaltables y célula a la derecha; hasta 950 px, el dibujo queda arriba y las tarjetas debajo. Relaciona once nombres por arrastre, toque o teclado; corrige de inmediato y permite comprobar y reiniciar.
- Actividad 2, #actividad-2: **¿Qué estructura es?**, con 55 pistas reformuladas (cinco por estructura).
- Actividad 3, #actividad-3: **Piensa y responde**, con 44 preguntas originales (cuatro por estructura): situaciones, fallas, comparaciones, funciones, excepciones, rutas y razonamiento.
- Ambos cuestionarios ofrecen 11 preguntas (una por estructura) o 22 (dos por estructura), con tres opciones, una respuesta puntuable, explicación y resultado. Se conservan las 99 preguntas originales. Al terminar se pueden consultar las respuestas falladas y sus explicaciones y practicar solo esos errores con opciones mezcladas. El repaso tiene puntaje propio y conserva visible la calificación inicial; no equivale a una nueva ronda completa.
- recursos/cuestionarios.css, cuestionarios.mjs y modelo-repaso.mjs: presentación, controlador y motor comunes a organelos y biomoléculas; revisar ambas páginas consumidoras si cambian. Los archivos particulares de cada ejercicio configuran sus bancos y comportamientos.
- ejercicios/biomoleculas/: laboratorio SVG de siete grupos, panel con funciones y demostraciones, 49 preguntas de función con tres opciones y 56 tarjetas de clasificación. El cuestionario permite 7 o 14 preguntas. La clasificación tiene rondas de 14 y un repaso opcional de las tarjetas que necesitaron pistas, con puntaje separado. La clasificación permite arrastrar, tocar o usar teclado; los errores dan pistas y se pueden corregir. Su README y ejercicio.json documentan el contenido real.
- sesion.json declara ejercicios como componente disponible. Las demostraciones y la clasificación forman parte del ejercicio de biomoléculas; no tienen módulos separados.

La lista del inicio enlaza a la actividad 1, a los anclajes de las actividades 2 y 3 y al laboratorio de biomoléculas. La guía de funciones incluye once fichas, ruta de proteínas de secreción, vocabulario y distinciones habituales. La guía de biomoléculas distingue sustancias orgánicas e inorgánicas y añade una tabla de función/ejemplo y comparaciones. El final del repaso de organelos continúa a ese laboratorio, que también permite regresar a los organelos o al menú. La navegación interna permite recorrerlas sin salir de la página, volver al dibujo o regresar al menú. No existen tarjetas o módulos futuros vacíos.

## Contrato que debes conservar

- No renombrar biologia-parte-1, index.html, estilos.css, sesion.json ni README.md.
- Conservar id = biologia-parte-1-kenia-erik; slug = biologia-parte-1; tipo = sesion; usuario = kenia-erik; ruta = /asesores/erik/kenia/biologia-parte-1/.
- Conservar estado = publicado para aparecer en el casillero. Los dos recorridos actuales están disponibles: organelos y biomoléculas.
- Conservar fecha editorial = 2026-09-29 hasta que el responsable de incorporación decida actualizarla.
- Mantener encabezado, logotipo, menú, pie, enlace de salto y main con id contenido. Las migas del inicio enlazan al alumno (../) y al asesor (../../).
- Mantener las referencias relativas a ../../../../recursos/css/base.css, ../../../../recursos/js/navegacion.js y ../../../../recursos/svg/ desde el inicio. Las páginas descendientes ajustan su profundidad. El script global genera los controles flotantes; no duplicarlos.
- Trabajar en esta carpeta. Actualizar descripción, objetivo, conocimientos previos y componentes según el contenido real; sincronizar este README.
- Sitio estático con JavaScript nativo, sin framework, dependencias de producción ni almacenamiento de respuestas.

## Entrega y sustitución

La carpeta completa biologia-parte-1 conserva su ubicación dentro de /asesores/erik/kenia/. No es una copia autónoma del sitio: utiliza los recursos globales documentados.

Los cambios se sirven directamente al recargar por HTTP. Para reflejar metadatos en el casillero, ejecutar desde la raíz npm run catalogo y npm run validar; no editar los índices derivados manualmente.

## Verificación

Abrir /asesores/erik/kenia/biologia-parte-1/ desde el servidor local. Revisar Inicio → Comenzar → las tres actividades → Volver al inicio y los dos accesos con anclaje. Probar las once correspondencias y 11 / 11 de la actividad visual. En los dos cuestionarios, completar rondas, acertar, fallar, comprobar que un doble clic no duplica puntos, leer explicaciones, avanzar, ver puntaje y reiniciar. Comprobar independencia de las tres actividades. En biomoléculas, probar los siete descubrimientos y demostraciones, rondas de 14, corrección y puntaje, clasificación por arrastre/toque/teclado y reintentos. Revisar las tres páginas en 360, 768, 1024 y 1440 px, ratón, tacto, teclado, foco, movimiento reducido, menú con Escape, consola, enlaces y ausencia de desbordamiento horizontal.

Prueba automatizada local: node --test asesores/erik/kenia/biologia-parte-1/ejercicios/partes-de-la-celula-animal/modelo-cuestionarios.test.mjs.

Prueba de biomoléculas: node --test asesores/erik/kenia/biologia-parte-1/ejercicios/biomoleculas/modelo.test.mjs. Los dos recorridos comparten el motor de cuestionarios; ejecutar ambas pruebas cuando cambie.

## Revisión para secundaria (2026-09-29)

Se conservaron los bancos de 55 pistas, 44 situaciones, 49 preguntas de biomoléculas y 56 tarjetas. Las explicaciones son ayudas de estudio, no una promesa de coincidencia con un examen específico. Las demostraciones tienen tres pasos seleccionables, etiquetas y explicación; el caso de carbohidratos conecta energía de glucosa, ATP y trabajo celular.

Las preferencias de ronda y resultados viven solo en memoria. Cambiar de sección de la misma página no reinicia otra actividad; navegar a otra página o recargar sí lo hace. No hay cuentas, almacenamiento ni envíos.

Además de las dos pruebas existentes, ejecutar:
`node --test asesores/erik/kenia/biologia-parte-1/recursos/modelo-repaso.test.mjs`.

Comprobar los dos tamaños de ronda, repaso de errores (incluido un segundo repaso), calificación inicial inalterada, estados perfectos sin paneles vacíos, clasificación dirigida y regreso a una ronda de 14. Revisar las tres páginas consumidoras de estilos comunes, especialmente guías abiertas en 360 px, teclado, toques, arrastres, movimiento reducido y enlaces con fragmentos.
