# ✨ Sumas Molonas

Sesión de Elyan (8 años, 3.º de Primaria) con Claudia. Segunda iteración del laboratorio, en español de España. Se mantiene la ruta, el casillero, la recta y el modelo matemático original.

## Menú y actividades

La entrada abre un menú con seis juegos. «Menú de juegos» está disponible en cada actividad. Cada panel conserva sus respuestas y su progreso al volver al menú; una animación de Saltitos en curso se cancela y vuelve al origen. Las estrellas son logros de esta visita, sin datos personales. Una tarea ya resuelta no vuelve a premiarse por pulsaciones repetidas; se puede repetir con un ejercicio nuevo o reiniciándolo explícitamente.

1. **Saltitos.** Recta continua 0–18, cuatro animales y modos Explorar/Reto. Explorar permite origen 0–9 y 1–9 saltos. Reto fija ambos valores: el alumno toca cualquier destino 0–18 y una silueta marca su propuesta. Se indica la distancia y, si es anterior al origen, la dirección hacia atrás. Los errores no revelan el destino correcto. Solo acertar desencadena la animación. Un salto = una posición, con arco, squash/stretch y estrellas; llegada y suma final.
2. **Forma el número.** Un billete de centenas, otro de decenas y otro de unidades. Se guardan mediante clic, toque o teclado en los bolsillos y se escribe el número formado. Un bolsillo devuelve o coloca su billete. Primer ejercicio: 300 + 40 + 7. Los siguientes varían, con cifras 1–9 para conservar un billete por color.
3. **Elige los billetes.** Se muestra un número de tres cifras y cada bolsillo abre un selector de billetes. «Entregar» valida la composición, sin dar la solución al fallar. Un billete de cada orden, sin combinaciones múltiples. Primer ejercicio: 347.
4. **Cambio de billetes.** Dos billetes del mismo orden. El alumno elige el resto y el billete de orden superior; «Sin billete» expresa cero, incluyendo las decenas exactas y sumas sin reagrupación. Un acierto muestra equivalencia, diez puntos agrupados cuando hay cambio de orden, y celebración. Primer ejercicio: 7 + 6 unidades. Admite unidades, decenas, centenas y millares. Al practicar millares también se pueden cambiar 10 millares por un billete de 10000: aparece un bolsillo DM (decena de millar), con el mismo dorado y borde doble, etiquetado explícitamente. Este orden extra solo aparece en ese nivel; evita limitar artificialmente 7000 + 6000. Los billetes son material didáctico, no moneda real.
5. **Sumas verticales.** Conserva niveles sin llevadas, una llevada, varias y millares (tres cifras). Validación automática independiente de resultado y llevada: verde suave al acertar y rosa suave al fallar, con estado textual. No avanza hasta que ambas casillas son correctas. Foco automático, selección del error para corregir, y recorrido desde unidades. **Sin botones de verificar, sin recta, sin ayudas Saltitos y sin billetes.** Nueva suma cambia; Reiniciar conserva la operación.
6. **Paso a paso.** Dos enteros del 10 al 999, incluso de distinta longitud. «Preparar suma» crea el tablero; «Siguiente paso» resuelve una sola columna y su llevada; «Resolver todo» completa las restantes. Todos los pasos permanecen visibles. Cambiar un operando borra la resolución anterior. Admite hasta 1998, con cuarta posición en el resultado. Validación de entradas vacías, letras, decimales y negativos.

## Identidad y accesibilidad

Código común: unidades azul pastel, decenas rosa pastel, centenas verde pastel y millares amarillo pastel. También se usan letras, nombres y valores: no se depende del color. Llevadas pequeñas, de borde discontinuo; resultados grandes. Menú de tarjetas, estrellas breves, bolsillos y billetes con movimiento. La matemática queda en superficies claras.

Controles HTML nativos, nombres accesibles, feedback `role=status`, foco visible, teclado numérico y diálogo de billetes con Escape y retorno del foco. En móvil la recta se desplaza dentro de su contenedor, con seguimiento del animal. No envuelve ni rompe la continuidad numérica. `prefers-reduced-motion` elimina rebotes y desplazamientos suaves, conserva pasos discretos y una celebración estática. Los botones globales, navegación, logotipo y pie siguen siendo los del sitio.

## Voz de Saltitos y de los billetes

Secuencia serial: «Empezamos en 3» → «Un salto», …, «Nueve saltos» → «Llegamos a 12» → «Por lo tanto, 3 más 9 es igual a 12». Cada frase de salto se solicita tras su aterrizaje; nunca se encolan dos narraciones. La secuencia se bloquea durante voz y movimiento. Reiniciar, salir, ocultar pestaña o abandonar página cancelan ambos. Silenciar cancela la frase actual y continúa visualmente.

Los cuatro juegos comparten **un solo motor de voz**, el interruptor y la selección de voz. Al silenciar en uno, los otros también quedan silenciados durante la visita. «Escuchar reto» repite la consigna actual (o la equivalencia ya resuelta) en los tres juegos de billetes.

En billetes la voz presenta el reto al entrar y al generar otro, nombra los valores y órdenes elegidos, anuncia colocaciones y devoluciones, orienta al abrir un bolsillo y anima tras un error sin revelar la solución. Solo después de acertar lee la composición o equivalencia completa. Nunca lee el resultado de Forma ni de Cambio antes de que el alumno lo resuelva. Una nueva interacción cancela la frase anterior: no acumula una cola, no bloquea los controles y no se superpone con Saltitos. Volver al menú, cerrar un selector, ocultar la pestaña o salir detiene la voz. Sin API de voz los juegos siguen funcionando y se desactivan los controles de sonido.

`voz.mjs` prioriza voces masculinas reconocibles por nombre en es-ES, después masculinas de otro español, otras es-ES, otras españolas y finalmente la predeterminada. Prefiere motores locales/desktop frente a variantes Natural/Neural y usa tono grave (`pitch: 0.7`, `rate: 1.2`). Escucha `voiceschanged` y ofrece selección manual en «Voz del robot».

**La API no informa género ni grado de naturalidad:** se usan pistas del nombre, no una garantía. Si no existe voz masculina, funciona el fallback. No se promete un timbre idéntico en todos los dispositivos. Véase [SpeechSynthesisVoice](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisVoice). Fallos o ausencia de eventos tienen espera acotada y continúan con feedback visual; se puede reintentar. Sin Web Speech, se puede jugar sin sonido.

## Arquitectura y estado

Una sola página estática, sin nuevas dependencias ni subrutas. Los componentes de `sesion.json` están en false porque las actividades son paneles de la sesión, no módulos externos con subcarpetas.

- `script.mjs`: menú y logros de visita.
- `saltitos.mjs`: evolución de la recta y sus animaciones originales.
- `sumas.mjs`: evolución de la práctica original por columnas.
- `billetes.mjs`: los tres juegos y su selector común.
- `calculadora.mjs`: demostración con el mismo modelo y tablero.
- `matematicas.mjs`: descomposición por columnas, generación, validación y equivalencias puras.
- `visuales.mjs`: tablero compartido, nombres posicionales y celebraciones.
- `voz.mjs`: motor único compartido, selección y reproducción con sustitución/cancelación de frases.

Solo importa base.css, navegacion.js y SVG de marca globales. La tarjeta del casillero procede del catálogo. Sin localStorage, cookies, registro de respuestas ni servicios añadidos; todo el estado se borra al recargar. El navegador puede usar su propio servicio de voz remoto si se selecciona una voz de ese tipo.

## Verificación

Desde la raíz:

```powershell
node --test asesores/claudia/elyan/sumas-molonas/matematicas.test.mjs
npm run catalogo
npm run validar
```

Pruebas puras: todas las 818100 parejas de dos y tres cifras, recomposición de resultados y llevadas; niveles; composición de números; cambios entre órdenes y resto cero; selección de voces masculinas, locales y fallbacks.

Revisión en Edge/Chromium, 360/768/1024/1440: menú y seis paneles sin overflow; 3 + 9 con nueve aterrizajes y secuencia de voz instrumentada; origen bloqueado, distancias hacia delante/atrás/cero, destino incorrecto; 9 + 9 = 18; cancelación y doble clic; billetes 347 y cambio 13 = 10 + 3, todos los órdenes y 10 centenas = 1 millar; errores/correcciones por casilla, 28 + 17 y 768 + 594; igualdad de «paso» y «todo» para 68 + 57, 768 + 594, 99 + 999, 10 + 20 y 999 + 999; inválidos; conservación al volver al menú; voz nativa y ausencia de API; táctil, teclado, foco/Escape, movimiento reducido y consola. Revisar catálogo de Elyan y las tres sesiones existentes de Luca.

Verificación de voz en billetes: presentación de los tres juegos, selección y devolución, silencio compartido, repetición con teclado, aciertos y errores sin revelar respuestas, nuevos retos, cierre del selector, retorno al menú y pulsaciones rápidas; regresión de la secuencia de Saltitos y ausencia de voz en sumas/calculadora.
