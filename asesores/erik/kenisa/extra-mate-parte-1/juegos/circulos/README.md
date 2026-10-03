# Círculos: una vuelta de descubrimientos

Actividad 5 de KENISA → Erik → Extra mate parte 1. Página estática sin dependencias nuevas. Conserva la ruta pública, identidad y navegación de la familia.

## Tres estaciones

1. `#partes`: siete elementos seleccionables (circunferencia, radio, diámetro, secante, tangente, arco y cuerda), comparación visual y preguntas con tamaños y orientaciones variables. Rondas de cinco aciertos.
2. `#medidas`: P = 2πr = πd y A = πr², unidades y cuatro ejemplos por pasos: perímetro/área desde radio/diámetro. Ambos niveles calculan P o A a partir de r o d. Nivel 1: cuatro opciones únicas y una sola correcta. Nivel 2: respuesta completa con π (por ejemplo 8π), teclado de pantalla y teclado físico; P o p inserta π. Sin aproximaciones decimales ni ejercicios inversos. Radios enteros de 1 a 25, unidades cm/m/mm y unidades cuadradas para áreas. Cada bloque de cuatro incluye las cuatro combinaciones de dato y objetivo.
3. `#radianes`: círculo unitario arrastrable (0–360°, con fracciones simplificadas de π), regla de tres y práctica de conversiones en la misma estación. `#conversiones` permanece como ancla interna compatible. El selector permite ambas direcciones o solo una. Cada pregunta parte de un entero de 0° a 360° y obtiene la fracción de π exacta; por eso la conversión inversa siempre tiene respuesta entera. Se generan series nuevas indefinidamente.

## Calculadoras y teclado

- Grados → radianes: la alumna escribe numerador y denominador (grados/180), pulsa Simplificar fracción y entrega el resultado. La fracción se reduce con el MCD y se muestra multiplicada por π.
- Radianes → grados: escribe solo los grados, por ejemplo 90 para π/2, y comprueba con Enter o el botón. No hay calculadora ni entrada con π en este sentido.
- No se precargan las respuestas. Cambiar un campo invalida el cálculo anterior y deshabilita Entregar hasta recalcular. Los denominadores cero y formatos incompletos se explican sin consumir intentos. En grados → radianes, Enter calcula y el siguiente Enter entrega. Medidas y radianes → grados usan Enter para comprobar.
- El teclado inserta en la selección o posición del cursor, incluye /, retroceso y borrado completo. Botones accesibles de al menos 48 px; P y p insertan π sin interferir con atajos Ctrl/Meta/Alt. Se aceptan también cantidades pegadas como 7pi/6. Se analizan cantidades exactas nπ/d sin eval.

## Juego y progreso

Las prácticas son visibles desde la carga, sin pantalla ni botón de inicio. Los dos niveles de medidas tienen selector de radio/diámetro y perímetro/área; conversiones tiene selector de dirección. Nuevo ejercicio siempre está disponible durante la práctica. Al agotarse el bloque se genera otro; no hay un máximo de preguntas. Saltar no suma puntos. Se cuentan aciertos y primer intento por separado; las rondas se completan con cinco aciertos en partes y cuatro en medidas/conversiones. Acierto verde con ✓, error rojo con × temporal (1.1 s), pistas y reintentos ilimitados, sin puntuación duplicada. Siguiente reto se habilita al acertar.

Cuatro insignias: 14 aciertos en partes, 8 en cada nivel de medidas, visitar 90/180/270/360° y 12 conversiones. Los niveles y estaciones conservan borrador, cálculo y progreso en memoria mientras la página permanece abierta. Recargar reinicia la práctica; no hay almacenamiento persistente ni recogida de datos.

El círculo conserva Pointer Events, deslizador, flechas (1°), Shift + flechas (10°), Home/End (0/360°), Escape para detener la animación y movimiento reducido. 360° no se transforma en 0°.

## Archivos y navegación

- `modelo.mjs`: geometría, fracciones exactas, generación equilibrada, validación y progreso.
- `script.mjs`: diagramas SVG, ejemplos, círculo unitario y navegación de las tres estaciones.
- `juego-ui.mjs`: opciones, teclados, calculadoras, generación continua y feedback.
- `estilos.css`: estilos locales bajo .circle-site. Consume ../../recursos/geometria.css y recursos globales sin modificarlos.

Entrada desde el menú y desde Continuar en Cuadriláteros. Salidas al menú de Extra mate y a Cuadriláteros. Rutas relativas con index.html; HTML/CSS/JS/SVG sin compilación obligatoria.

## Verificación

Desde la raíz:

```powershell
node --test asesores/erik/kenisa/extra-mate-parte-1/juegos/circulos/modelo.test.mjs
npm run catalogo
npm run validar
```

Las pruebas del modelo cubren 300 series de cada recorrido, opciones únicas y solución correcta, unidades, 361 conversiones de referencia, giros y tangencia, analizadores exactos, denominador cero y 500 cambios de ejercicio sin duplicar puntos. Comprobar además en navegador los dos niveles, errores y reintentos, P/p, inserción y borrado en el cursor, calculadoras y resultado invalidado al editar, Enter, conservación de borradores, generación después del último reto, progreso de ronda, enlaces #conversiones y tres estaciones, móvil/escritorio (360/768/1024/1440), tacto, teclado, consola y ausencia de desbordamiento.

La calculadora presenta numerador y denominador verticales separados por una barra. Cada conversión dibuja el sector circular y el arco correspondiente en un círculo de radio 1; se da la medida en la unidad de origen y la otra aparece al acertar, con el arco iluminado. Arco y cuerda se incluyen tanto en la explicación como en el generador y sus siete opciones.
