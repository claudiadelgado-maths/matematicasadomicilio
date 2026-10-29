# Espacio de Alejandrina

Índice de sesiones educativas personalizadas de Alejandrina.

Identidad visual: casillero y cabecera comparten `recursos/identidad.css` y `recursos/jardin.svg`, con fondo morado oscuro, nombre en serif cursiva clara y flores rojas, amarillas y azules. El fondo del espacio repite el mismo dibujo suavizado. Las tarjetas de sesiones conservan sus estilos y acento. la portada carga este recurso con selector exclusivo `data-student-id="alejandrina"`; no afecta los demás casilleros.

El índice carga automáticamente las sesiones publicadas desde `recursos/datos/academia.json`; no agregues tarjetas manuales.

## Contenido actual

- `traslados-y-asintotas/`: cuatro actividades con teoría, laboratorios gráficos y 285 ejercicios en total. Traslados exponenciales/logarítmicos, los tres casos horizontales, verticales con denominadores cuadráticos y práctica de ambas. Rondas de ocho, pistas, procedimientos, huecos y revisión final; MathML nativo y sin almacenamiento.

- `despejes-exponenciales-y-logaritmicos/`: práctica de siete tipos con 35 ecuaciones ordenadas y desafío de 14 ecuaciones distintas mezcladas. Respuestas numéricas con punto/coma y dos decimales, reintentos, dominio validado, MathML nativo y procedimientos a petición. Sin teoría, dependencias nuevas ni almacenamiento.

- `examen-series/`: ocho actividades de práctica aritmética y geométrica, generadores progresivos, 31 ejercicios y 20 problemas fijos en dos mini exámenes, medios con casillas editables y validación exacta de fracciones. Sin teoría adicional. Registro de implementación por etapas en `examen-series/ETAPAS.md`.

- `series-geometricas/`: menú, trece páginas progresivas con LaTeX y prácticas generativas guiadas, exploradores de potencias y sumas, y Misión constelación de 24 retos aleatorios con reanudación y repaso de errores.

- `datos-no-agrupados/`: explicación, ejercicio, calculadora y juego de estadística descriptiva.
- `diagramas-de-arboles/`: teoría, ejercicios, calculadora y juego publicados.
- `medidas-de-posicion/`: teoría, ejercicios, conversor y juego publicados.
- `multiplicacion-de-binomios/`: teoría, ejercicios dinámicos, calculadora exacta y juego publicados.
- `sucesiones-aritmeticas/`: primera sesión del bloque, con teoría progresiva, práctica generativa, analizador y juego de tres niveles.
- `formulas-de-sucesiones/`: segunda sesión del bloque, dedicada a despejar y encontrar a₁, d, n y aₙ mediante explicación, práctica, calculadora y trivia.
- `medios-y-sumas/`: medios aritméticos y sumas para primero de preparatoria, con ocho pantallas breves, práctica progresiva y dos juegos independientes. Usa el formato abierto de las sesiones de Raúl, con recursos propios.

## Para una IA

No mezcles contenido con otros usuarios. Mantén el índice sincronizado con `usuario.json` y las carpetas reales. Evita datos personales innecesarios. Comprueba enlaces, móvil, escritorio y consola.
`recursos/jardin-movil.svg` adapta las flores a las esquinas del banner en teléfonos.

La portada reutiliza el banner completo del índice y sus ajustes para móvil, centrado y a escala del 75 % en ancho y alto. La reducción conserva sus proporciones, texto y adornos; se aplica desde los estilos de la portada y no altera el banner interior.
