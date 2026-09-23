# Repaso en física

Sesión independiente de Raúl, del asesor Erik.
Estado actual: sesión de repaso por actividades; están implementadas la Actividad 1 («Prefijos del SI»), la Actividad 2 («Conversiones»), la Actividad 3 («Operaciones con notación científica»), la Actividad 4 («Ley de Coulomb»), la Actividad 5 («Electricidad básica»), la Actividad 6 («Ley de Ohm, potencia y efecto Joule») la Actividad 7 («Kirchhoff, FEM y capacitancia»), la Actividad 8 («Práctica personalizada») y la Actividad 9 («Laboratorio de circuitos»). La fecha editorial inicial es 2026-09-22.
Lee este README y sesion.json antes de trabajar, también si eres una IA.

## Estructura actual

- index.html es el menú público de la sesión.
- estilos.css contiene el diseño local del menú.
- latex.js configura MathJax y renderiza todas las expresiones matemáticas escritas en TeX/LaTeX. No lo elimines mientras las actividades usen notación matemática.
- actividad-1-prefijos-si/ contiene la primera actividad completa (HTML, CSS, JavaScript y su README).
- actividad-2-conversiones/ contiene la segunda actividad completa (HTML, CSS, JavaScript y su README).
- actividad-3-operaciones-notacion-cientifica/ contiene la tercera actividad completa (HTML, CSS, JavaScript y su README).
- actividad-4-ley-de-coulomb/ contiene la cuarta actividad completa (HTML, CSS, JavaScript y su README).
- actividad-5-electricidad-basica/ contiene la quinta actividad completa (HTML, CSS, JavaScript y su README).
- actividad-6-ohm-potencia-joule/ contiene la sexta actividad completa (HTML, CSS, JavaScript y su README).
- actividad-7-kirchhoff-capacitancia/ contiene la séptima actividad completa (HTML, CSS, JavaScript y su README).
- Las siguientes actividades deben añadirse como nuevas subcarpetas cuando se definan; no crees actividades vacías.

## Trabaja solamente en esta carpeta

- Puedes ampliar el menú y añadir nuevas subcarpetas de actividades.
- Añade JavaScript, SVG y recursos propios dentro de esta sesión cuando hagan falta; usa recursos/ si aparecen recursos compartidos solo por esta sesión.
- No añadas equivalencia decimal a la Actividad 1 hasta que se diseñe explícitamente esa fase.
- Actualiza descripcion, objetivo y conocimientosPrevios en sesion.json cuando cambie de forma real el contenido de la sesión.
- Los campos de componentes permanecen en false mientras no existan las carpetas convencionales explicacion/, demostraciones/, ejercicios/, juegos/ o calculadoras/.

## Contrato que debes conservar

- No renombres la carpeta repaso-en-fisica, index.html, estilos.css, latex.js, sesion.json ni README.md.
- No cambies estos campos de sesion.json: id = repaso-en-fisica-raul-erik; slug = repaso-en-fisica; tipo = sesion; usuario = raul-erik; ruta = /asesores/erik/raul/repaso-en-fisica/.
- Conserva estado = publicado para que siga apareciendo en el alumno. No vuelvas a registrar la sesión.
- La fecha editorial la administra quien incorpora la versión; conserva 2026-09-22 hasta que esa persona decida actualizarla en este JSON.
- Conserva encabezado, logotipo, menú, pie, enlace de salto y main con id contenido en la portada; las migas enlazan al alumno (../) y al asesor (../../).
- Conserva las referencias relativas a ../../../../recursos/css/base.css, ../../../../recursos/js/navegacion.js y ../../../../recursos/svg/ en la portada. Las subpáginas deben ajustar la profundidad relativa correctamente.
- Todas las expresiones matemáticas visibles deben escribirse como TeX/LaTeX y renderizarse con latex.js/MathJax; evita volver a usar superíndices Unicode, fracciones con barras de texto o fórmulas construidas manualmente con HTML.
- El script global genera los controles flotantes: no los dupliques.
- No edites archivos fuera de esta carpeta. La carpeta utiliza recursos de la plataforma: por sí sola no es una copia autónoma del sitio.

## Actividad 1 · Prefijos del SI

Ruta: actividad-1-prefijos-si/

La actividad usa los 21 renglones de la tabla definida para este repaso, incluido «sin prefijo». Practica prefijo, símbolo y potencia de diez. Muestra dos opciones por pregunta. Un acierto avanza automáticamente tras 1 segundo; un error revela la respuesta correcta y espera el botón «Siguiente». El botón «Ver tabla» abre la tabla de consulta sin equivalencia decimal.

## Actividad 2 · Conversiones

Ruta: actividad-2-conversiones/

Practica forma decimal ↔ notación científica con dos opciones por pregunta. Las conversiones directas usan exponentes $-6 \le n \le 6$. También aparecen preguntas con mega, kilo, hecto, deca, deci, centi, mili, micro y nano para conectar el repaso de prefijos con la transformación de cantidades. Los aciertos avanzan automáticamente tras 1 segundo y los errores muestran la respuesta correcta antes de continuar.

## Actividad 3 · Operaciones con notación científica

Ruta: actividad-3-operaciones-notacion-cientifica/

Practica simplificación de expresiones con notación científica como las de la hoja de ejercicios: productos, cocientes y expresiones combinadas. El alumno escribe coeficiente y exponente; el resultado debe quedar normalizado con coeficiente $1 \le |a| < 10$. El avance, el borrador y el historial se guardan localmente.

## Actividad 4 · Ley de Coulomb

Ruta: actividad-4-ley-de-coulomb/

Repasa fórmula, comportamiento según el signo de las cargas, efecto de duplicar distancia o carga, valor y unidades de k y unidad de fuerza. Termina con el problema $q_1=-16\,\mu\mathrm{C}$, $q_2=+18\,\mu\mathrm{C}$ y $r=60\,\mathrm{mm}$; el alumno escribe la magnitud y selecciona atracción o repulsión. La respuesta es $720\,\mathrm{N}$ y atracción. El historial y el borrador del problema se guardan localmente para que no se pierdan al recargar.

## Actividad 5 · Electricidad básica

Ruta: actividad-5-electricidad-basica/

Se organiza en cinco niveles internos: intensidad de corriente, voltaje, resistencia/resistividad, tabla de resistividades a $20\,^\circ\mathrm{C}$ y reto mixto. Incluye los problemas numéricos de $150\,\mathrm{mA}$ durante $30\,\mathrm{min}$ ($\approx 1.69\times10^{21}$ electrones), $24\,\mathrm{J}$ entre $3\,\mathrm{C}$ ($8\,\mathrm{V}$) y resistencia de cobre con datos dados ($0.172\,\Omega$). La tabla se puede consultar desde cualquier nivel y el progreso se guarda localmente.

## Actividad 6 · Ley de Ohm, potencia y efecto Joule

Ruta: actividad-6-ohm-potencia-joule/

Se organiza en tres bloques internos. Ley de Ohm presenta $V=IR$, $I=V/R$ y $R=V/I$ y contiene tres ejercicios numéricos simples con resultados $12\,\mathrm{V}$, $3\,\mathrm{A}$ y $6\,\Omega$. Potencia eléctrica presenta su significado, unidad watt y $P=IV$, $P=V^2/R$ y $P=I^2R$, con resultados $24\,\mathrm{W}$, $20\,\mathrm{W}$ y $36\,\mathrm{W}$. Efecto Joule se trabaja con su definición y dos comparaciones de situaciones. El progreso y los borradores se guardan localmente.

## Actividad 7 · Kirchhoff, FEM y capacitancia

Ruta: actividad-7-kirchhoff-capacitancia/

Se organiza en cuatro bloques internos. Kirchhoff repasa la primera y segunda ley, las reglas de resistencias en serie y paralelo y dos ejercicios ($22\,\Omega$ y $\approx1.43\,\Omega$). Fuerza electromotriz incluye una pregunta conceptual. Resistencia interna incluye dos preguntas sobre qué representa y cómo se incorpora al circuito. Capacitancia repasa $C=Q/V$, farad, $C=\varepsilon A/d$, permitividad, tablas de $K$ y $\varepsilon_r$, capacitores en paralelo y serie, y dos ejercicios ($7\,\mu\mathrm{F}$ y $2\,\mu\mathrm{F}$). El progreso y los borradores se guardan localmente.

## Entrega y sustitución

Devuelve la carpeta completa repaso-en-fisica, sin una carpeta adicional anidada. El responsable sustituye la carpeta en /asesores/erik/raul/repaso-en-fisica/ conservando nombre y ubicación.
Los cambios de HTML, CSS, JavaScript y recursos se sirven directamente al recargar por HTTP. Si hay caché, recarga sin caché; al publicar, sube los archivos actualizados.
Para reflejar también cambios de metadatos en las listas, el responsable ejecuta desde la raíz npm run catalogo y npm run validar. Estos comandos actualizan derivados automáticamente; no se edita ningún registro externo manualmente.

## Verificación de entrega

Abre /asesores/erik/raul/repaso-en-fisica/ desde el servidor de la plataforma. Comprueba que el menú abre las Actividades 1, 2, 3, 4, 5, 6 y 7 y que desde todas se vuelve al menú. En la Actividad 1 revisa las 21 preguntas y el modal «Ver tabla». En la Actividad 2 revisa conversiones positivas y negativas, ambos sentidos decimal ↔ científica, preguntas con prefijos y el modal «Ver guía». En las Actividades 1 y 2 comprueba respuestas correctas e incorrectas, avance automático en aciertos, avance manual en errores y reinicio. En la Actividad 3 comprueba productos, cocientes, expresiones combinadas, normalización y persistencia del avance. En la Actividad 4 comprueba además persistencia del historial al recargar, el cálculo final de $720\,\mathrm{N}$ y la selección «Atracción». En la Actividad 5 comprueba los cinco niveles, la tabla consultable, los resultados $\approx1.69\times10^{21}$ electrones, $8\,\mathrm{V}$ y $0.172\,\Omega$. En la Actividad 6 comprueba los tres bloques, los resultados de Ohm ($12\,\mathrm{V}$, $3\,\mathrm{A}$ y $6\,\Omega$), potencia ($24\,\mathrm{W}$, $20\,\mathrm{W}$ y $36\,\mathrm{W}$), las dos situaciones de efecto Joule y el enlace a la Actividad 7. En la Actividad 7 comprueba las leyes de Kirchhoff, resistencias equivalentes ($22\,\Omega$ y $\approx1.43\,\Omega$), FEM, resistencia interna, capacitancia, tablas dieléctricas y los ejercicios de capacitores ($7\,\mu\mathrm{F}$ y $2\,\mu\mathrm{F}$), además de persistencia, reinicio, teclado, móvil, consola y ausencia de desbordamiento horizontal.

## Revisión de las entradas

Las actividades 3 a 7 no muestran ejemplos ni indicaciones de formato junto a las casillas. Las etiquetas y unidades se conservan. Coulomb y electricidad básica requieren datos completos y válidos antes de corregir; enviar en blanco no revela la solución. Se conservan los borradores del alumno.

## Actividad 8 · Práctica personalizada

Dos modos: errores pendientes capturados en las siete actividades y rondas de seis problemas con datos aleatorios. Temas: Ohm, potencia, Coulomb, corriente/carga, resistencias equivalentes, capacitores equivalentes y notación científica. El modo mixto toma seis temas distintos. Casillas vacías, unidades visibles y solución opcional después de un error. Solo una respuesta correcta habilita Continuar; los errores no penalizan ni avanzan. Ronda, respuestas y borrador se guardan bajo repaso-fisica-ronda-v1. La cola repaso-fisica-errores-v1 no altera las notas iniciales: una pregunta deja de estar pendiente cuando se resuelve en el repaso.

Los historiales recuperables de las actividades 3 a 7 se importan al abrir cada actividad. Las actividades 1 y 2 no tenían historial persistente; se capturan errores a partir de esta versión. Los problemas finales de 4 y 5 tampoco conservaban errores anteriores a esta versión. Las importaciones no reactivan errores ya repasados. Se registra cada enunciado una sola vez.

## Actividad 9 · Laboratorio de circuitos

Cinco configuraciones: Ohm, resistencias en serie/paralelo y capacitores en serie/paralelo. Fuente ideal de 1–24 V; componentes de 1–20 Ω o μF. Dibujos SVG, controles de teclado, cálculos instantáneos, conservación de corrientes o voltajes según la conexión y una predicción sobre duplicar el voltaje. Capacitores ideales en régimen permanente: carga almacenada sin animación de corriente continua. Configuración guardada localmente. El movimiento respeta prefers-reduced-motion.

## Recursos de ampliación

recursos/repaso.js gestiona cola y almacenamiento con alternativa en memoria; lo consumen las nueve actividades. recursos/practica-modelo.mjs contiene generadores, comparación y circuitos, con pruebas en recursos/practica-modelo.test.mjs. recursos/taller.css solo lo consumen las actividades 8 y 9. No se añaden dependencias. Los componentes convencionales de sesion.json permanecen false porque las actividades conservan el esquema local actividad-N/.

Pruebas: node --test asesores/erik/raul/repaso-en-fisica/recursos/practica-modelo.test.mjs. Revisar captura y resolución de errores, persistencia, coma decimal, casos vacíos/incorrectos/correctos, cada circuito, valores extremos, teclado, móvil y consola.
