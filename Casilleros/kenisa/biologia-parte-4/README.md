# Biología parte 4 · KENISA

Sesión `biologia-parte-4-kenisa-erik`, usuario `kenisa-erik`. Entrada pública: `/Casilleros/kenisa/biologia-parte-4/index.html`. Fecha editorial: 2026-10-18. Sitio estático, sin dependencias nuevas, cuentas, almacenamiento ni envío de respuestas.

## Alcance real

Las cuatro actividades están completas y disponibles desde la portada, con continuidad entre ellas:

1. **Membrana plasmática y transporte celular:** guía, cinco componentes explorables, funciones, tres recorridos pasivos, laboratorio de ósmosis animal/vegetal, bomba sodio-potasio, recorridos vesiculares, doce casos y 60 preguntas.
2. **Metabolismo celular y ATP:** guía, cinco estaciones (diez procesos, ciclo ATP/ADP, tres relaciones enzimáticas, cinco retos de condiciones y ocho situaciones energéticas), ocho casos guiados y 48 preguntas.
3. **Respiración celular:** guía, mapa de cuatro etapas, ordenamiento, dieciséis casos, ocho afirmaciones verdadero/falso y 48 preguntas.
4. **Fermentación:** guía, simulador de NAD⁺ para dos rutas, cinco relaciones entre organismos y productos, cinco comparaciones de ATP, doce casos y 48 preguntas. Cierra la sesión conectando nutrientes, transporte, metabolismo y energía.

Cada actividad conserva README, modelos, pruebas y JSON en `ejercicios/[actividad]/`. En total hay 204 preguntas originales. Los cuatro exámenes reutilizan el motor de Biología parte 1, con explicación y repaso de errores sin alterar la nota inicial. Progreso solo durante la visita, reinicios independientes y navegación libre.

## Recursos y consumidores

- `index.html`, `estilos.css`: menú y presentación exclusiva de portada.
- `sesion.json`: metadatos; solo declara ejercicios como componente disponible.
- `recursos/sesion.css`: identidad bajo `.bio4`, compartida por la portada y las cuatro actividades. Usa `fredoka.ttf` del casillero mediante ruta relativa. No se ha modificado al añadir las actividades 02–04.
- SVG de cada actividad (`membrana.svg`, `atp.svg`, `mitocondria.svg`, `fermentacion.svg`): consumidos también por la portada. Las copias internas interactivas de membrana y mitocondria deben mantenerse sincronizadas; lo comprueban sus pruebas.
- `../biologia-parte-1/recursos/cuestionarios.css`, `cuestionarios.mjs`, `modelo-repaso.mjs`: motor común sin modificaciones, consumidor nuevo documentado en su README.
- Navegación, marca, base, pie y flotantes globales mediante rutas relativas, sin cambios.

No alterar IDs ni rutas. No anunciar módulos ni componentes vacíos. El índice del casillero se actualiza mediante `npm run catalogo`.

## Comprobaciones

Desde la raíz: ejecutar con `node --test` los cuatro archivos `modelo.test.mjs` de esta sesión, `npm run catalogo` y `npm run validar`.

Revisar las cinco páginas a 360/768/1024/1440 px, menú y Escape, foco, enlaces, consola e imágenes, sin desbordamiento horizontal. Los README de actividad documentan interacciones y criterios de prueba.

Las actividades 01–03 ya fueron verificadas en navegador, con cinco, siete y cinco pruebas aprobadas respectivamente. Los diez errores previos de metadatos en Andrés/interés simple y compuesto y Renata/determinantes 2x2 quedaron corregidos el 2026-10-18 a petición del usuario: se desactivaron declaraciones de subcarpetas inexistentes, conservando sus contenidos integrados y rutas.

Cierre verificado (2026-10-18): cuatro actividades completas, 23 pruebas aprobadas (5 + 7 + 5 + 6). Actividad 04 comprobada en navegador: ambas rutas, pasos inválidos, cinco relaciones, cinco cantidades de ATP, doce casos, conteo único y tablero 4/4; reinicios independientes; examen 7/8 y repaso 1/1 conservando nota, más inicio de ronda de 16. Móvil y escritorio a 360/768/1024/1440 px sin desbordamiento, imágenes cargadas, foco visible y menú por Enter/Escape; consola sin errores. Portada con cuatro tarjetas y continuidad 03 → 04 comprobadas. Auditoría de 461 referencias locales entre esta sesión y las dos sesiones de metadatos corregidos, sin errores. `npm run catalogo`: 296 módulos y 21 casilleros; `npm run validar`: 333 HTML y 298 metadatos, sin errores ni avisos.

## Consumidor adicional: Biología examen (2026-10-18)

`../biologia-examen/examenes/opcion-multiple/banco.mjs` importa los bancos de todas las actividades de esta parte sin modificar sus fuentes ni motores. El README de ese examen enumera los archivos y cantidades. Al cambiar esos datos o ilustraciones, revisar el examen combinado, sus claves, persistencia y pruebas; sincronizar sus metadatos y cantidades si cambia el total.
