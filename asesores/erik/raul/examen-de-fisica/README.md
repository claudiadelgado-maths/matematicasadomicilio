# Examen de Física

Sesión de Raúl en el salón de Erik. Aunque conserva el nombre de examen, contiene una guía de estudio y un examen teórico final de comprensión.

Una página cuyo primer bloque contiene siete apartados: capacitancia; placas paralelas; dos tablas completas proporcionadas por el usuario; ejemplo con aire y mica; serie; paralelo; resumen de fórmulas. Fórmulas HTML con fracciones y superíndices, sin dependencias externas. Tablas en dos columnas en escritorio y una en móvil. Mantiene navegación, pie y controles globales.

Las tablas se reproducen literalmente, incluyendo sus valores diferentes para algunos materiales. En el ejemplo se declara aire K ≈ 1 y mica K = 5. ε0 = 8.85 × 10⁻¹² F/m. Área 0.0045 m², separación 0.008 m, voltaje 12 V. C aire = 4.978125 pF; C mica = 24.890625 pF. Cargas: 59.7375 y 298.6875 pC.

Ejemplos de conexión: 20, 40 y 60 μF a 24 V. Serie: CT=120/11 μF; Q=2880/11 μC; voltajes 144/11, 72/11 y 48/11 V. Paralelo: CT=120 μF; cargas 480, 960 y 1440 μC. Se redondean resultados finales, no valores intermedios.

index.html integra el contenido; estilos.css es local; sesion.json registra la sesión. Los componentes opcionales están desactivados porque no hay submódulos separados. Ejecutar npm run catalogo y npm run validar al actualizar.

## Corriente alterna

Segundo bloque con diez apartados: corriente alterna; resistor; reactancia; capacitor; inductor; tabla comparativa; procedimiento RLC en serie; valores efectivos y máximos; ejemplo RLC; resumen de fórmulas. Sin ejercicios ni nuevas dependencias. Se explicitan la señal sinusoidal, los valores RMS y la conexión en serie. El arcocoseno solo proporciona la magnitud del ángulo; el signo sigue a X. La conversión mediante 0.707 es aproximada.

Ejemplo: Vef=90 V, f=50 Hz, L=0.250 H, C=20 μF, R=90 Ω. XL=78.54 Ω; XC=159.15 Ω; X=−80.62 Ω; Z=120.83 Ω; Ief=0.745 A; factor de potencia=0.745; φ=−41.85°; P=49.94 W. Cálculos con precisión completa antes del redondeo.

## Magnetismo

Tercer bloque fijo con cinco secciones: flujo magnético; fuerza sobre una carga; inducción magnética (conductor recto, bobina circular y solenoide); ejemplo de permeabilidad relativa; resumen. Se conserva el seno con el ángulo respecto al plano para el flujo, y se aclara la convención de la normal. La fuerza usa la magnitud de q. Se explicitan los modelos de conductor largo, campo central de espiras juntas y campo interior de solenoide largo. μ₀ ≈ 4π × 10⁻⁷ H/m.

Ejemplos: flujo 0.003 Wb; fuerza 1.2 × 10⁻¹² N; conductor 50 μT; bobina 0.251 mT; solenoide μr ≈ 22.28. Sin actividades dinámicas ni dependencias nuevas.

## Leyes del electromagnetismo

Cuarto bloque teórico: Gauss eléctrica y magnética, Ampère-Maxwell, Faraday, Lenz, Lorentz y tabla resumen. Fórmulas solo de referencia, sin cálculos ni actividades. Se distingue carga neta encerrada, flujo neto y campo; Ampère-Maxwell se muestra en vacío; Faraday usa flujo por espira común; Lenz se opone al cambio de flujo. Se explica la fuerza de Lorentz y la inversión de dirección para cargas negativas.

## Examen final

18 preguntas fijas y numeradas sobre magnetismo y sus leyes, cuatro opciones y una correcta. Banco en banco-preguntas.mjs; interfaz en examen.mjs. Orden fijo, sin temporizador ni generación aleatoria. Cada respuesta se comprueba una vez y muestra la solución explicada; los errores permiten continuar. Contador de respondidas/aciertos, resultado final y reinicio completo del mismo banco. Sin persistencia. Los componentes opcionales siguen desactivados porque todo se integra en esta página, sin submódulos separados.

## Examen teórico de corriente alterna

Segundo examen de 18 preguntas fijas en banco-corriente-alterna.mjs: CA, RMS, resistor, capacitor, inductor, reactancias, fases, RLC en serie, impedancia, resonancia, factor de potencia y máximos. Comparte el renderizador examen.mjs y los estilos del examen de magnetismo. Cada examen conserva de forma independiente respuestas, resultado y reinicio. Cuatro opciones, una correcta y explicación inmediata, sin temporizador.
