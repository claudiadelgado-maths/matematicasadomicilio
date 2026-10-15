# Tablas de multiplicar — Elyan

Sesión del 2026-10-15 para Elyan, 8 años (`elyan-claudia`). Ruta: `/Casilleros/elyan/tablas-de-multiplicar/index.html`. ID `tablas-de-multiplicar-elyan`. Dos juegos, sin teoría ni cronómetro. Solo se declara el componente `juegos`.

## Contenido y reglas

- **El camino de los saltos:** diez niveles, tablas 1–10. La rana empieza en cero y elige entre cuatro islas en cruz el siguiente resultado de sumar el número de la tabla. Diez saltos correctos completan el nivel y desbloquean el siguiente. Una respuesta incorrecta anima una caída, revela la suma correcta y devuelve al cero; el botón de reintento habilita otra salida. No hay vidas ni penalización temporal. Permite repetir cualquier nivel desbloqueado y reiniciar sin perder las metas.
- **Trivia de multiplicaciones:** en orden, factores 1–10 de una tabla seleccionable; mezclada, veinte preguntas únicas, dos de cada tabla. Cuatro opciones diferentes y razonables por pregunta. La primera elección cuenta; acierto o error muestran el resultado y el botón Siguiente. Contadores, progreso, resumen y repetición. Cambiar modo/tabla reinicia la ronda.

## Archivos y dependencias

`index.html` y `estilos.css` son el menú. `recursos/sesion.css` es exclusivo de las tres páginas. `recursos/modelo.mjs` comparte opciones, mezcla, progreso de niveles y modelos de ambos juegos. `menu.mjs` muestra las metas. SVG propios `rana.svg` y `aventura.svg`, sin paquetes, fuentes externas ni recursos de otros alumnos. Cada juego conserva HTML, CSS, script, README y JSON propios.

Dependencias globales sin cambios: `recursos/css/base.css`, `recursos/js/navegacion.js` y SVG de marca. Header, footer y flotantes coherentes con el sitio. Enlaces relativos terminados en `index.html`. Casillero actualizado desde catálogo, nunca con tarjetas manuales.

## Estado y accesibilidad

Solo los números de las tablas completadas se guardan en localStorage, clave `mad:elyan:tablas:v1`. No guarda nombres, respuestas o calificaciones. La carga valida enteros consecutivos entre 1 y 10; datos dañados o almacenamiento bloqueado no detienen el juego. El salto actual y toda la trivia duran la visita. El menú recupera las metas al volver. El índice del casillero sigue sin almacenar datos.

Botones nativos, Tab/Enter, foco visible, mensajes `role=status`, etiquetas en opciones y estados textuales además del color. El modo de movimiento reducido elimina las animaciones. Reiniciar/cambiar nivel cancela movimientos; salir cancela la animación y ocultar la pestaña durante un salto restablece el nivel actual. Se bloquean elecciones dobles durante el salto. No depende de sonido ni velocidad. Sin JS se muestran enlaces y aviso de activación.

## Verificación

Desde la raíz: `node --test Casilleros/elyan/tablas-de-multiplicar/recursos/modelo.test.mjs`, `npm run catalogo` y `npm run validar`. Seis pruebas verifican 100 productos/opciones, diez niveles completos, desbloqueos, caída, repetición, persistencia inválida/bloqueada, composición de rondas y contadores.

Revisar las tres páginas a 360/768/1024/1440 px, teclado, menú/Escape, consola, recursos y enlaces. Probar salto correcto, caída, reinicio durante movimiento, final/desbloqueo, vuelta al menú, reanudación, trivia ordenada/mezclada, errores y resultados. Al modificar recursos compartidos comprobar ambos juegos y el menú.
