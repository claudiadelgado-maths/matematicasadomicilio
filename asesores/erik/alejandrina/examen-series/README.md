# Examen series

Sesión de Alejandrina con Erik, creada el 2026-09-30. Especificación en ENCARGO.md; avance y punto de reanudación en ETAPAS.md. Implementación por etapas: no rehacer las ya completadas. El menú anuncia solo actividades implementadas.

## Contrato

Conservar id examen-series-alejandrina, slug examen-series, usuario alejandrina, estado publicado, fecha 2026-09-30 y ruta /asesores/erik/alejandrina/examen-series/. El casillero se actualiza mediante el catálogo; no añadir tarjetas manuales. Componentes: ejercicios reales, sin teoría, calculadoras o juegos vacíos.

## Archivos y comportamiento

- recursos/actividades.mjs: actividades disponibles y casos verticales.
- recursos/modelo.mjs: generación progresiva; primeros tres ejercicios sencillos por sección y filtro, después negativos y fracciones. Evita identificación ambigua por sucesiones constantes.
- recursos/fracciones.mjs: racionales reducidos con BigInt. Enteros, decimales con punto/coma y fracciones equivalentes. No acepta denominador cero ni entradas vacías como cero.
- recursos/practica.mjs: interfaz y comprobación inmediata; verde/rojo y texto, reintentos, contadores y otro ejercicio. Sin teoría añadida. Estado de estudiante en memoria, sin datos personales.
- recursos/banco-ejercicios.mjs: 31 ejercicios fijos (16 aritméticos y 15 geométricos), con datos y soluciones editoriales inmutables. Solo se baraja el orden.
- recursos/banco-problemas.mjs: 20 problemas fijos (10 por tipo), con objetivos variados y unidades explícitas. No muestra fórmulas ni pistas de clasificación en el enunciado de la ronda mixta.
- recursos/sesion.css: diseño exclusivo de la sesión; cada página conserva estilos.css local.
- herramientas/construir.mjs: herramienta opcional de mantenimiento que escribe HTML, README, JSON, menú y enlaces a partir de actividades registradas. El sitio se sirve directamente, sin compilación obligatoria ni dependencias de producción nuevas.

KaTeX 0.18.1 con CDN y SRI, igual que la sesión existente de series geométricas. Si no carga, se conserva la fuente LaTeX legible; al terminar la carga se renderiza de nuevo. No se usan recursos específicos de otros alumnos. Dependencias globales: base.css, navegacion.js y marca. Conservar menú, logotipo, pie, salto al contenido y controles flotantes; rutas relativas con directorio/index.html.

## Actividades publicadas en el catálogo

1. Identificar la sucesión.
2. Hallar d o r: sucesión, consecutivos, primero y otro término, dos términos cualesquiera.
3. Hallar a₁: tres casos, con d/r antes de a₁ cuando corresponde.
4. Hallar aₙ y n: dos secciones; los logaritmos usan razón positiva distinta de 1.
5. Sumas: cinco casos, incluidos despejes y suma entre posiciones. Las raíces pares especifican el signo de r cuando es necesario.
6. Mini examen de ejercicios: banco fijo, selector por tipo, reintentos y resultado al completar la ronda.
7. Mini examen de problemas aplicados: banco fijo y mismo flujo de examen.
8. Medios: aritméticos primero, geométricos después; una casilla por medio, extremos visibles y comprobación individual o conjunta.

Cada filtro conserva su ronda, sus respuestas y sus señales de acierto o error durante la visita a la página. Al editar una respuesta equivocada se retira su validación anterior hasta comprobar el nuevo valor. Recargar o cambiar de página reinicia el avance de la alumna. El registro ETAPAS.md conserva el avance del desarrollo, no las respuestas de la alumna. No se guardan calificaciones ni datos personales.

## Verificación

Ejecutar los comandos de ETAPAS.md. Revisar 360/768/1024/1440 px, teclado, menú Escape, filtros, LaTeX, entradas inválidas, fracciones equivalentes, reintentos, generación repetida, navegación y consola. Los bancos fijos de los mini exámenes deben permanecer invariables; solo se mezcla el orden.
