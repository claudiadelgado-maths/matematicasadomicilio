# Casillero de Renata

Dos sesiones universitarias e independientes de Álgebra Lineal:

- Propiedades de un espacio vectorial: axiomas, criterio de subespacio, demostración guiada, cinco ejemplos comparativos y seis ejercicios razonados.
- Matrices y sus operaciones: dimensiones, suma, resta, escalares, producto, cero, identidad y transpuesta; producto guiado, seis ejemplos y seis ejercicios con respuesta.

Cada HTML conserva su estilos.css. El diseño abierto común vive en sesiones.css, solo para estas dos sesiones: fórmulas sin recuadros ni barras de desplazamiento, navegación interna no fija y contenidos desplegables. Se reutilizan el renderizador matemático de asesores y recursos/js/sesiones-interactivas.js del salón de Elizabeth; no hay un controlador duplicado por página.

Los ejemplos son fijos. Los botones revelan las fórmulas y los elementos details muestran las soluciones. Sin JavaScript, las fórmulas siguen presentes y los desplegables nativos funcionan. Cada sesión termina en su propio repaso y permite volver al casillero, sin llamadas a otra sesión.

El índice se genera desde usuario.json y sesion.json; no agregues tarjetas manualmente. Los indicadores de componentes describen submódulos en carpetas, no apartados integrados en la sesión. Ejecuta npm run catalogo y npm run validar tras los cambios.
