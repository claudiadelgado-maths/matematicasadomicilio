# Triángulos semejantes

Actividad 01 de Extra mate parte 4, KENISA / Erik. Entrada pública: index.html. Juego integrado con explicación y práctica, sin pantalla de desbloqueo.

## Recorrido

1. **Explora**: ABC (lados 12, 16, 20) y AXY (6, 8, 10), en configuración de Tales con XY paralelo a BC. Separar/juntar usa una transformación SVG; conserva el vértice A compartido al reunir las figuras. Sus ángulos distintos son aproximadamente 53,13°, 90° y 36,87°. La animación se adapta a móvil y respeta movimiento reducido.
2. **Criterios**: AA, LAL y LLL muestran solo datos dados; un botón añade conclusiones con líneas discontinuas. AA no inventa longitudes ni una razón numérica: usa a, b, c y k. LAL muestra la proporción del tercer lado simbólicamente y ángulos correspondientes con letras. LLL deduce igualdad angular sin calcular grados.
3. **Decide**: AA, LAL, LLL o no semejantes. El criterio se elige según los datos marcados. Los negativos se construyen con conjuntos angulares distintos o ternas de lados no proporcionales, incluso después de reordenarlas. No se confunde información insuficiente con no semejanza.
4. **Encuentra**: un lado entero, un lado fraccionario, tres lados con razón explícita, un ángulo o tres ángulos. Nunca combina incógnitas de lado y ángulo en un mismo ejercicio. Valida fracciones equivalentes exactamente; completa los datos señalados del dibujo al acertar.
5. **Resuelve x**: x más una constante, múltiplos de x, ax+b, expresiones en dos lados correspondientes o en un ángulo. Una ecuación lineal con única solución entera positiva. Sin sistemas, cuadráticas, Pitágoras ni ejercicios de trigonometría.

Cada práctica permite elegir casos, mezcla y orientación (alineada, girada, reflejada o variada), generar nuevos retos, consultar pista, reintentar y revisar pasos tras acertar. Progreso independiente: resueltos y aciertos al primer intento. Las entradas inválidas no consumen intento; los aciertos solo se cuentan una vez. Los campos correctos se marcan verdes y los incorrectos rosas, con × temporal. Enter comprueba y el foco pasa a Siguiente reto.

## Geometría y generación

- modelo.mjs: fracciones racionales reducidas, generadores, corrección y estado sin DOM. Los cálculos geométricos internos solo colocan dibujos; nunca se pide resolver con razones trigonométricas.
- figuras.mjs: animación local de Tales y reexportación del dibujante común de recursos/figuras-triangulos.mjs. SVG con posiciones geométricas exactas, etiquetas, arcos, rotación/reflexión y líneas guía. Cada figura de práctica se amplía por separado para ser legible; el texto lo avisa. Intro y criterios conservan la escala relativa.
- script.mjs: exploración local y conexión con recursos/practicas-triangulos.mjs para vistas por hash, interacción y progreso en memoria. #criterios abre la exploración y lleva directamente al catálogo de criterios.
- estilos.css: importa recursos/laboratorio-triangulos.css, compartido con congruencia; sin rojo, foco visible, controles táctiles y responsive.
- modelo.test.mjs: 6 000 ejercicios combinando los 15 casos y cuatro orientaciones; comprueba geometría, datos, soluciones, negativos, ecuaciones, fracciones, criterios y contadores.

Al terminar, el botón Continuar abre Congruencia de triángulos. La aritmética, la geometría y el motor de corrección se comparten desde recursos/matematicas-triangulos.mjs; modificar un recurso común exige revisar ambas actividades.

Sin librerías externas ni acceso a red adicional. No editar otros módulos para ampliar este juego. Mantener juego.json y este README sincronizados.

## Pruebas

Desde la raíz: node --test asesores/erik/kenisa/extra-mate-parte-4/juegos/triangulos-semejantes/modelo.test.mjs. Después npm run catalogo y npm run validar. Revisar también figuras y controles en 360/768/1024/1440 px, navegación por teclado y Escape del menú global, consola, enlaces, fracciones equivalentes y señal temporal de error.
