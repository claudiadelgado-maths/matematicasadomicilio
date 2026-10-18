# Actividad 04 · Fermentación

Usuario `kenisa-erik`, sesión `biologia-parte-4-kenisa-erik`, ejercicio `fermentacion-biologia-4-kenisa-erik`. Entrada pública: `/Casilleros/kenisa/biologia-parte-4/ejercicios/fermentacion/index.html`. Cierra las cuatro actividades de Biología parte 4.

## Alcance

Guía ilustrada: glucólisis, NAD⁺/NADH, rutas láctica y alcohólica, lactato y músculo, microorganismos y alimentos, biotecnología, fermentación frente a respiración aerobia y anaerobia, rendimiento energético y conexiones con las tres actividades anteriores.

- **Recicla NAD⁺:** simulador con dos rutas, tres glucosas y dos transportadores reutilizables. Glucólisis consume NAD⁺ y aporta 2 ATP netos; fermentar regenera NAD⁺ sin ATP adicional. Muestra piruvato, lactato o etanol y CO₂. Los pasos fuera de orden explican qué falta sin cambiar el estado. Una ruta cuenta al completar su primera fermentación; cambiar de ruta inicia otra muestra y conserva las rutas comprobadas.
- **Conecta ejemplos:** cinco casos (pan, yogur, músculo, queso e industria), dos selectores con corrección por campo y borradores conservados al cambiar de caso.
- **Compara ATP:** cinco cantidades de glucosa, predicción del rendimiento neto y barras comparativas con respiración aerobia eucariota. Las barras representan 2 frente a 32; el texto expresa el intervalo aproximado 30–32.
- **Distingue procesos:** doce situaciones, cinco opciones y explicación; incluye dos casos en los que falta información. Reintentos libres y conteo de aciertos únicos.
- **Examen:** 48 preguntas originales, ocho categorías de seis, rondas 8/16 y repaso de errores sin alterar la nota inicial. `preguntas.md` es la copia docente sincronizada.

Cuatro estaciones con reinicios independientes. No bloquean contenido. El progreso vive durante la visita y se reinicia al recargar; no hay cuentas, almacenamiento ni envío de respuestas. Guía y desplegables funcionan sin JavaScript; las prácticas se revelan al inicializarse.

## Archivos y consumidores

`index.html` y `estilos.css` conservan contenido y presentación local bajo `.fermentation-page`. `modelo.mjs` contiene modelos puros y casos; `script.mjs` conecta controles y progreso. `banco-preguntas.mjs` es la fuente del examen; mantener `preguntas.md` sincronizado. `modelo.test.mjs` contiene seis pruebas. `ejercicio.json` describe el módulo.

`recursos/fermentacion.svg` es una ilustración original consumida por esta cabecera y la portada de sesión. Usa texto alternativo; el significado no depende solo del dibujo o el color. Controles nativos, etiquetas, estados `aria-pressed`, corrección anunciada, foco visible y tabla con desplazamiento interno enfocable.

Importa `../../recursos/sesion.css` y `../../../biologia-parte-1/recursos/cuestionarios.css`, `cuestionarios.mjs` y `modelo-repaso.mjs`, sin modificar estos recursos. Mantiene base, navegación, marca, pie y flotantes globales mediante rutas relativas. Se accede desde la portada y desde el cierre de actividad 03; enlaza a todas las actividades anteriores y al casillero.

## Criterios científicos

El simulador representa las rutas homoláctica y alcohólica típicas, no todas las fermentaciones microbianas. Los dos NAD⁺ representan un conjunto didáctico limitado, no la cantidad real en una célula. ADP, fosfato y demás componentes se suponen disponibles. Sin escalas temporales ni cinética.

Glucólisis: una glucosa produce dos piruvatos y 2 ATP netos (4 producidos menos 2 invertidos). La etapa fermentativa regenera NAD⁺ desde NADH, no añade ATP en las dos rutas estudiadas. La homoláctica conserva seis carbonos en dos lactatos, sin CO₂; la alcohólica, en dos etanoles y dos CO₂. Los esquemas de carbono no son ecuaciones químicas completas.

Fermentar no necesita O₂ directamente y puede ocurrir aunque esté disponible. Citosol no equivale a mitocondria. Levaduras y músculo pueden fermentar teniendo mitocondrias; las bacterias lácticas no son levaduras. Lactato y ácido láctico son formas relacionadas: predomina lactato al pH celular; no causa directamente el dolor muscular tardío y puede reutilizarse.

Respiración anaerobia utiliza cadena y un aceptor final diferente de O₂. Ausencia de oxígeno o presencia de gas por sí solas no identifican un mecanismo. El rendimiento aeróbico 30–32 ATP es aproximado para muchas células eucariotas, no universal. Producción de alimentos y conservación dependen de los organismos y condiciones; fermentación no implica esterilidad.

Fuentes enlazadas en la página: OpenStax Microbiology 8.4, Biology 2e 7.5 e investigación sobre cultivos de yogur (PMC4034325), consultadas el 2026-10-18. Texto, ilustración, preguntas y ejercicios originales adecuados al temario.

## Comprobaciones

Ejecutar `node --test Casilleros/kenisa/biologia-parte-4/ejercicios/fermentacion/modelo.test.mjs`, `node --check Casilleros/kenisa/biologia-parte-4/ejercicios/fermentacion/script.mjs`, `npm run catalogo` y `npm run validar`.

Revisar ambos ciclos, bloqueos y conservación de ATP; relaciones vacías/incorrectas/correctas; cinco cantidades por teclado; doce casos; reintentos, conteo único, tablero 4/4 y reinicios independientes. Examen 8/16 y repaso de errores. Pantallas 360/768/1024/1440, menú Enter/Escape, foco, imágenes, consola, enlaces y retorno al menú.

Verificado el 2026-10-18: seis pruebas aprobadas. Navegador: ambas rutas y bloqueos; relaciones vacías, incorrectas, correctas y borradores; cinco cantidades de ATP por teclado; doce casos con corrección y reintentos; conteos únicos, tablero 4/4 y reinicios independientes. Examen 7/8, repaso 1/1 conservando nota inicial e inicio de ronda de 16. Menú Enter/Escape y foco visible. Sin errores de consola, imágenes rotas ni desbordamiento a 360/768/1024/1440 px. Menú → 03 → 04 → menú comprobado. Validación global sin errores ni avisos; detalles del catálogo y enlaces en README de sesión.
