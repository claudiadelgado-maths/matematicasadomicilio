# Multiplicación de polinomios

Última página de Matemáticas, parte 1 de Raúl. Ruta pública: `/asesores/erik/raul/matematicas-parte-1/ejercicios/multiplicacion/index.html`. Resta enlaza aquí; al terminar hay regreso a Resta y a las sesiones de Raúl, sin otro Siguiente. La petición directa del usuario sustituye el cierre pendiente del archivo adjunto.

## Contenido

Una página vertical, explicaciones antes de cada actividad, fondo pastel y sin numeraciones decorativas. Paréntesis y distributiva; monomios; monomio por polinomio; binomios; polinomios generales. Incluye un ejemplo completo de trinomio por trinomio calculado por el mismo motor.

## Actividades

- Árbol: constante externa, dos a cuatro términos interiores, numéricos o algebraicos. Dos distribuciones y dos resultados por rama (cuatro finales posibles). La segunda bifurcación sigue la distribución elegida; Entregar revisa ambas decisiones, no solo el último nodo. Caminos resaltados, reintento y reinicio independiente.
- Monomios: coeficientes no nulos de −100 a 100, una a tres letras variadas y exponentes 1–20 por factor. Campos con vista previa LaTeX, comprobación individual y resultado completo. Se excluye cero al generar para que la práctica de exponentes tenga sentido; el motor admite cero y cancelaciones.
- Seis tarjetas: exactamente una distribución y un resultado correctos. Dos botones por tarjeta asignan Distribuir/Multiplicar, y cada tarjeta ocupa como máximo un lugar. Resumen ordenado de elecciones, entrega, reintento y procedimiento al acertar.
- Revisión de binomios: filas con mezcla de aciertos y errores de signo. Cada fila se compara de forma independiente con el problema original; se aclara en pantalla. ✓/✕, validación de todas las marcas y procedimiento correcto siempre tras entregar una revisión completa.
- Secuencia final: las nueve combinaciones de uno a tres términos por factor. Dos opciones por pregunta; las elecciones previas permanecen visibles y editables. Pasos adaptados: un monomio por monomio no repite distribuciones inútiles. Entregar al responder todo; reintentos y solución completa al acertar.

## Archivos y reglas

`motor.mjs` conserva términos `{c,base}`; multiplica coeficientes, suma exponentes y agrupa por identidad literal completa. Las expansiones conservan cada producto; las formas finales omiten unos y ceros y evitan +−. `script.mjs` controla estado solo en memoria y DOM sin evaluar entradas como código. `estilos.css` importa el diseño de sesión y añade estilos locales. Se reutilizan `../../recursos/algebra.mjs`, `actividad.mjs` y `feedback.mjs` sin modificarlos. KaTeX 0.18.1 con SRI; notación legible si falla el CDN. No se añaden dependencias ni recursos globales.

Todos los controles son botones/campos nativos para ratón, tacto y teclado, con foco visible y estados expresados por texto además de color. Los reinicios borran selecciones, feedback y soluciones de su propia actividad. No se guarda información ni se envían respuestas.

## Verificación

`node --test asesores/erik/raul/matematicas-parte-1/ejercicios/multiplicacion/motor.test.mjs` comprueba miles de generaciones, productos por evaluación independiente, letras exclusivas, exponentes, cancelaciones, nueve combinaciones y opciones únicas. Ejecutar `npm run catalogo` y `npm run validar`. Revisar móvil y escritorio, teclado, consola, enlaces, caminos incorrectos y correctos, campos, asignación exclusiva, revisión de filas, secuencia y reinicios.
