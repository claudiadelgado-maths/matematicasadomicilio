# Laboratorio de triángulos

Actividad 3 de Extra mate parte 1, Kenia → Erik. Ruta `/asesores/erik/kenia/extra-mate-parte-1/juegos/triangulos/`. Recibe el botón Continuar de Paralelas y transversal y aparece en el menú de sesión. Al final y en el resumen de la última etapa ofrece Continuar hacia `../cuadrilateros/index.html`, la actividad 4. Los enlaces usan directorios con `index.html`; `#tipos`, `#internos` y `#exteriores` abren las etapas directamente.

## Objetivo y contenido

Clasificar triángulos y resolver medidas mediante la suma interior y las relaciones del ángulo exterior. Cada etapa comienza con una exploración y ofrece 12 retos: tres rondas cortas de cuatro. No depende de velocidad ni sonido.

1. **Tipos:** seis botones muestran ejemplos, marcas de lados iguales, medidas y doble clasificación. Otro ejemplo y Giro cambian forma u orientación. El juego de sí/no ofrece dos casos por cada tipo, uno verdadero y otro falso, mezclados. Usa grupos disjuntos: isósceles significa exactamente dos lados iguales; un desplegable explica la convención alternativa inclusiva.
2. **Interiores:** un deslizador cambia la forma. Los sectores de las tres esquinas se separan, trasladan y giran sin alterar sus aberturas hasta completar 180°. La animación es reversible e interrumpible, con resultado inmediato si se prefiere movimiento reducido. La práctica progresa de dos ángulos numéricos y uno faltante a múltiplos de x y luego expresiones ax+b.
3. **Exteriores:** prolongación de AB por B, interior adyacente B y exterior E. Dos controles resaltan B+E=180° o E=A+C. Un deslizador comprueba ambas relaciones cambiando la forma. Los retos piden E, B o C y después x, con expresiones lineales en ambas relaciones.

## Matemáticas y generación

`modelo.mjs` es puro y genera series nuevas. Los ángulos interiores son positivos, suman 180° y el exterior cumple simultáneamente las dos relaciones. Se construyen expresiones desde soluciones enteras positivas; cada ecuación tiene coeficiente neto distinto de cero. Los dibujos usan la ley de senos, no triángulos genéricos con medidas incompatibles. La clasificación depende de medidas, no orientación. Los lados opuestos a ángulos iguales comparten marcas. Los retos algebraicos piden explícitamente x y la solución distingue ese valor de la medida del ángulo.

Los datos del reto y sus expresiones completas se mantienen en tarjetas A/B/C/E junto al dibujo. Las letras vinculan cada tarjeta con su región. Las pistas muestran la relación y, en retos numéricos/algebraicos, la ecuación; el feedback correcto explica la sustitución y las medidas.

## Interacción y avance

Comenzar inicia la etapa elegida. Un error colorea la respuesta en rojo, presenta una × durante 1,1 segundos y una pista textual persistente; puede corregirse sin límite. Un acierto colorea en verde, presenta ✓ y habilita Siguiente. Cada reto puntúa una sola vez; el total resuelto y el primer intento son contadores separados. Vacíos y texto inválido no cuentan como intento. Se admiten punto o coma decimal. Enter confirma; botones funcionan con Enter/Espacio.

Tras cuatro retos aparece un resumen y Siguiente ronda; tras doce se puede continuar a la siguiente etapa o generar otra serie. La última etapa ofrece continuar a Cuadriláteros; la navegación inferior conserva el regreso a la sesión. Cambiar de etapa conserva progreso, borradores y feedback en memoria. Nueva serie reinicia solo esa etapa. Recargar reinicia; no hay almacenamiento ni peticiones externas. No se exige completar otras etapas para repasar un tema concreto.

SVG con nombres accesibles, mensajes `aria-live`, navegación y foco visibles, controles de al menos 44 px y disposición móvil. Al avanzar se lleva el foco al título del reto/resumen. El movimiento reducido evita la animación sin ocultar el resultado. Identidad, navegación, pie y controles flotantes son los globales. Solo reutiliza `../../recursos/geometria.css`; no lo modifica ni agrega dependencias.

## Archivos y verificación

`index.html`, `estilos.css`, `script.mjs`, `modelo.mjs`, `modelo.test.mjs`, `juego.json` y este README.

```powershell
node --test asesores/erik/kenia/extra-mate-parte-1/juegos/triangulos/modelo.test.mjs
npm run catalogo
npm run validar
```

Las pruebas cubren clasificación, equilibrio sí/no, 12000 retos numéricos/algebraicos, validez y unicidad de ecuaciones, coincidencia de dibujo y medidas, límites de 90°, progreso, reintentos y bloqueo de puntuación duplicada. Revisar navegador a 360, 768, 1024 y 1440 px; seis tipos y rotaciones; las dos demostraciones con deslizadores; las tres series completas; errores y aciertos con teclado/tacto; conservar un borrador al cambiar de etapa; reiniciar solo una etapa; consola, enlaces y menú móvil con Escape.
