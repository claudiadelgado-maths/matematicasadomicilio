# Plantilla de alumno

## Uso

1. Copia esta carpeta a `/[asesor]/[id-estable-del-alumno]/`.
2. Cambia `id`, `titulo`, `nombreVisible`, `ruta` y `maestro` en `usuario.json`.
3. Personaliza `simbolo`, `acento` y `fondo` con colores hexadecimales completos.
4. Cambia `data-alumno-id`, título, descripción y textos visibles de `index.html`.
5. Si el alumno todavía no tiene sesiones, elimina la subcarpeta `nueva-sesion/` de la copia. La plantilla canónica permanece aquí.
6. Cambia `estado` a `activo`, ejecuta `npm run catalogo` y después `npm run validar`.

No agregues una lista manual de sesiones. El índice académico encuentra los `sesion.json` publicados que hagan referencia al ID del alumno.
