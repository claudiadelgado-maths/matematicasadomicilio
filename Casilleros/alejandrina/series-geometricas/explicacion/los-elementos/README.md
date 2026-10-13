# Cada símbolo tiene un trabajo

Distingue una posición de la cantidad que ocupa ese lugar.

Página de la sesión Series geométricas para Alejandrina con Erik. Conserva teoría breve, LaTeX y ejemplos desplegables. `../../recursos/practica.mjs` sustituye la práctica inicial por variantes generativas guiadas: un paso cada vez, operaciones correctas visibles, orientación y otro ejercicio. Continúa y Menú permanecen disponibles. Los campos no muestran respuestas como ejemplos.

La variante, semilla, pasos resueltos y borrador se guardan localmente. No se bloquea la sesión si el navegador impide guardar. La fórmula y los elementos incluyen recorrido de saltos; sumas incluye cancelación de pares. La última página continúa a la misión.

Recursos exclusivos: modelo.mjs, practica.mjs, ui.mjs y sesion.css del directorio recursos de esta sesión. No importar recursos de otros alumnos. Mantener componente.json y este README sincronizados. Probar variantes, blanco/error/acierto, reanudación, teclado, móvil y enlaces. El plan y alcance están en ../../ETAPAS.md.

Presentación fraccionaria: las cantidades no enteras se renderizan mediante LaTeX con fracciones reducidas; la entrada del alumno sigue aceptando decimales y fracciones. Recorre los saltos permite editar numerador y denominador de a₁ y r, conserva el deslizador y usa aritmética racional exacta (fracciones.mjs y explorador.mjs). Denominador cero y campos incompletos muestran un mensaje sin conservar una sucesión desactualizada.

El explorador inicia con campos simples a₁ y r. Usar fracciones cambia a numerador/denominador, con el símbolo y el signo igual a la izquierda; volver a campos simples conserva los valores y la posición. Las sucesiones se separan con comas y el enunciado del constructor se renderiza con KaTeX al crearlo.
