# Herramientas internas

Estas herramientas usan únicamente módulos nativos de Node.js y no forman parte del sitio publicado en el navegador.

- `generar-catalogo.mjs`: reúne los JSON de módulos en `/recursos/datos/catalogo.json`.
- `validar-proyecto.mjs`: comprueba metadatos, identificadores, rutas, referencias HTML y sintaxis de scripts locales.

Ejecuta desde la raíz:

```powershell
npm run catalogo
npm run validar
```

El catálogo generado sí se versiona para que otras herramientas o una futura interfaz puedan consultarlo sin ejecutar Node.
