# Arquitectura

## Áreas públicas

| Área | Ruta | Responsabilidad |
|---|---|---|
| Inicio | `/` | Hero, búsqueda y banners de todos los casilleros, paginación y pie |
| Información | `/nosotros/`, `/contacto/`, `/legal/` | Proyecto y contacto |
| Biblioteca | `/biblioteca/` | Catálogo público de temas, calculadoras y exámenes |
| Tema | `/biblioteca/temas/[tema]/` | Componentes de un mismo conocimiento |
| Casillero | `/Casilleros/[estudiante]/` | Espacio individual del estudiante |
| Sesión | `/Casilleros/[estudiante]/[sesion]/` | Contenido y funcionamiento propios de cada sesión |

## Aislamiento

Cada módulo concreto conserva `index.html`, su `estilos.css`, `README.md` y metadatos. Añade JavaScript y recursos locales solo cuando los utiliza. Cada sesión es independiente y puede tener su propio diseño, navegación interna, componentes y reglas. No hay un formato educativo común obligatorio.

Los recursos idénticos que ya usan varios descendientes viven en el ancestro común más cercano. `Casilleros/recursos/README.md` documenta sus consumidores. La base global contiene solo identidad, accesibilidad, encabezado, pie y controles flotantes.

## Datos y orden

`usuario.json ← sesion.json` es la relación académica: el campo `usuario` de cada sesión apunta al ID estable del estudiante. No hay otro propietario intermedio.

`npm run catalogo` genera `recursos/datos/catalogo.json` y `recursos/datos/academia.json`. Este último contiene `alumnos`, una lista plana de casilleros activos con sus sesiones publicadas. Las sesiones se ordenan por fecha descendente y título. Los casilleros se ordenan por última actividad descendente y nombre; sin sesiones fechadas aparecen al final. El ID resuelve un eventual empate completo.

El buscador de la portada filtra toda la lista por nombre, sin distinguir mayúsculas ni acentos. Después aplica la paginación de 7; al cambiar la búsqueda vuelve a la primera página. No hay página adicional para el catálogo de casilleros.

## Rutas y archivos

La carpeta `Casilleros` conserva exactamente esa capitalización. Sus slugs descendientes son minúsculos, sin espacios ni acentos. Cada página pública corresponde a un directorio con `index.html`. Los enlaces e importaciones usan rutas relativas para admitir GitHub Pages bajo un subdirectorio. Cada componente permite volver a su sesión o casillero.

```text
Casilleros/
├── README.md
├── recursos/{css,js}/
└── [estudiante]/
    ├── usuario.json
    ├── README.md
    ├── index.html
    ├── estilos.css
    ├── recursos/ (solo si los utiliza)
    └── [sesion]/
        ├── sesion.json
        ├── README.md
        ├── index.html
        ├── estilos.css
        └── contenido y recursos propios
```

Los estados `plantilla`, `borrador`, `archivado` e `inactivo` se excluyen del catálogo público. No se muestran componentes opcionales vacíos. Al añadir o retirar contenido, sincroniza el módulo, su README, sus metadatos y los índices generados.
