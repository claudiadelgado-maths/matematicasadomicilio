# Publicación y validación

## Lote diario

1. Reúne los cambios relacionados del día.
2. Ejecuta `npm run catalogo`.
3. Ejecuta `npm run validar`.
4. Inicia un servidor local y revisa móvil, escritorio, teclado y consola.
5. Comprueba `git diff` y `git status`.
6. Añade los archivos, crea un solo commit descriptivo y envíalo a la rama publicada.

```powershell
git add .
git commit -m "Actualiza biblioteca y sesiones del 23 de julio"
git push
```

## GitHub Pages

El sitio debe publicarse desde la raíz de la rama configurada y conservar `.nojekyll`. Las rutas son relativas para admitir dominio propio o URL de repositorio. `CNAME` conserva el dominio actual.

## Lista de salida

- validación automática sin errores;
- navegación principal y pie completos;
- redirecciones heredadas;
- PDF y archivos locales disponibles;
- interacción educativa sin errores de consola;
- 360 px sin desplazamiento horizontal;
- foco visible y orden de teclado lógico;
- metadatos y README sincronizados.
