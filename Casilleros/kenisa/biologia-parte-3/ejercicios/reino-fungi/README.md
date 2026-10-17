# Actividad 04 · Reino Fungi

Cierre de Biología Parte 3 para KENISA (`kenisa-erik`). Ruta pública: `/Casilleros/kenisa/biologia-parte-3/ejercicios/reino-fungi/index.html`.

## Contenido y funcionamiento

Guía completa de identidad, células y pared, estructuras, digestión externa y absorción, saprotrofía/parasitismo/mutualismo, reproducción, levaduras/mohos/setas/trufas, hábitat, condiciones e importancia ecológica y económica. Incluye comparación con plantas y animales, micorrizas, líquenes, pan, quesos, penicilina y efectos perjudiciales. Cierra relacionando las actividades 01/02/03 y enlazándolas.

- Explorador de cinco estructuras: hifa, micelio, cuerpo fructífero, esporas y pared. Números y nombres son botones nativos que resaltan partes y actualizan función y explicación. Contador de estructuras visitadas, sin duplicados. Relación de cinco funciones mediante listas desplegables, validación de vacíos, correcciones y reinicio.
- Secuencia de cuatro pasos: liberar enzimas, descomponer fuera, absorber, utilizar nutrientes. Botones mezclados, orden elegido visible, deshacer/reiniciar y explicación del primer paso incorrecto; no exige arrastrar.
- Tres mecanismos reproductivos, tres etapas ilustradas cada uno: germinación de espora, gemación y fragmentación. Cambiar mecanismo vuelve a su primera etapa; anterior/siguiente y regreso al inicio sin temporizador.
- Ocho casos: levadura de pan, moho en pan, champiñón de cultivo, moho parásito vegetal, hongo con seta micorrícico, trufa, levadura parásita y moho de queso. Cada uno combina forma, organización y relación nutricional. Conserva borradores durante la visita, valida vacíos, explica errores y contexto; cuenta cada caso resuelto una vez. Reinicio independiente.
- Banco de 60 preguntas en diez temas, seis variantes por tema. Rondas 10/20, explicaciones, resultados por tema, revisión y repaso de errores que conserva nota inicial. Motor existente de Parte 1 sin cambios; agota variantes antes de repetir.

## Archivos y consumidores

- `index.html` y `estilos.css`: guía y presentación local bajo `.fungi-page`.
- `modelo.mjs`: datos de estructuras, secuencia, reproducción y casos; evaluación pura de selecciones y orden.
- `script.mjs`: controles, estado de prácticas y montaje del repaso. Sin almacenamiento ni envío de respuestas. El progreso se pierde al recargar.
- `banco-preguntas.mjs`: fuente de verdad de las 60 preguntas. `preguntas.md`: copia para revisión docente; sincronizar cuando se edite el banco.
- `recursos/hongo.svg`: ilustración propia usada en cabecera y portada de sesión. Su copia interna en el explorador permite resaltar grupos. Conservar geometría y puntos de `modelo.mjs` sincronizados; el test verifica ambas copias.
- `recursos/tipos.svg`: cinco símbolos para diversidad y casos. `recursos/ciclos.svg`: nueve etapas. Son esquemas sin escala.
- `../../recursos/sesion.css`: identidad local compartida y fuente Fredoka de KENISA. Se reutiliza sin modificar.
- `../../../biologia-parte-1/recursos/cuestionarios.css`, `cuestionarios.mjs`, `modelo-repaso.mjs`: estilos y lógica del examen compartidos sin cambios. El modelo también mezcla la secuencia.
- Base CSS, logotipo, navegación, pie y flotantes globales, por rutas relativas. Sin dependencias nuevas.

La portada ofrece 4/4 actividades y usa `hongo.svg`. La actividad 03 enlaza a esta como continuidad; no se cambia su lógica. Al modificar recursos compartidos, revisar sus consumidores documentados.

## Criterios científicos

La pared contiene quitina y glucanos; se destaca quitina como componente característico sin afirmar un porcentaje universal ni que sea el único. Hifa y micelio no son raíces. Setas y trufas son cuerpos fructíferos; el hongo puede permanecer como micelio en el sustrato. Se distinguen hifas tabicadas y continuas sin entrar en taxonomía avanzada.

La levadura se describe en su forma unicelular típica, con nota sobre pseudohifas y cambios de forma. Los casos describen la organización observada y la relación concreta; no convierten «levadura» o «moho» en categoría de nutrición. La nutrición del socio fúngico de micorrizas/líquenes sigue siendo heterótrofa. La función de las esporas no determina por sí sola si su origen es sexual o asexual. No se confunden con semillas ni se garantiza germinación. Gemación y fragmentación se muestran como ejemplos asexuales.

Las condiciones favorables dependen de especie y sustrato. Los ejemplos de alimentos se limitan a procesos controlados; ni el color ni una ilustración identifican comestibilidad. Penicilina se presenta como compuesto de origen fúngico contra ciertas bacterias, sin consejos terapéuticos.

Referencias verificadas el 2026-10-16: OpenStax Biology 2e 24.1, 24.3, 24.5 y Microbiology 5.3, enlazadas al pie. Redacción, ejercicios e ilustraciones originales siguiendo el temario docente adjunto.

## Accesibilidad y verificación

Controles nativos, etiquetas en selectores, selección `aria-pressed`, mensajes de estado, corrección con texto además de color. Sin arrastre obligatorio ni límite de tiempo. Las tablas tienen región enfocable para desplazamiento horizontal interno. Los elementos opcionales se ocultan sin contenido.

Desde raíz: `node --test Casilleros/kenisa/biologia-parte-3/ejercicios/reino-fungi/modelo.test.mjs`, `node --check Casilleros/kenisa/biologia-parte-3/ejercicios/reino-fungi/script.mjs`, `npm run catalogo`, `npm run validar`.

Revisar cinco estructuras, relaciones vacías/incorrectas/correctas/reinicio, secuencia incompleta y errónea/deshacer/correcta/reinicio, las nueve etapas, ocho casos y contador sin duplicados, borradores y reinicio. Examen con errores y reintentos; teclado, consola, enlaces, imágenes y pantallas 360/768/1024/1440. Menú 4/4 y continuidad 03 → 04 → sesión.

Verificado el 2026-10-16: cinco pruebas automáticas aprobadas y sintaxis correcta. En navegador: cinco estructuras, relación de funciones vacía/4 de 5/5 de 5 y reinicio; secuencia incompleta/incorrecta/deshacer/correcta; nueve etapas; casos con vacío, error, borradores, ocho logros sin duplicar y reinicio. Se corrigió una colisión de identificador entre formulario y selector; DOM final sin IDs duplicados. Examen 19/20, repaso 1/1 con nota inicial conservada y controles opcionales ocultos al acertar; inicio breve de 10 verificado. Sin desbordamiento a 360/768/1024/1440 px; imágenes, teclado, menú Enter/Escape, consola y continuidad con actividad 03 correctos. Menú 4/4 comprobado en móvil y escritorio. Auditoría de las cinco páginas: 179 referencias locales y fragmentos válidos. Catálogo: 291 módulos y 21 casilleros. La validación general mantiene diez errores preexistentes de carpetas ausentes en Andrés y Renata, ninguno en esta sesión.
