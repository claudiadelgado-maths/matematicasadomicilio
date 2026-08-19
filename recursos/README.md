# Recursos compartidos

Esta carpeta contiene únicamente recursos usados por varias áreas:

- `css/sistema-visual.css`: identidad, disposición general y componentes históricos;
- `css/modulos.css`: catálogos, tarjetas, migas de pan y cabeceras modulares;
- `js/navegacion.js`: menú, navegación y comportamiento común;
- `svg/`: logotipo, favicon e ilustraciones generales;
- `imagenes/`: fotografías generales;
- `datos/catalogo.json`: índice público generado desde metadatos.
- `datos/academia.json`: relación generada maestro → alumnos → sesiones para las interfaces académicas.

No coloques aquí la lógica de un ejercicio, juego o calculadora concreta. Si un archivo solo pertenece a un módulo, debe vivir dentro de ese módulo.

Una IA que cambie un archivo compartido debe identificar todos sus consumidores, mantener compatibilidad y repetir las pruebas de escritorio, móvil, teclado y consola.
