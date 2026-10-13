# Datos compartidos

`catalogo.json` y `academia.json` se generan con `npm run catalogo`. No se editan a mano.

- `catalogo.json`: módulos publicables; excluye `plantilla`, `borrador`, `archivado` e `inactivo`.
- `academia.json` (esquema 2): lista plana `alumnos` de casilleros activos, con personalización, última actividad y sesiones publicadas. Alimenta la portada y el índice de cada estudiante.

Los casilleros se ordenan por última sesión publicada descendente, nombre e ID. Las sesiones se ordenan por fecha descendente y título. La fuente de verdad permanece en los `usuario.json` y `sesion.json` locales.
