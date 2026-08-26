# Plantillas académicas

Estas carpetas son puntos de partida y permanecen fuera de la interfaz porque sus metadatos usan `estado: "plantilla"`.

- `maestro/`: copiar a `/asesores/[id-del-asesor]/`.
- `alumno/`: copiar a `/asesores/[asesor]/[id-del-alumno]/`.
- `alumno/nueva-sesion/`: plantilla de sesión colocada a la misma profundidad que una sesión real; puede copiarse de forma independiente a `/asesores/[asesor]/[alumno]/[slug]/`.
- `sesion/README.md`: acceso rápido a las instrucciones de la plantilla de sesión.

Después de copiar una plantilla, sustituye todos los identificadores, rutas y textos provisionales antes de activar o publicar. Los IDs deben ser únicos en todo el repositorio.

Cada plantilla con `index.html` incluye su propio `estilos.css`. Conserva ambos juntos al copiarla. Mantén el JavaScript local únicamente cuando la página tenga comportamiento propio; no dejes scripts vacíos.
