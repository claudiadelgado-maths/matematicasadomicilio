# Herramientas internas

Estas herramientas usan únicamente módulos nativos de Node.js y no forman parte del sitio publicado en el navegador.

- `generar-catalogo.mjs`: genera `/recursos/datos/catalogo.json` y la relación pública `/recursos/datos/academia.json` a partir de los metadatos distribuidos.
- `validar-proyecto.mjs`: comprueba metadatos, identificadores, estados, relaciones maestro–alumno–sesión, fechas editoriales, rutas, referencias HTML y sintaxis de scripts locales.

Ejecuta desde la raíz:

```powershell
npm run catalogo
npm run validar
```

Los datos generados se versionan para que el sitio estático pueda consultarlos sin ejecutar Node en producción. Las plantillas y los estados no publicables se excluyen de los índices visibles.
