# Recursos compartidos

Esta carpeta contiene únicamente recursos usados por varias áreas:

- `css/base.css`: reinicio, variables de marca, encabezado, pie y elementos realmente comunes;
- `js/navegacion.js`: menú, navegación y comportamiento común;
- `svg/`: logotipo, favicon e iconos generales;
- `datos/README.md`: contrato de los índices temporales calculados desde los metadatos modulares.

No coloques aquí estilos, fotografías ni lógica de una página, asesor, alumno, sesión, ejercicio, juego o calculadora concreta. Cada `index.html` tiene un `estilos.css` en su misma carpeta; su JavaScript y sus recursos exclusivos también viven allí cuando hacen falta. No se crean scripts vacíos.

Una IA que cambie un archivo compartido debe identificar todos sus consumidores, mantener compatibilidad y repetir las pruebas de escritorio, móvil, teclado y consola.
