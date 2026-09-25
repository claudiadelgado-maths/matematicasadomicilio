# Misión constelación

Juego final de Series geométricas para Alejandrina con Erik. Veinticuatro preguntas, dos por cada una de doce familias. Datos, orden y opciones cambian entre misiones; una semilla reproduce una misión al reabrirla. Cada reto se completa con la opción correcta; los errores permiten corregir sin perder avance ni usar un reloj.

Incluye repaso de los retos fallados, nueva misión con confirmación local y persistencia en `alejandrina-geometria-mision-v2`. El estado se valida contra la misión regenerada: un cursor almacenado no puede saltar respuestas incompletas. Si el almacenamiento está bloqueado se informa y la partida continúa en memoria.

`script.mjs` maneja la interfaz. Usa exclusivamente `../../recursos/modelo.mjs`, `mision-estado.mjs`, `ui.mjs` y `sesion.css`. KaTeX 0.18.1 mediante CDN con SRI, sin framework. Mantener metadatos y enlaces del menú y de la última lección sincronizados.

Verificación: `node --test asesores/erik/alejandrina/series-geometricas/recursos/modelo.test.mjs`, desde la raíz; completar misión, recargar tras acierto/error, repasar, cancelar/confirmar reinicio, teclado y móvil. Ejecutar catalogo y validar al terminar.
