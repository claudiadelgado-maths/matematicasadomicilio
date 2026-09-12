# Ampliación de Repaso Parte 2 — terminada

Se implementó primero la práctica de aritmética y se revisaron respuestas, soluciones, formulario, teclado y móvil antes de construir el laboratorio algebraico.

## Secuencia disponible

- `index.html`: laboratorio científico original, conservado; ahora tiene Continuar.
- `expresiones-algebraicas/index.html`: Creador y Resolver, monomios multivariables, potencias pendientes, operaciones exactas, dominio explícito, pasos educativos, historial y deshacer.
- `aritmetica/index.html`: tres niveles, Mezcla todo y nueve categorías, selección de tablas 2–10, cuatro respuestas, avance automático opcional, soluciones y formulario permanente.

README y sesion.json sincronizados. No quedan páginas pendientes de esta ampliación. No se realizó despliegue ni commit.

## Verificación

15 pruebas automatizadas: incluyen 3000 preguntas aritméticas, tablas específicas, reglas del formulario, 300 ejercicios algebraicos y regresiones del laboratorio científico. Navegador: respuesta correcta e incorrecta, solución, formulario, avance automático, teclas de respuesta, editor, potencias, deshacer, Resolver avanzado completo, rechazo de denominador cero, Escape, menú móvil y enlaces de Continuar. Consola sin errores; sin desbordamiento horizontal a 360, 768, 1024 y 1440 px en las revisiones.

Comprobaciones de cierre: npm run catalogo y npm run validar.
