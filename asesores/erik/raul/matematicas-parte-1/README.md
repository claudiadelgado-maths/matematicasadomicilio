# Matemáticas, parte 1

Inicio publicado de la sesión de Raúl, en el salón de Erik. ID: `raul-erik-matematicas-parte-1`. Ruta: `/asesores/erik/raul/matematicas-parte-1/index.html`.

## Objetivo y alcance

Conocer la experiencia y los objetivos del alumno, construir oralmente el plan de trabajo e identificar las partes de un monomio y la estructura de un polinomio. Esta entrega es el comienzo de una sesión que se ampliará con indicaciones del usuario. El cierre anuncia polinomios y operaciones como tema de la sesión; el reconocimiento de polinomios ya está disponible; la suma de números y expresiones ya está disponible.

1. `index.html`: una sola página vertical con presentación, historia matemática, plan, cierre y un único enlace Siguiente al final.
2. `ejercicios/monomios/index.html`: explicación visual breve y práctica aleatoria. Enlaza mediante Siguiente a Polinomios.
3. `ejercicios/polinomios/index.html`: estructura de polinomios y opción múltiple dinámica. Enlaza a Suma.
4. `ejercicios/suma/index.html`: recta interactiva y cuatro actividades de suma. Siguiente enlaza a Resta.

La interfaz comienza directamente con «Presentación» y sus campos. No muestra numeraciones, rótulos de etapa ni subtítulos decorativos. Usa un fondo claro en tonos lavanda, azul y verde, botones morados y controles de conversación coloreados; no hay panel envolvente. Las instrucciones son breves y directas, para una persona adulta. Los contadores de progreso se anuncian solo a lectores de pantalla. Los metadatos declaran `ejercicios: true`; la explicación está integrada en la página del ejercicio, sin un módulo separado `explicacion/`.

## Interacciones

- La presentación valida los cuatro campos y forma la frase solicitada con sus valores actuales. Usa SpeechSynthesis con voz española, controles Leer, Detener lectura y Limpiar campos. Muestra la frase y un mensaje si el servicio no puede hablar. Cancelar, editar, limpiar o salir detiene la lectura anterior.
- Las cuatro conversaciones usan `details/summary` y una casilla explícita «Ya lo conversamos». El check queda visible al cerrar cada pregunta. No se registran respuestas orales.
- El plan usa Pointer Events para ratón, lápiz y tacto, captura del puntero, arrastre con desplazamiento automático cerca del borde, cancelación con Escape y alternativa por clic, toque, Enter o Espacio. Se pueden quitar elementos; no se duplican. Las preguntas aparecen en el orden de incorporación.
- No se bloquea Siguiente por respuestas, marcas o plan incompleto: son apoyos para conversar, no una evaluación de datos personales.
- No usa cookies, localStorage, sessionStorage, formularios de envío ni grabación. El estado solo vive en la página actual. La voz la proporciona el navegador/dispositivo.

## Archivos y dependencias

- `script.js`: presentación, conversaciones y plan.
- `recursos/sesion.css`: diseño compartido únicamente por las páginas de matemáticas. Cada página importa este archivo desde su propio `estilos.css`.
- `ejercicios/monomios/`: implementación y pruebas del ejercicio; leer su README antes de modificarlo.
- Navegación, logotipo, pie y controles flotantes reutilizan los recursos globales con rutas relativas. No se alteran CSS ni JavaScript globales.
- Monomios usa la misma versión de KaTeX con SRI que otras sesiones (0.18.1). Si el CDN no está disponible, conserva HTML/MathML legible.

## Validación

Ejecutar desde la raíz:

```powershell
node --test asesores/erik/raul/matematicas-parte-1/ejercicios/monomios/monomios.test.mjs
npm run catalogo
npm run validar
```

Revisar las páginas a 360, 768, 1024 y 1440 px; presentación repetida y vacía; lectura y detención; check abierto/cerrado; arrastrar, pulsar, completar, quitar y cancelar el plan; navegación con teclado y menú con Escape; enlace Siguiente y regreso; consola y ausencia de desbordamiento.

Al ampliar la sesión, conservar rutas y sincronizar HTML, README y JSON. No añadir otros temas hasta recibir su contenido.

Monomios y Polinomios comparten `recursos/feedback.mjs`: confirmación verde con check y animación breve, error con cruz y reintento. Respeta movimiento reducido.

`ejercicios/resta/index.html`: opuestos, memorama, revisión de signos y resta de trinomios. Siguiente enlaza a Multiplicación de polinomios. Suma y Resta comparten formato algebraico y controles en `recursos/algebra.mjs` y `recursos/actividad.mjs`.

`ejercicios/multiplicacion/index.html`: distributiva, monomios y productos de polinomios con cinco actividades dinámicas. Cierra la sesión y ofrece regresar a las sesiones de Raúl.
