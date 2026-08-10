# Práctica de porcentajes

Componente publicado de evaluación formativa para la sesión Porcentajes de Andrés. Contiene cuatro ejercicios independientes y generativos; cada uno evalúa una relación esencial de la teoría sin usar cronómetro, vidas ni puntuación permanente.

## Familias y variantes

1. **Parte, porcentaje y total**
   - calcular una parte porcentual;
   - descubrir qué porcentaje representa una parte;
   - recuperar el total a partir de una parte y su porcentaje.
2. **Aumentos y disminuciones**
   - aplicar un aumento o una disminución;
   - encontrar el cambio porcentual respecto del valor inicial;
   - recuperar el valor inicial dividiendo entre el factor aplicado.
3. **Descuentos**
   - calcular dinero descontado y precio final;
   - recuperar el precio original;
   - descubrir la tasa a partir de precio original y final.
4. **IVA**
   - calcular IVA y total desde la base;
   - recuperar base e IVA desde el total;
   - recuperar base y total desde el IVA conocido;
   - aplicar primero un descuento y después IVA de 16%.

## Generación y evaluación

- Cada familia prepara primero una solución exacta y construye datos compatibles alrededor de ella.
- **Nuevo ejercicio** evita repetir inmediatamente la misma pregunta siempre que la generación lo permita.
- Los resultados monetarios se redondean a dos decimales y los datos iniciales producen respuestas sencillas.
- Se admiten punto o coma decimal, separadores de miles y símbolos de moneda o porcentaje.
- **Comprobar respuesta** marca cada campo por separado, explica el siguiente paso útil y presenta un procedimiento de comprobación.
- El resumen `0 de 4` registra únicamente los cuatro problemas visibles. Generar otro problema reinicia el estado de esa familia.
- No se almacenan resultados ni se asigna una calificación permanente.

## Archivos

- `index.html`: cuatro formularios accesibles, resumen y regiones de retroalimentación.
- `script.mjs`: generadores, normalización de entradas, evaluación por campo y renderizado.
- `estilos.css`: disposición sobria, estados de respuesta y adaptación móvil.
- `../../matematicas.mjs`: renderizado compartido con KaTeX para los procedimientos dinámicos.
- `ejercicio.json`: metadatos publicados e indicación de interactividad.

Después de comprobar, cada operación se presenta con notación LaTeX y cocientes en fracción vertical. El procedimiento se vuelve a renderizar cada vez que cambia el problema, sin convertir las fórmulas en imágenes ni reducir su tamaño de lectura.

## Criterios y pruebas

- Verifica las 16 variantes posibles: 3 centrales, 6 de cambios, 3 de descuentos y 4 de IVA.
- Prueba respuestas exactas, vacías, incorrectas y corregidas; coma y punto decimal; `$`, `%` y separadores de miles.
- Comprueba varias generaciones consecutivas, estado global, foco después de **Nuevo ejercicio**, envío con Enter, menú con Escape, móvil de 360 px, escritorio, enlaces y consola.
- La teoría publicada en `../../explicacion/` es la única referencia pedagógica; no introduzcas fórmulas o contextos que no estén sustentados allí.
