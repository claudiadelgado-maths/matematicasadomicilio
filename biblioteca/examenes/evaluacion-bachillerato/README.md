# Evaluación bachillerato

Examen web publicado en Biblioteca > Exámenes. Transcribe los cinco problemas de la actividad “Momento de aprender” proporcionada en `Proyecto_educativo_Problemas_S1_08092025.pdf`, sin generación aleatoria, campos de respuesta, calificación ni almacenamiento de datos.

## Contenido publicado

1. Resolución formal y justificada de una ecuación cuadrática con términos fraccionarios, radicales y decimales periódicos.
2. Verificación sobrenatural mediante áreas geométricas.
3. El árbol sagrado de la antigua leyenda.
4. Ecuación de la recta a partir de dos puntos.
5. Dominio de una función con raíz y fracción.

Cada problema conserva su planteamiento, conceptos previos, desarrollo por pasos, conclusión y solución resumida. Las expresiones matemáticas se escriben en LaTeX y se renderizan mediante KaTeX 0.18.1. Las aproximaciones y conclusiones se mantienen como aparecen en el documento fuente.

## Interacción

Cada problema ofrece dos controles independientes:

- **Solución rápida:** muestra u oculta la solución resumida del PDF.
- **Solución detallada:** muestra u oculta conceptos, desarrollo y conclusión.

Los botones declaran `aria-expanded` y `aria-controls`, actualizan su texto al abrirse y vuelven a comprimir el panel al pulsarse nuevamente. No se registran respuestas ni progreso.

## Recursos propios

- `index.html`: cinco problemas, soluciones, navegación y estructura accesible.
- `estilos.css`: composición editorial, colores por área, estados de foco y adaptación responsiva.
- `script.js`: apertura y cierre independiente de los diez paneles de solución.
- `examen.json`: metadatos del recurso publicado.
- `recursos/cultivo-circular.svg`: reconstrucción vectorial del círculo y el triángulo del problema 2.
- `recursos/arbol-sagrado.svg`: reconstrucción vectorial del árbol y el triángulo trigonométrico del problema 3.

## Pruebas que deben conservarse

- Los cinco enunciados y las diez soluciones coinciden con el documento fuente.
- Todas las fórmulas se renderizan sin errores de KaTeX ni delimitadores visibles.
- Cada botón abre únicamente su panel, vuelve a cerrarlo y conserva un nombre accesible coherente.
- Las dos soluciones de un mismo problema pueden permanecer abiertas simultáneamente.
- Los SVG conservan los datos relevantes: círculo, triángulo, base 8 m, altura 13 m y radio 10 m en el problema 2; distancia 200 m y ángulo de 60° en el problema 3.
- La página funciona a 360, 768, 1024 y 1440 px sin desplazamiento horizontal.
- Menú, teclado, tecla Escape, consola, migas de pan, enlaces y botón flotante funcionan correctamente.
