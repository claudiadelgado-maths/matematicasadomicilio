# Biología parte 1

Sesión de KENISA → Erik. Tres actividades principales para un repaso introductorio de preparatoria. Mantiene los contenidos anteriores, la fecha editorial 2026-09-29 y la identidad biológica local.

## Organización del menú

1. **Partes de la célula animal**: guía, dibujo de once estructuras y dos ejercicios internos: ¿Qué estructura es? y Piensa y responde. Estos cuestionarios permanecen en la misma página, con los anclajes #actividad-2 y #actividad-3 para conservar los enlaces existentes; no son tarjetas independientes del menú.
2. **Biomoléculas**: laboratorio de siete grupos, preguntas de función y clasificación.
3. **Niveles de organización biológica**: recorrido ilustrado por ocho niveles, construcción del orden y evaluación.

La portada conserva el plan Comprende → Practica → Refuerza y la autoevaluación. La navegación continúa desde los ejercicios de célula hacia biomoléculas y de allí a niveles de organización. Cada actividad permite volver al menú.

## Contenido y recursos

- ejercicios/partes-de-la-celula-animal/: once correspondencias; 55 pistas y 44 preguntas de razonamiento conservadas. Rondas de 11 o 22, explicación y repaso de errores separado del resultado inicial.
- ejercicios/biomoleculas/: siete grupos con 21 pasos de demostración, 49 preguntas (rondas de 7 o 14) y 56 tarjetas de clasificación (rondas de 14). Repaso de preguntas y tarjetas difíciles.
- ejercicios/niveles-de-organizacion/: átomo, molécula, organelo, célula, tejido, órgano, sistema o aparato y organismo. Ilustraciones propias SVG, conexiones entre niveles, comparación persona/bacteria, escalera de tarjetas y 24 preguntas originales en rondas de 8 o 16. Sin bloqueo de acceso. Su README documenta el criterio científico, la interacción y las fuentes.
- recursos/biologia.css: identidad común y prioridad de [hidden], consumida por las cuatro páginas.
- recursos/estudio.css: guías y autoevaluación del inicio, célula y biomoléculas.
- recursos/celula-animal.svg: dibujo compartido entre portada y célula. No se modificó.
- recursos/cuestionarios.css y cuestionarios.mjs: interfaz de cuestionarios compartida por célula y biomoléculas. No se modificó.
- recursos/modelo-repaso.mjs: generación, mezcla, puntuación y repaso de errores; consumido ahora por los tres módulos de ejercicios. Se reutiliza sin modificarlo.
- sesion.json declara únicamente ejercicios como componente disponible. Explicaciones, demostraciones y juegos forman parte de esas páginas; no se anuncian componentes vacíos.

## Contrato

Desde 2026-10-16, `../biologia-parte-3/ejercicios/procariotas-y-eucariotas/` también consume `recursos/cuestionarios.css`, `cuestionarios.mjs` y `modelo-repaso.mjs` sin modificarlos. Al cambiar estos recursos compartidos, revisar además las rondas 10/20 y el repaso de errores de esa actividad. Su diseño propio está en Parte 3.

Conservar slug biologia-parte-1, ID biologia-parte-1-kenisa-erik, usuario kenisa-erik y ruta /Casilleros/kenisa/biologia-parte-1/. Los módulos conservan sus identidades y rutas. No renombrar los anclajes históricos de la célula. Estado publicado y fecha editorial 2026-09-29.

Recursos globales: marca, base.css, navegacion.js, pie y controles flotantes. Rutas relativas con index.html y profundidad de cuatro niveles en portada/seis en ejercicios. JavaScript nativo, sin dependencias, cuentas, almacenamiento ni envíos. Resultados y progreso viven solo mientras se mantiene abierta cada página.

## Verificación

Ejecutar npm run catalogo y npm run validar. Ejecutar los cuatro archivos modelo*.test.mjs de célula, biomoléculas, niveles y recursos/modelo-repaso.test.mjs.

Revisar las cuatro páginas a 360/768/1024/1440 px: menú con exactamente tres tarjetas, enlaces y anclajes históricos, teclado, foco, tacto, movimiento reducido, consola y ausencia de desbordamiento. Comprobar independencia entre tableros, cuestionarios y repaso de errores.

En niveles: ocho paradas en cualquier orden; anterior/siguiente; comparación persona/bacteria; escalera con error, corrección, final y reinicio; rondas de 8/16, explicación, puntaje único, resultado perfecto sin controles vacíos y repaso con calificación inicial inalterada. Revisar también los bancos previos al modificar cualquier recurso compartido.

La actividad 02 de Parte 3, `../biologia-parte-3/ejercicios/celula-vegetal/`, también reutiliza `recursos/cuestionarios.css`, `cuestionarios.mjs` y `modelo-repaso.mjs` sin modificarlos. Incluir sus rondas 8/16 y sus prácticas en la revisión de futuros cambios a estos recursos.

La actividad 03 de Parte 3 (`../biologia-parte-3/ejercicios/clasificacion-de-los-seres-vivos/`) también consume `recursos/cuestionarios.css`, `cuestionarios.mjs` y el modelo de repaso, sin modificarlos. Su banco contiene diez categorías y 60 preguntas; las rondas son de 10/20. Incluirla al revisar cambios de estos recursos compartidos.

La actividad 04 de Parte 3 (`../biologia-parte-3/ejercicios/reino-fungi/`) consume el motor `cuestionarios.mjs`, `cuestionarios.css` y `modelo-repaso.mjs` sin cambios. Diez categorías y 60 preguntas; rondas 10/20. Revisar este consumidor al modificar el motor compartido.
