# Desarrollo de Series geométricas

## Etapa 1 — completada

Menú, trece páginas físicas, explicaciones breves con LaTeX, ejemplos desplegables, Continuar y Menú, acceso a sesiones. Se conserva el estilo de Medios y sumas aritméticas con recursos exclusivos de esta sesión.

## Etapa 2 — implementada

- Prácticas generativas de patrón, elementos, fórmula, término, primer término, raíces, razón, posición, dos términos, sumas, aplicaciones, medios y combinación.
- Variantes, orientación, otro ejercicio y resolución paso a paso que conserva operaciones previas. Recuperación del avance y borrador.
- Potencias: recorrido visual de posiciones 1 a 7 para distinguir n de n−1 y construcción de la fórmula mediante selección.
- Raíces: aislar potencia, índices impares con signo negativo, raíces pares con dos soluciones y casos sin raíz real.
- Razones enteras/fraccionarias, posiciones por potencias/logaritmos, no pertenencia y razón igual a 1.
- Dos términos consecutivos/separados: contar saltos, dividir, extraer raíz y recuperar a₁; razón positiva expresamente indicada.
- Sumatoria: cancelación visual, r = 1, r menor que 1 y recuperación del primer término desde la suma.
- Problemas de crecimiento/disminución que distinguen cantidad de acumulado y fijan el período inicial.
- Medios: k+1 saltos, razón, cada medio y comprobación del extremo final.
- Misión constelación: 24 retos, selección múltiple, datos/orden/opciones aleatorios, avance persistente, repaso y reinicio con confirmación local.

| Familia de la misión | Dos variantes |
| --- | --- |
| Elementos | Valor frente a posición; contar saltos |
| Término | Razón entera; razón fraccionaria |
| Primer término | Razón entera; razón fraccionaria |
| Raíces | Potencia con coeficiente; raíz impar negativa |
| Razón | Raíz impar; raíz par positiva |
| Posición | Reconocer potencias; usar logaritmos |
| Dos términos | Consecutivos; separados |
| Suma | r distinta de 1; r igual a 1 |
| Aplicación de término | Crecimiento; disminución |
| Aplicación de suma | Crecimiento; disminución |
| Medios | Un medio; varios medios |
| Combinación | Reconstruir y sumar; reconstruir y avanzar |

La práctica de cada página incluye más casos especiales que la misión, que conserva dos retos por familia. No se incluyen series infinitas.

## Ajustes y comprobación

- Actualizados menú, navegación final, metadatos, documentación y marcas de temas practicados.
- Pruebas automatizadas: equivalencia numérica; generadores contrastados con multiplicación término a término; 1.000 misiones con dos retos por familia y opciones únicas; recorrido y repaso con recargas; recuperación de estado corrupto.
- La revisión visual y funcional forma parte de esta entrega. Las ampliaciones futuras son opcionales; no quedan juegos vacíos ni actividades anunciadas como pendientes.

### Verificación de la segunda entrega

- Seis pruebas automatizadas aprobadas, incluidos almacenamiento bloqueado y JSON corrupto.
- Trece páginas comprobadas a 360 y 1440 píxeles; 34 variantes comprobadas en móvil, sin desbordamiento de página ni errores de KaTeX.
- Recorrido completo de 24 retos y repaso completo de 19 retos fallados deliberadamente. Recargas después de error/acierto y al terminar el repaso; cancelación y confirmación de nueva misión.
- Prácticas: blanco/error/acierto, fracción equivalente, borrador restaurado, raíces sin solución y con dos soluciones, varios medios y extremo final. Navegación por teclado y explorador de saltos con End; cancelación visual de los tres pares.
- Consola sin errores ni advertencias durante el recorrido.
- Catálogo: 224 módulos públicos. Validación: 257 HTML, 227 metadatos, cero avisos.

## Cierre final

Menú con mapa desplegable de seis fórmulas, resumen de temas practicados, estado de misión y enlace para retomar la última página. La variante Disminuir alterna razones entre 0 y 1. Se rechazan fracciones con operandos numéricos no finitos. Se conserva la compatibilidad de las partidas existentes.

Verificación final: siete pruebas automatizadas aprobadas; 26 vistas (13 páginas a 360 y 1440 píxeles) sin errores de KaTeX ni desbordamientos; mapa de seis fórmulas comprobado con teclado, móvil y escritorio. Probados el acierto con decimal con coma en Disminuir, la marca de tema practicado, el enlace de retomar y el acceso a la misión guardada. Consola sin errores ni advertencias. Catálogo y validación aprobados: 224 módulos, 257 HTML y 227 metadatos, cero avisos.

Actualización de variedad: prácticas con razones enteras 2–6 y fraccionarias 1/4, 1/2, 3/4, 3/2 y 5/2 según el tema. Otro ejercicio evita repetir la razón cuando la variante admite alternativas. Fórmula y término usan constructor de casillas, vista LaTeX en vivo y comprobación de los datos; Calcular muestra el término obtenido. Los borradores de estas prácticas se guardan por separado de la misión existente. Recursos: constructor.mjs y generatePractice/nextPractice de modelo.mjs.

Presentación fraccionaria: las cantidades no enteras se renderizan mediante LaTeX con fracciones reducidas; la entrada del alumno sigue aceptando decimales y fracciones. Recorre los saltos permite editar numerador y denominador de a₁ y r, conserva el deslizador y usa aritmética racional exacta (fracciones.mjs y explorador.mjs). Denominador cero y campos incompletos muestran un mensaje sin conservar una sucesión desactualizada.
