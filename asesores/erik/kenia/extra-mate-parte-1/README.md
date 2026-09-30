# Extra mate parte 1

Sesión independiente de Kenia → Erik para repasar geometría antes de un examen. El primer tema es **Ángulos** y tiene tres pasos: definición, laboratorio de tipos y práctica ilimitada. No se anuncian temas futuros vacíos.

## Contenido y rutas

- `index.html` y `estilos.css`: menú de la sesión, botón Continuar y acceso directo a cada paso de Ángulos.
- `explicacion/`: qué es un ángulo; dos semirrectas y vértice común, medida en tiempo real y lado móvil arrastrable.
- `explicacion/tipos-de-angulos/`: laboratorio circular parecido a un plano cartesiano. Lado inicial en x positivo, punto sobre la circunferencia, sector, arco antihorario, siete tarjetas y animación de vuelta completa.
- `ejercicios/clasifica-angulos/`: ejercicio ilimitado para identificar el tipo de ángulo, con reintentos, botón Nuevo ejercicio, resueltos y aciertos al primer intento. Reiniciar práctica limpia toda la ronda y sus contadores.
- Cada módulo tiene su README, JSON, entrada, estilos y controlador propios. `sesion.json` declara únicamente explicación y ejercicios.

## Recursos compartidos de esta familia

- `recursos/geometria.css`: identidad y componentes de las cuatro páginas. Revisar las cuatro si se modifica.
- `recursos/modelo.mjs`: clasificación exacta, puntos, arcos/sectores, seguimiento del giro y generador equilibrado. No confundir 0° con 360° usando módulo 360 sobre la medida.
- `recursos/angulos.mjs`: dibujo SVG, arrastre mediante Pointer Events, teclado, deslizador, tarjetas de tipos y animación. Lo consumen definición, laboratorio y práctica; revisar los tres.
- `recursos/geometria-visual.svg`: ilustración exclusiva del inicio.
- `recursos/modelo.test.mjs`: pruebas de los límites, giro completo y equilibrio de la práctica.

El dibujo usa un vértice (240,240), circunferencia de radio 156 y viewBox 0 0 480 480. Los puntos se convierten desde pantalla al SVG, por lo que el arrastre conserva su precisión al cambiar el tamaño de la vista.

El punto visible se dibuja en SVG y su control accesible es una superficie HTML superpuesta, de al menos 44 px. Así touch-action funciona en móviles sin bloquear el desplazamiento fuera del punto. No sustituirla por un control interno SVG sin probar el gesto táctil completo. Al tocar una tarjeta con el círculo fuera de la pantalla, este se encuadra automáticamente; con teclado se conserva el foco y se anuncia el cambio.

## Pedagogía y controles

Los tipos son nulo (0°), agudo (0° < α < 90°), recto (90°), obtuso (90° < α < 180°), llano (180°), cóncavo/reflejo (180° < α < 360°) y completo/perigonal (360°).

La medida aumenta en sentido antihorario desde x positivo. El giro está limitado a [0,360] y no se convierte automáticamente en 0 al terminar la vuelta. Para 0 no hay sector; para 360 se dibuja todo el disco y la circunferencia mediante dos arcos. Los lados pueden coincidir en ambos casos; la medida, el sector y el texto conservan su diferencia.

El punto acepta ratón, tacto y lápiz. El deslizador y las flechas permiten valores precisos; en el punto, Shift mueve 10°, Home fija 0 y End fija 360. Hay botones de 0° y vuelta completa. La animación se interrumpe al manipular el punto o el deslizador; Escape la detiene. Se respeta prefers-reduced-motion. El desplazamiento táctil sigue disponible fuera del punto.

Cada bloque de siete ejercicios ofrece una vez cada tipo: cuatro casos especiales y tres ángulos intermedios nuevos. Se evita repetir el mismo tipo entre bloques. Una respuesta incorrecta muestra una pista de medida y permite reintentar, sin elegir automáticamente el nombre correcto. Nuevo ejercicio siempre está disponible y saltar no aumenta los contadores. El primer intento solo cuenta cuando se resuelve sin errores. No se guarda información en localStorage ni se hacen peticiones externas.

## Contrato de la sesión

Conservar carpeta, index.html, estilos.css, README.md y sesion.json. Mantener id = extra-mate-parte-1-kenia-erik, slug = extra-mate-parte-1, tipo = sesion, usuario = kenia-erik, estado = publicado, fecha = 2026-09-29 y ruta = /asesores/erik/kenia/extra-mate-parte-1/.

Conservar navegación, marca, pie, enlace de salto, main con id contenido y controles flotantes del script global. Las rutas se mantienen relativas a cada profundidad. La carpeta depende de los recursos globales de la plataforma y se sirve por HTTP. No requiere framework, compilación ni dependencias de producción.

El menú puede ampliarse con temas reales. El botón Siguiente tema de la práctica permanece nativamente deshabilitado hasta que exista el tema 2. Al incorporarlo, sustituir ese botón por su enlace relativo y actualizar README/metadatos; no crear una ruta vacía.

## Verificación

Desde la raíz:

```powershell
node --test asesores/erik/kenia/extra-mate-parte-1/recursos/modelo.test.mjs
npm run catalogo
npm run validar
```

Revisar Erik → Kenia → Extra mate parte 1 → Continuar → definición → laboratorio → práctica → inicio. Probar 0,45,90,135,180,300 y 360 grados, giro manual completo, recorrido inverso, toques, teclado, deslizador y animación con/sin movimiento reducido. Verificar práctica vacía, incorrecta, correcta, reintento, salto, reinicio y equilibrio tras múltiples rondas. Revisar todas las páginas a 360,768,1024 y1440 px, consola, enlaces, menú con Escape y ausencia de desbordamiento horizontal.
