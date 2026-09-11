# Medios y sumas aritméticas

Encuentra los números que mantienen el mismo salto.

Explicación breve, ejemplo visible y práctica generativa paso a paso. Permite pistas, corrección y solución guiada sin ocultar operaciones anteriores.

Recursos de esta sesión: motor.mjs, ui.mjs, actividad.mjs y sesion.css, bajo recursos/. Verificar teclado, móvil, escritorio, valores vacíos, incorrectos, fracciones y nueva generación. Nivel: primero de preparatoria. Formato tomado de las sesiones de Raúl; no depende de ellas.

## Recorrido

- Inicio: un medio y extremos faltantes.
- `ejercicios/varios-medios/`: k medios, k + 2 términos y k + 1 saltos; construcción, estudio, descensos, decimales y cantidad de medios.
- `juegos/puentes-aritmeticos/`: seis retos de medios y un puente visual de progreso.
- `ejercicios/sumas/`: término frente a suma y emparejamiento visual de dos filas; caso directo.
- `ejercicios/datos-faltantes/`: último término, cantidad de términos y caso inverso sencillo. La fórmula alternativa se presenta como sustitución de la principal.
- `ejercicios/sumar-un-tramo/`: conteo inclusivo y los dos métodos de suma de un intervalo.
- `ejercicios/en-la-vida-diaria/`: depósitos individuales, acumulados y producción de un tramo.
- `juegos/elige-y-suma/`: siete retos de decisión y cálculo, con progreso visual. Termina con el regreso a las sesiones de Alejandrina.

Son exactamente dos juegos. El resto es práctica repetible y acompañada, con ejemplos visibles. La sesión evita cronómetro, listas de temas desplegables y numeraciones decorativas. Nivel indicado por el usuario: primero de preparatoria, aunque el borrador decía tercero. Los casos de cantidades desconocidas e inversos se eligen en la práctica, para mantener breve el recorrido inicial.

Los generadores usan enteros y medios exactos; aceptan decimales con coma o punto y fracciones a/b, con denominador distinto de cero. La corrección conserva los pasos, marca campos incorrectos, ofrece pistas y permite revelar una solución sin bloquear el recorrido. El cierre de cada juego distingue los retos resueltos sin correcciones de los revisados; reiniciar vuelve a generar datos. No se guarda ni transmite información.

KaTeX con SRI, respaldo local de fracciones verticales, subíndices y superíndices si no carga. Estilos y lógica aislados de Raúl y de las sesiones antiguas. Enlaces relativos con index.html; catálogo automático del alumno.

## Ajustes visuales y de práctica

La sesión usa fondo lila, controles morados, detalles de estrellas y transiciones suaves que respetan movimiento reducido. Las etiquetas agrupan todos los dígitos de los subíndices; el renderizador también normaliza los subíndices numéricos antes de KaTeX o su respaldo.

En varios medios, saltos y diferencia ocupan dos columnas en escritorio. Ambos conservan los extremos y la cantidad de medios. El paso final repite la sucesión con casillas entre los extremos visibles; en móvil la disposición se adapta a una columna. El ejemplo permite recorrer cada salto y, al terminar un ejercicio, se pueden comprobar las diferencias.

Las sumas de tramos ya no usan bolitas de posiciones. Una cuadrícula muestra posición, símbolo y valor; los tres datos iniciales están dados. Los extremos del tramo se escriben en casillas y los valores interiores aparecen cuando ambos son correctos. Si se cambia un extremo por un valor incorrecto, esos valores automáticos se retiran. El mismo comportamiento se aplica a problemas de producción y al juego de sumas.

## Verificación

`node asesores/erik/alejandrina/medios-y-sumas/recursos/motor.test.mjs` prueba 9.000 ejercicios y retos: medios, sumas calculadas término por término, conteo y sumas de tramos, entradas inválidas y fracciones. Ejecutar también `npm run catalogo` y `npm run validar`. El detalle de la revisión visual se conserva en `AVANCE.md`.
