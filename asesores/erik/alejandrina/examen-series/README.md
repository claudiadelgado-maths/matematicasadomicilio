# Examen series

Sesión de Alejandrina con Erik, creada el 2026-09-30. Especificación en ENCARGO.md; avance y punto de reanudación en ETAPAS.md. Implementación por etapas: no rehacer las ya completadas. El menú anuncia solo actividades implementadas.

## Contrato

Conservar id examen-series-alejandrina, slug examen-series, usuario alejandrina, estado publicado, fecha 2026-09-30 y ruta /asesores/erik/alejandrina/examen-series/. El casillero se actualiza mediante el catálogo; no añadir tarjetas manuales. Componentes: ejercicios reales, sin teoría, calculadoras o juegos vacíos.

## Archivos y comportamiento

- recursos/actividades.mjs: actividades disponibles y casos verticales.
- recursos/modelo.mjs: generación progresiva; primeros tres ejercicios sencillos por sección y filtro, después negativos y fracciones. Evita identificación ambigua por sucesiones constantes.
- recursos/fracciones.mjs: racionales reducidos con BigInt. Enteros, decimales con punto/coma y fracciones equivalentes. No acepta denominador cero ni entradas vacías como cero.
- recursos/practica.mjs: interfaz y comprobación inmediata; verde/rojo y texto, reintentos, contadores y otro ejercicio. Sin teoría añadida. Estado de estudiante en memoria, sin datos personales.
- recursos/sesion.css: diseño exclusivo de la sesión; cada página conserva estilos.css local.
- herramientas/construir.mjs: herramienta opcional de mantenimiento que escribe HTML, README, JSON, menú y enlaces a partir de actividades registradas. El sitio se sirve directamente, sin compilación obligatoria ni dependencias de producción nuevas.

KaTeX 0.18.1 con CDN y SRI, igual que la sesión existente de series geométricas. Si no carga, se conserva la fuente LaTeX legible; al terminar la carga se renderiza de nuevo. No se usan recursos específicos de otros alumnos. Dependencias globales: base.css, navegacion.js y marca. Conservar menú, logotipo, pie, salto al contenido y controles flotantes; rutas relativas con directorio/index.html.

## Verificación

Ejecutar los comandos de ETAPAS.md. Revisar 360/768/1024/1440 px, teclado, menú Escape, filtros, LaTeX, entradas inválidas, fracciones equivalentes, reintentos, generación repetida, navegación y consola. Los bancos fijos de los mini exámenes deben permanecer invariables; solo se mezcla el orden.
