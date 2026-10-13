# Casillero de Renata

Sesiones universitarias e independientes de Álgebra Lineal:

- Propiedades de un espacio vectorial: axiomas, criterio de subespacio, demostración guiada, cinco ejemplos comparativos y seis ejercicios razonados.
- Matrices y sus operaciones: dimensiones, suma, resta, escalares, producto, cero, identidad y transpuesta; producto guiado, seis ejemplos y seis ejercicios con respuesta.
- Determinantes 2 × 2 (`determinantes-2x2/`): regla ad − bc, ejemplo resuelto y tres ejercicios con respuestas desplegables. Tiene estilos propios y MathML nativo.

Cada HTML conserva su estilos.css. El diseño abierto común vive en sesiones.css, solo para Propiedades de un espacio vectorial y Matrices y sus operaciones: fórmulas sin recuadros ni barras de desplazamiento, navegación interna no fija y contenidos desplegables. Se reutilizan el renderizador matemático de Casilleros y recursos/js/sesiones-interactivas.js del área compartida de Casilleros; no hay un controlador duplicado por página.

Los ejemplos son fijos. Los botones revelan las fórmulas y los elementos details muestran las soluciones. Sin JavaScript, las fórmulas siguen presentes y los desplegables nativos funcionan. Cada sesión termina en su propio repaso y permite volver al casillero, sin llamadas a otra sesión.

El índice se genera desde usuario.json y sesion.json; no agregues tarjetas manualmente. Los indicadores de componentes describen submódulos en carpetas, no apartados integrados en la sesión. Ejecuta npm run catalogo y npm run validar tras los cambios.

## Identidad del banner

Vegetación: fondo salvia claro, hojas de monstera, helechos y ramas, con nombre verde bosque.

`recursos/identidad.css` y los dos SVG decorativos de `recursos/` se comparten únicamente entre la portada y este índice. El nombre sigue siendo texto HTML accesible. Los adornos se acomodan a las esquinas en móvil; la portada conserva la escala del 75 % y la paginación de 7. El banner interior usa el mismo diseño a tamaño completo. Los recursos no se cargan en las sesiones ni cambian sus reglas, contenido o estilos.

Al editar esta identidad, revisar ambos consumidores a 360, 768, 1024 y 1440 px: nombre legible, adornos completos, teclado, menú y Escape, enlaces a las sesiones, consola y ausencia de desplazamiento horizontal. Ejecutar `npm run catalogo` y `npm run validar`.
