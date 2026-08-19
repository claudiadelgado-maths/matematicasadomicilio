# Datos compartidos

`catalogo.json` y `academia.json` son generados por `npm run catalogo`. No deben editarse manualmente.

- `catalogo.json`: reúne módulos publicables y excluye `plantilla`, `borrador`, `archivado` e `inactivo`.
- `academia.json`: relaciona maestros activos, alumnos activos y sesiones publicadas. Alimenta `/usuarios/`, los índices de alumnos, los perfiles de maestros y los costos de la portada.

La fuente de verdad son los archivos `maestro.json`, `usuario.json` y `sesion.json` que viven junto a cada módulo.
