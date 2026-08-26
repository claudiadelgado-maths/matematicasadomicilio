# Asesores

Esta carpeta contiene el catálogo público de salones y todos los asesores. Cada subcarpeta de asesor se publica directamente desde `main` en `/asesores/[asesor]/`.

## Estructura

```text
asesores/
├── index.html
├── estilos.css
└── [asesor]/
    ├── index.html
    ├── maestro.json
    ├── README.md
    ├── recursos propios opcionales
    └── [alumno]/
        ├── index.html
        ├── usuario.json
        ├── README.md
        └── [sesion]/
```

`maestro.json` conserva el nombre técnico de los metadatos. Una subcarpeta se reconoce como alumno por contener `usuario.json`, y una subcarpeta del alumno se reconoce como sesión por contener `sesion.json`. Los alumnos no se enumeran manualmente: cada `usuario.json` indica a qué asesor pertenece y `npm run catalogo` calcula el catálogo académico.

No existen carpetas intermedias llamadas `alumnos` o `sesiones`: la estructura es siempre `asesores/[asesor]/[alumno]/[sesion]/`. Las plantillas sin datos reales viven por separado en `/plantillas/`.

Los archivos de esta carpeta se sirven tal como están con `python -m http.server 8000` y se publican directamente desde `main`. No hay construcción ni copia a otro directorio.
