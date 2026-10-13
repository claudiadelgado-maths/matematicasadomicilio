# Espacio de Andrés

Índice de sesiones educativas personalizadas para Andrés, estudiante de preparatoria.

El índice carga automáticamente las sesiones publicadas desde `recursos/datos/academia.json`; no agregues tarjetas manuales.

## Contenido actual

- `interes-simple-y-compuesto/`: introducción breve con fórmulas, comparación anual y dos ejercicios con respuestas desplegables. Diseño y recursos independientes.

- `porcentajes/`: sesión publicada sobre razonamiento porcentual aplicado a datos, descuentos, aumentos e IVA; incluye teoría, ejercicios, calculadoras y juego final.
- `teorema-de-tales/`: sesión publicada con explicación visual, laboratorio de paralelas, ejemplo guiado y juego interactivo. Su contrato está en el README de la sesión.

## Estado de la sesión

La explicación, los ejercicios, las calculadoras y el juego de Porcentajes se encuentran en estado `publicado`. Teorema de Tales está publicado con sus actividades integradas en la página de la sesión.

## Para una IA

No mezcles este contenido con otros usuarios. Lee `usuario.json` y el README de la sesión antes de modificarla. Mantén el índice sincronizado con las carpetas reales, evita datos personales innecesarios y usa la teoría como contrato para cualquier ampliación.

## Identidad del banner

Fútbol soccer: cancha verde, balón, portería con red y trazos de jugada, sin escudos de equipos.

`recursos/identidad.css` y los dos SVG decorativos de `recursos/` se comparten únicamente entre la portada y este índice. El nombre sigue siendo texto HTML accesible. Los adornos se acomodan a las esquinas en móvil; la portada conserva la escala del 75 % y la paginación de 7. El banner interior usa el mismo diseño a tamaño completo. Los recursos no se cargan en las sesiones ni cambian sus reglas, contenido o estilos.

Al editar esta identidad, revisar ambos consumidores a 360, 768, 1024 y 1440 px: nombre legible, adornos completos, teclado, menú y Escape, enlaces a las sesiones, consola y ausencia de desplazamiento horizontal. Ejecutar `npm run catalogo` y `npm run validar`.
