# Electricidad Parte 2

Diez páginas para Raúl, salón de Erik. Repaso y mapa inicial, Coulomb, corriente directa, voltaje, resistividad/resistencia, Ohm, potencia, Joule, mapa de conexiones y reto. No se abordan Kirchhoff, asociaciones de circuitos, resistencia interna, capacitancia, CA ni magnetismo.

Explicaciones y ejemplos son HTML estático. Recursos aislados en `recursos/`: motor numérico con unidades SI, preguntas conceptuales, laboratorios SVG y actividades. Lienzo azul abierto, identidad global y navegación secuencial. KaTeX con SRI. No se guardan ni envían respuestas.

## Recorrido

- Electricidad Parte 2: `index.html`
- Ley de Coulomb: `ejercicios/coulomb/index.html`
- Corriente eléctrica: `ejercicios/corriente/index.html`
- Voltaje: `ejercicios/voltaje/index.html`
- Resistividad y resistencia: `ejercicios/resistencia/index.html`
- Ley de Ohm: `ejercicios/ohm/index.html`
- Potencia eléctrica: `ejercicios/potencia/index.html`
- Efecto Joule: `ejercicios/joule/index.html`
- Todo está conectado: `ejercicios/conexiones/index.html`
- Reto de Electricidad: `ejercicios/reto/index.html`

## Referencias

OpenStax, Física universitaria volumen 2: secciones 5.3, 7.2, 9.1, 9.3, 9.4 y 9.5, enlazadas en las páginas. Tabla de resistividades aproximadas a 20 °C suministrada por el usuario. Valores propios de los modelos educativos.

## Verificación

Ejecutar pruebas del motor de la sesión, `npm run catalogo` y `npm run validar`; revisar laboratorios, cambios de controles, teclado, soluciones y enlaces. Ver `AVANCE.md`.

## Implementación y pruebas

Siete laboratorios SVG: Coulomb con signos, magnitudes y distancia; corriente con paso proporcional de marcadores; voltaje como energía por coulomb; resistencia con material, longitud y diámetro; circuito óhmico; potencia; disipación Joule cualitativa. Pausa y preferencia de movimiento reducido.

Banco de 36 preguntas: 30 temáticas y 6 de repaso. El reto alterna teoría y cálculo. Cada problema conserva datos originales/SI, fórmula, despeje, preparación geométrica, sustitución, respuesta, unidad e interpretación. Conversiones previas obligatorias, respuestas con unidad y atracción/repulsión en Coulomb; solución visible después de responder. Tolera 0.5 % de redondeo numérico. Nuevas preguntas evitan repetición inmediata.

`node asesores/erik/raul/electricidad-parte-2/recursos/motor.test.mjs` comprueba 4.900 problemas, conversiones, incógnitas, valores de referencia y preguntas. Las unidades conservan μ, Ω y prefijos.

La tabla de plomo suministrada difiere de OpenStax; se señala junto a la tabla y no se usa plomo para generar problemas ni en el laboratorio.

## Segunda vuelta

- Portada con tres ilustraciones SVG, acentos azul/verde y comparaciones con barras.
- Veinte predicciones guiadas: tres por laboratorio, salvo voltaje que tiene dos. Cada caso fija condiciones, muestra antes/después y permite volver a ambos; al mover controles se identifica la exploración libre. Restablecimiento de cada laboratorio.
- `comparaciones.mjs` conserva los casos y sus mediciones; `exploracion.mjs` monta las preguntas y comparaciones. No guarda información personal ni agrega dependencias.
- Los SVG conservan sus nodos al cambiar parámetros: transiciones geométricas suaves sin reconstruir los marcadores continuamente. Pausa y movimiento reducido.
- Potencia y Joule incorporan energía para 1, 10 y 60 segundos a potencia constante. Conexiones añade un ejemplo completo desplegable.
- Las ayudas de conversión corresponden a la unidad equivocada, incluidos minutos y áreas.
- `node asesores/erik/raul/electricidad-parte-2/recursos/comparaciones.test.mjs` comprueba las 20 relaciones, unidades y casos de energía; se mantiene la prueba del motor de 4.900 ejercicios.
