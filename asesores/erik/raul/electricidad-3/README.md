# Electricidad 3

Sesión conceptual para Raúl, salón de Erik. Nueve páginas secuenciales: Joule (inicio), nodos, mallas, batería real, capacitores y asociaciones, capacitancia, placas paralelas, dieléctricos y repaso. Veinte preguntas en total, dos por bloque y cuatro finales; se presenta una pregunta por vez, se revela la respuesta correcta y el porqué inmediatamente, y el alumno decide cuándo avanzar. Sin ejercicios numéricos largos, calificación formal, persistencia ni envío de datos.

## Diseño y recursos

Fondo azul, verde y lavanda; diagramas SVG propios. Sin menú adicional de temas ni numeración decorativa. Navegación global y botones flotantes del sitio; Anterior y Continuar entre páginas, retorno al alumno al final. Fórmulas KaTeX con SRI y contenido HTML alternativo legible. La sesión no agrega dependencias npm.

- `recursos/contenido.mjs`: contenido editorial, fórmulas y preguntas.
- `recursos/explicaciones.mjs`: desarrollo narrativo, guía de observación, ejemplos numéricos resueltos y transiciones entre páginas.
- `recursos/laboratorios.mjs`: nueve exploraciones (incluida la asociación de capacitores), dibujos y controles.
- `recursos/modelos.mjs`: relaciones físicas de los diagramas.
- `recursos/actividad.mjs`: fórmulas y retos secuenciales.
- `recursos/sesion.css`: estilos exclusivos de la sesión, foco visible y movimiento reducido.
- `recursos/generar.mjs`: herramienta editorial opcional que escribe el HTML estático a partir del contenido y el marco local `recursos/marco.txt`. Ejecutar con Node después de editar textos o marcado de diagramas. No requiere compilación en el servidor.
- `sesion.json`: una sesión con todo integrado; los componentes opcionales permanecen falsos porque no hay módulos independientes de ejercicios o calculadoras.

## Condiciones de los modelos

Joule compara I y R por separado y declara la magnitud fija. La animación no representa velocidades ni temperaturas; incluye pausa y respeta movimiento reducido. La ley de nodos supone régimen estable; la malla ilustra corriente continua sin flujo magnético variable. El recorrido muestra energía por carga, no desaparición de corriente.

Batería: fem fija, resistencia externa resistiva y descarga; Vₜ = ε − Ir. Se distingue circuito abierto, r nula y caída interna. ε como fem y ε como permitividad se distinguen explícitamente por contexto.

Capacitor ideal: carga neta cero, Q es magnitud de la carga de una placa; la energía se almacena en el campo. Las acciones de carga/descarga presentan sus estados finales, sin simular tiempos RC. Desconectar conserva el estado previo. En serie se parte de capacitores descargados y nodos intermedios neutros; en paralelo comparten voltaje. Placas paralelas uniformes, sin efectos de borde y sin contacto. Al insertar dieléctrico se mantiene V fijo; C y Q aumentan. No se presenta el agua como aislante práctico por tener K grande.

## Referencias editoriales

Contenido redactado para la sesión y contrastado con OpenStax, University Physics vol. 2: [energía y potencia](https://openstax.org/books/university-physics-volume-2/pages/9-5-electrical-energy-and-power), [fem](https://openstax.org/books/university-physics-volume-2/pages/10-1-electromotive-force), [Kirchhoff](https://openstax.org/books/university-physics-volume-2/pages/10-3-kirchhoffs-rules), [capacitancia](https://openstax.org/books/university-physics-volume-2/pages/8-1-capacitors-and-capacitance), [asociaciones](https://openstax.org/books/university-physics-volume-2/pages/8-2-capacitors-in-series-and-in-parallel), [dieléctrico](https://openstax.org/books/university-physics-volume-2/pages/8-4-capacitor-with-a-dielectric) y [modelo molecular y tabla](https://openstax.org/books/university-physics-volume-2/pages/8-5-molecular-model-of-a-dielectric).

La tabla es orientativa, basada en los intervalos del borrador del usuario y valores de referencia de OpenStax. «Plástico» y «aceite» no representan materiales únicos; para aceite se amplía el rango a 2.5–4 para incluir aceite de silicona. Los valores dependen de composición, temperatura y frecuencia. Las referencias se conservan aquí, sin la línea repetida al pie de cada página que el usuario pidió retirar en sesiones anteriores.

## Verificación

`node --test asesores/erik/raul/electricidad-3/recursos/modelos.test.mjs`

`node asesores/erik/raul/electricidad-3/recursos/generar.mjs`

`npm run catalogo` y `npm run validar`.

Revisar todas las exploraciones, respuesta correcta/incorrecta, avance y repetición, final de sesión, móvil y escritorio, teclado, Escape en menú global, consola, fórmulas y enlaces. Ver `AVANCE.md` para el estado de cierre.

## Explicación paso a paso

La sesión conecta cada bloque con el anterior, anticipa qué observar en los diagramas y explica el significado de los resultados. Los ejemplos numéricos son resueltos y breves: Joule (2 A, 3 Ω), nodo (6 + 4 = 3 + 7 A), malla (12 − 4 − 8 V), batería real (12 V, 1 Ω interna, 5 Ω externa), cargas ±6 μC, capacitancia de 2 μF a 3 V, cambios de área/separación a partir de 4 μF y dieléctrico K = 2. El repaso reutiliza esos casos para unir las ideas. Los veinte retos siguen siendo conceptuales.
