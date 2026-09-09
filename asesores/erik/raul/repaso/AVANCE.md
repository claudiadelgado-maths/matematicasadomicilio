# Estado de Repaso

**Sesión completa: 25 páginas. Cierre añadido el 9 de septiembre de 2026. Termina en Factorización, con regreso a Raúl.**

Fracciones completado el 8 de septiembre de 2026. Nueve páginas publicadas en los metadatos locales, desde representación hasta reto combinado. No se ha realizado despliegue ni push.

## Implementación

- Barras seleccionables, parejas equivalentes, simplificación por factores comunes, traslado y retirada de piezas, denominador común, tarjetas de producto, recíproco y reto con tres modalidades.
- Multiplicación y división: estructura, cálculo sin simplificar y resultado irreducible.
- Motor racional exacto en recursos/motor.mjs. Interacciones en recursos/laboratorio.mjs; diseño verde en recursos/repaso.css. Cada página mantiene README y metadatos.
- Fracciones verticales con KaTeX y alternativa HTML vertical. Navegación global existente, sin menú interno ni enumeraciones decorativas. Sin persistencia de respuestas.
- La última continuación está desactivada hasta recibir las siguientes especificaciones. Se puede regresar a sesiones de Raúl.

## Verificaciones

- 63 360 operaciones verificadas: suma, resta, producto y cociente; equivalencia numérica y forma irreducible, incluido cero y fracciones impropias.
- Recorrido de las nueve interacciones en navegador; casos correctos, simplificación por varios factores, entrada con teclado y recíproco.
- Las nueve páginas revisadas a 360, 768 y 1440 px: sin desbordamiento ni errores de KaTeX. Inspección visual móvil y escritorio; menú móvil y Escape comprobados. Consola sin errores.
- Enlaces y recursos locales comprobados. Catálogo y validación ejecutados.

## Próximo contenido

La continuación de Fracciones ya está conectada a Sustitución. El reto de Sustitución enlaza con Despejes sencillos, y después con Proporcionalidad directa.


## Sustitución y evaluación de expresiones — completado

Doce apartados añadidos después de Fracciones. Repaso tiene ahora 21 páginas. Los cambios son locales; no se ha realizado push ni despliegue.

- Recorrido: sustitucion, construir-sustitucion, negativos, variable-repetida, varias-variables, sustitucion-fracciones, decimales, exponentes, formulas, orden, errores y reto-sustitucion.
- Colocación por arrastre real o tarjeta y destino, selección de todas las apariciones, construcción, evaluación por operaciones, camino decimal, ordenación y detección de errores. El reto alterna respuesta escrita, colocación y ordenación.
- Árbol de expresiones y operaciones exactas en recursos/sustitucion/motor.mjs. Los decimales se convierten a racionales y se presentan sin ruido de punto flotante. No se usa eval ni Function para calcular expresiones.
- Las fracciones finales deben ser irreducibles; pasos intermedios aceptan formas equivalentes. Denominador común admite múltiplos positivos razonables. No se generan divisores cero.
- UI y estilos aislados en recursos/sustitucion, sin modificar recursos globales ni el motor previo de Fracciones. El reto de Fracciones tiene Continuar activo; el reto de Sustitución continúa en Despejes sencillos.
- Documentación y metadatos de los doce módulos sincronizados; catálogo de Raúl actualizado mediante el generador.

### Verificación de la continuación

- `node asesores/erik/raul/repaso/pruebas/sustitucion.test.mjs`: 6,000 ejercicios, cada transformación equivalente al resultado exacto, potencias negativas, familias numéricas, entradas y divisor cero.
- Las doce actividades se recorrieron en navegador. Se probaron arrastre real, teclado, tarjetas con números repetidos, datos en destinos incorrectos, entradas vacías, respuestas incorrectas, negativos, denominador cero, simplificación pendiente y reinicio.
- Cuatro variantes de fórmulas, cuatro familias de errores y tres modalidades del reto comprobadas.
- Las doce páginas a 360, 768, 1024 y 1440 px: sin desbordamiento ni errores de KaTeX. Inspección visual de actividad y resultados en móvil y escritorio. Foco al siguiente campo y navegación global comprobados.
- Enlaces locales y consola revisados. Ejecutar nuevamente catálogo y validación al modificar contenido.


## Cierre — completado el 9 de septiembre de 2026

- Proporcionalidad directa e inversa añadidas como ejercicios; factorización como demostración, sin actividad de evaluación.
- Contextos explícitos: precio unitario constante, velocidad constante, trabajo fijo y recursos equivalentes sin interferencias. La explicación distingue proporcionalidad de una simple tendencia creciente o decreciente.
- Actividades: mismo multiplicador/divisor, paso por la unidad, problemas escritos, deslizador de tiempo y clasificación por botones o arrastre. Generación variable con enteros y decimales sencillos.
- Árbol de primos: ramas pulsables, expansión completa, reinicio, diez números y dos caminos. Resultados equivalentes y conexión con MCD; cierre de Repaso y enlaces de regreso.
- Pruebas matemáticas: 4,000 modelos proporcionales y 398 árboles de factores, incluidos ambos caminos y validación de entradas.
- Navegador: multiplicación, reducción, unidad, respuestas vacías, problemas correctos, tiempo insuficiente o excesivo, clasificación por arrastre y botones, árbol con teclado, caminos y factores comunes.
- Las tres páginas se revisaron a 360, 768, 1024 y 1440 px; árboles expandidos sin desbordamiento de página. El árbol permite desplazamiento horizontal local cuando se necesita.
- Metadatos y catálogo sincronizados. No se ha hecho push ni despliegue; cambios en el proyecto local.


## Despejes sencillos — insertado antes de Proporcionalidad

Una sola vista nueva en ejercicios/despejes-sencillos. El contenido previo permanece igual; solamente se ajustaron los enlaces anterior/siguiente y el enlace de repaso del cierre.

- Cuatro operaciones inversas numéricas, con representación explícita de la misma operación en ambos lados y cálculo del resultado.
- Demostración de intercambio de lados: no toma recíprocos ni cambia signos.
- Laboratorio de factores: cuatro estructuras, objetivos en numerador o denominador, cuatro conjuntos de emojis y representación equivalente con letras. Movimiento animado, selección por teclado, deshacer y reiniciar.
- Modelo simbólico con factores únicos de exponente positivo o negativo por lado. Cada movimiento multiplica o divide ambos lados por un factor no nulo. Todos los símbolos se suponen no nulos; condición visible.
- Prueba pura: 160 estados y 704 despejes, con invariancia, reversibilidad, intercambio de lados y aislamiento correcto de todos los objetivos.
- Navegador: cuatro operaciones numéricas, objetivo en denominador, cuatro estructuras, intercambio de cocientes, deshacer, cambiar representación y símbolos. Sin errores de consola o KaTeX. Pantallas de 360, 768, 1024 y 1440 px sin desbordamiento.
- Mantiene el cierre de Factorización y la navegación de regreso a Raúl. No se ha hecho push ni despliegue.
