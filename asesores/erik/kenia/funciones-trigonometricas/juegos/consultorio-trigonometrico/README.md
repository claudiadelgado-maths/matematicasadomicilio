# Consultorio Trigonométrico

Juego exclusivo de la sesión Funciones trigonométricas de Kenia (Erik). Estático, sin paquetes ni servicios nuevos.

## Mecánica y progresión

18 pacientes distintos, seis casos por nivel. Cada nivel baraja las seis funciones sin repetir: seno, coseno, tangente, cosecante, secante y cotangente. No hay acceso directo a niveles bloqueados. Solo seis aciertos permiten abrir el siguiente nivel; un caso resuelto cuenta una vez. Los errores no restan puntos ni vidas. El botón siguiente deja tiempo para leer el agradecimiento. Al terminar se puede reiniciar todo.

1. Emojis: tres símbolos distintos junto a los lados, con grupos diferentes en cada ronda. Seleccionar primero numerador o denominador y después un emoji; seleccionar otro lo reemplaza. Se comprueban identidades de lados, no cocientes equivalentes.
2. Números: la misma selección con las tres longitudes de una terna pitagórica válida.
3. Decimal: entrada libre con punto o coma. Se redondean tanto la entrada como el cociente correcto a dos decimales. Se aceptan 0.5 y 0.50, y 0.123 representa 0.12. Se rechazan vacíos, texto, infinito y valores negativos.

C es siempre el ángulo recto; θ alterna aleatoriamente entre A y B, con punto y arco morados y texto accesible. Los vértices no muestran letras. El SVG se encuadra alrededor del triángulo y sus etiquetas; no se muestran los párrafos de instrucciones entre el dibujo y la respuesta. La hipotenusa es AB. Las seis orientaciones se suceden en cada nivel sin deformar el triángulo. Los botones con valores aparecen barajados.

El progreso vive en memoria: recargar comienza desde nivel 1. No se envían datos ni calificaciones. No se modifica la actividad integradora de doce casillas.

## Archivos y dependencias

- index.html, estilos.css: interfaz exclusiva, encabezado y pie habituales.
- script.mjs: dibujos SVG, pacientes, selección, pistas y navegación.
- modelo.mjs: generación, validación y estado puro de progreso.
- modelo.test.mjs: pruebas nativas de Node.
- ../../recursos/modelo.mjs: seis funciones, ternas y geometría compartidas de la sesión, utilizadas sin modificación.
- CSS base, navegación y marca globales mediante rutas relativas. KaTeX existente para la notación; sin CDN se conserva el nombre de la función.

## Verificación

Ejecutar node --test asesores/erik/kenia/funciones-trigonometricas/juegos/consultorio-trigonometrico/modelo.test.mjs y las pruebas de recursos/modelo.test.mjs de la sesión. Revisar selección, reemplazo, errores, los 18 aciertos, bloqueos y reinicio; comprobar móvil, escritorio, teclado, consola y enlaces. Desde la raíz: npm run catalogo y npm run validar.

Conservar ruta, id y relación con la sesión de juego.json. No añadir opciones para saltarse niveles.

La interfaz no incluye botones de borrado ni de pistas. Para corregir, se selecciona la casilla y se elige otro lado.
