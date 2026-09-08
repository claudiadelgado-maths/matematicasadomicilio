# Electricidad 1

Sesión introductoria de Raúl en el salón de Erik, publicada. El nombre visible sustituye Física, parte 1; se conservan el ID `raul-erik-fisica-parte-1` y la ruta `/asesores/erik/raul/fisica-parte-1/index.html` para mantener enlaces. Contexto: preparación introductoria a electricidad en planta exterior, sin presentar la sesión como material oficial del examen.

## Continuidad del trabajo

Leer `AVANCE.md` para conocer los bloques terminados y las comprobaciones pendientes. La solicitud original está en el attachment `a4fb0e92-9968-4151-b329-01ed649b46d3/pasted-text.txt`; la tabla explícita del usuario prevalece en el alcance de prefijos.

## Recorrido

Introducción (index) → Prefijos → Voltaje → Corriente → Carga → Tiempo → Resistencia → Potencia → Frecuencia → Capacitancia → Inductancia → Conversor. Cada tema es una página completa, con rutas relativas y enlace anterior/Continuar. Se retiraron las migas de pan y el menú de temas por petición del usuario. El conversor termina con regreso a las sesiones de Raúl. Los diez temas intermedios viven en `ejercicios/`; el conversor en `calculadoras/conversor/`. Cada módulo tiene HTML, CSS, README y JSON sincronizados.

## Interacciones

- Ruleta SVG con ocho preguntas sin repetición, giro breve y desacelerado, marcas de usadas e historial con la última arriba. Preguntas sobre vida cotidiana y respuestas completas en details. Reiniciar cancela la animación. No guarda respuestas personales.
- Prefijos: tabla completa suministrada de 21 filas, yotta a yocto y sin prefijo, con decimales completos. Se resaltan M, k, sin prefijo, m, μ, n y p. La tabla no se presenta como enumeración exhaustiva de todos los prefijos vigentes fuera del intervalo solicitado. Cada ronda tiene dos prefijos distintos y seis piezas (símbolo, potencia, decimal compacto). Se priorizan los frecuentes en 75 % de rondas; todos pueden aparecer. Arrastre Pointer Events con autoscroll y Escape, alternativa por selección y casilla. Las piezas desplazadas regresan al banco; no se duplican.
- Voltaje: medidor 0–100 V, paso 0.5 V; objetivos siempre alcanzables, expresados en V, kV o mV.
- Corriente: tres flujos de 100/500/1000 mA. La cantidad de paquetes visuales guarda esa proporción con igual velocidad. Representa carga positiva convencional, no velocidad de electrones. Pausa y movimiento reducido.
- Carga: tres opciones únicas, conceptos/unidades/conversión con nano y cantidades dinámicas.
- Tiempo: cronómetro con entrada decimal; min↔s con resultados sencillos y ms/μs→s. Enter y Comprobar, solución en decimal y científica.
- Resistencia: dos conductores; cambia solo longitud o sección, manteniendo las otras condiciones. Elección directa y explicación. Dibujo esquemático.
- Potencia: controles discretos V=1–20 e I=1–5, P=VI en corriente continua constante. Objetivos alcanzables; acepta todas las combinaciones que den la potencia.
- Frecuencia: onda con intervalo fijo de un segundo; 1/2/5/10 Hz cambian número de ciclos, con igual amplitud. Animación y pausa; estado inicial estático con movimiento reducido.
- Capacitores: cuatro valores distintos en μF/nF/pF, orden ascendente o descendente. Arrastre y botones de reordenamiento equivalentes, revela equivalencias en nF al entregar.
- Inductancia: sopa de 8×8 con HENRY, BOBINA e INDUCTOR, ubicaciones y orientación variables. Selección de extremos, flechas/Enter/Escape y resaltado persistente. Nueva sopa reinicia.
- Conversor: una sola magnitud, todos los prefijos de referencia, minutos exclusivamente en tiempo; intercambia unidades, valida texto decimal/coma/científica, muestra origen, operación, decimal y científica.

## Exactitud y alcance

`recursos/motor.mjs` mantiene coeficientes racionales BigInt y potencias enteras; las conversiones SI son exactas, sin artefactos de coma flotante. Admite signo, coma o punto y exponentes científicos hasta ±60, con entrada de hasta 60 caracteres. La salida decimal terminante conserva todas sus cifras; para segundos a minutos periódicos muestra 24 cifras significativas con ≈. Notación científica hasta 16 cifras significativas, indicando redondeo cuando procede. No se convierten magnitudes diferentes.

μ es micro; Ω es ohm; M y m son diferentes. Unidad sin prefijo no implica que todas las unidades eléctricas sean unidades base del SI: muchas son derivadas. Capacitancia distingue la magnitud C de la unidad coulomb C; un capacitor separa cargas opuestas y almacena energía. Potencia P=VI se contextualiza en CC constante. Los ejemplos y simulaciones son conceptuales, no procedimientos de intervención en equipos.

Referencia consultada para unidades y símbolos: [BIPM, Brochure del SI](https://www.bipm.org/en/publications/si-brochure). La selección de filas de prefijos procede de la tabla del usuario.

## Archivos y diseño

`recursos/electricidad.css` contiene el diseño azul claro propio. Cada página lo importa desde su estilos.css. `ui.mjs` renderiza KaTeX y feedback; cada interacción tiene un script de familia o exclusivo. `arrastre.mjs` se comparte solo por prefijos y capacitancia. Se preservan cabecera, pie, logotipo y botones flotantes globales. No se modifica Matemáticas ni se agregan dependencias. KaTeX 0.18.1 con SRI, como la sesión de matemáticas. Las explicaciones y tabla son HTML; si falta JavaScript permanecen legibles con notación textual. No hay almacenamiento, envío ni registro de respuestas.

## Validación

Desde la raíz: `node --test asesores/erik/raul/fisica-parte-1/recursos/motor.test.mjs`, `npm run catalogo`, `npm run validar`. Comprobar las doce páginas en móvil y escritorio, teclado, consola, menús, enlaces, resultados/reintentos/reinicios, drag con touch y ratón, pausa y conversiones extremas. El estado concreto de verificación se registra en AVANCE.md.

## Ampliación pedagógica

Las doce páginas incluyen un caso de vida diaria con ilustración SVG, una idea principal y una pregunta desplegable con respuesta explicada. La introducción y su ruleta evitan exigir teoría previa: cortes de luz, teléfonos, pilas, interruptores, electrodomésticos, Wi-Fi, estática y linternas. Los casos distinguen voltaje de corriente, potencia de energía, frecuencia de amplitud, y resistencia de inductancia. Se mantiene el lienzo azul claro con elementos visuales propios, sin el menú interno ni las migas de navegación de la captura del usuario.
