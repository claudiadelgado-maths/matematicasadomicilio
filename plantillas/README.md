# Plantillas académicas

Estas carpetas son puntos de partida y permanecen fuera de la interfaz porque sus metadatos usan `estado: "plantilla"`.

- `maestro/`: copiar a `/asesores/[id-del-asesor]/`.
- `alumno/`: copiar a `/asesores/[asesor]/[id-del-alumno]/`.
- `alumno/nueva-sesion/`: base para `/asesores/[asesor]/[alumno]/[slug]/`. La sesión real está un nivel más profundo: usa `npm run crear-sesion -- "Asesor" "Alumno" "Título"` para adaptar rutas, identidad e instrucciones automáticamente. Una copia manual requiere ajustar los enlaces relativos y las migas de pan.
- `sesion/README.md`: acceso rápido a las instrucciones de la plantilla de sesión.

Después de copiar una plantilla, sustituye todos los identificadores, rutas y textos provisionales antes de activar o publicar. Los IDs deben ser únicos en todo el repositorio.

Cada plantilla con `index.html` incluye su propio `estilos.css`. Conserva ambos juntos al copiarla. Los índices de maestro y alumno enlazan la lógica académica compartida de `/asesores/recursos/js/`; crea JavaScript local únicamente cuando la página tenga comportamiento exclusivo.
