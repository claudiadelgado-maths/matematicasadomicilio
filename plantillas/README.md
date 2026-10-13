# Plantillas académicas

Puntos de partida excluidos del catálogo porque sus metadatos usan `estado: plantilla`:

- `alumno/`: base de `/Casilleros/[estudiante]/`.
- `alumno/nueva-sesion/`: entrada mínima de `/Casilleros/[estudiante]/[sesion]/`, con la misma profundidad de rutas relativas.
- `sesion/README.md`: acceso rápido a las instrucciones de creación.

Usa `npm run crear-sesion -- "Estudiante" "Título" [AAAA-MM-DD]` para crear una sesión visible. La plantilla aporta navegación y metadatos, sin imponer un formato educativo. Cada sesión decide su contenido, presentación y funciones.

Sustituye identificadores, rutas y textos provisionales antes de activar un casillero. Conserva cada `index.html` junto a su `estilos.css`. La carga de sesiones del casillero se reutiliza desde `/Casilleros/recursos/js/alumno.js`.
