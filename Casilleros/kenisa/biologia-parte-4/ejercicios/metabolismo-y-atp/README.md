# Actividad 02 · Metabolismo celular y ATP

**Actividad completa (2026-10-18).** Usuario `kenisa-erik`, sesión `biologia-parte-4-kenisa-erik`, ejercicio `metabolismo-y-atp-biologia-4-kenisa-erik`. Entrada: `/Casilleros/kenisa/biologia-parte-4/ejercicios/metabolismo-y-atp/index.html`.

## Ya disponible

- Guía de metabolismo, materia y energía, reacciones celulares, anabolismo/catabolismo, ATP/ADP, uso y regeneración, enzimas, activación, sustrato/sitio activo, temperatura/pH, desnaturalización y nutrientes.
- Introducción breve a glucólisis, respiración, mitocondrias, fermentación y fotosíntesis, sin desarrollar las futuras actividades 3 y 4.
- Ilustración original `recursos/atp.svg`, esquema de construcción/degradación, ciclo de ATP en dos tarjetas, gráfico cualitativo de activación y tablas. El SVG se utiliza también en el menú de sesión; conservar su ruta.
- Ocho casos guiados con explicación desplegable nativa. Funcionan sin JavaScript; la consigna pide responder primero en voz alta o en cuaderno. No simulan corrección automática, puntuación ni progresos inexistentes.
- Banco original de 48 preguntas, ocho temas con seis preguntas cada uno. Rondas de 8 o 16, explicación, resultado y repaso de errores con nota inicial conservada. Se conecta mediante el motor existente; no se desarrolla un sistema nuevo.
- Menú de sesión con etiqueta «Lista para explorar», acceso desde actividad 1 y regreso al menú.

## Cinco estaciones interactivas

1. **Rutas:** diez procesos para distinguir anabolismo y catabolismo. Pista, corrección inmediata, reintentos, selector de casos y contador de respuestas correctas únicas.
2. **ATP:** molécula manipulable con adenina, ribosa y fosfatos explorables. Usar ATP en un ciclo de la bomba Na⁺/K⁺ forma ADP y fosfato libre; regenerarlo exige aportar energía. Acciones fuera de orden explican qué falta sin alterar el contador. La animación conserva los tres fosfatos, dos unidos en ADP.
3. **Enzimas:** relacionar amilasa, lactasa y catalasa con sustratos y productos. Se guardan borradores por enzima durante la visita; validación de vacíos, corrección por campo, reintentos y esquema de reacción. La enzima no se convierte en producto.
4. **Condiciones:** cinco retos de predicción y exploración libre con temperatura, pH y dos enzimas hipotéticas. Actividad cualitativa alta, baja o inactiva, sin porcentajes ni valores universales. El calor extremo desnaturaliza irreversiblemente la muestra en este modelo; enfriarla no la repara. «Usar muestra nueva», elegir otro reto o cambiar de enzima introduce una muestra funcional. Cambiar solo temperatura o pH conserva el daño. La exploración libre no suma retos; cada reto correcto cuenta una vez.
5. **Energía:** ocho situaciones para distinguir energía almacenada, aprovechamiento de nutrientes, uso del ATP y transporte sin gasto directo de ATP. Dos casos por categoría, explicación, reintentos y contador sin duplicados.

El tablero cuenta cinco estaciones completas; ATP requiere un ciclo y las demás todos sus casos. No bloquea el recorrido. Cada estación tiene reinicio independiente. Los ocho casos guiados originales se conservan como práctica adicional.

## Archivos y dependencias

`index.html`: guía, estaciones, casos y estructura del examen. `estilos.css`: presentación local `.metabolism-page`, importa `../../recursos/sesion.css` y `../../../biologia-parte-1/recursos/cuestionarios.css`. `modelo.mjs`: datos de casos, máquina de estados ATP, evaluación de relaciones y modelo de condiciones en funciones puras. `script.mjs`: controles, SVG dinámico, progreso y montaje del cuestionario compartido `cuestionarios.mjs`, que usa `modelo-repaso.mjs`, sin modificar recursos comunes. `modelo.test.mjs`: siete pruebas del modelo, integridad del banco, rondas y anclajes. `banco-preguntas.mjs`: fuente de verdad; `preguntas.md`: copia docente, sincronizar tras editar el banco. `ejercicio.json` declara el contenido real.

Se reutilizan navegación, marca, base, pie y flotantes globales. No hay dependencias nuevas, temporizadores, almacenamiento, cuentas ni envíos de respuestas. Todo el progreso existe durante la visita y se pierde al recargar. La guía y los casos desplegables no requieren JavaScript; las estaciones se muestran después de inicializar sus controles.

Botones y selectores nativos, etiquetas, `aria-pressed`, foco visible y avisos de corrección con texto además de color. Sin arrastre obligatorio ni límite de tiempo. La animación de fosfatos respeta movimiento reducido mediante los estilos compartidos.

## Criterios científicos

Metabolismo no equivale únicamente a digestión. La digestión animal degrada nutrientes y gran parte ocurre fuera de las células; no se afirma que cada paso digestivo fabrique ATP. Anabolismo y catabolismo son rutas complementarias. La liberación de energía se refiere al balance de una reacción o ruta, no a romper aisladamente cualquier enlace.

ATP y ADP conservan adenina y ribosa y difieren en número de fosfatos. El esquema de regeneración es conceptual, no una ecuación química balanceada; la hidrólisis incluye agua. ATP es transferencia de energía inmediata, no reserva a largo plazo ni energía creada de la nada. Síntesis, movimiento, transporte activo y división requieren energía; no todo transporte la utiliza directamente.

Las enzimas reducen la barrera de activación sin cambiar la diferencia energética entre inicio y final. No se consumen netamente en cada ciclo, aunque pueden degradarse o perder función. La mayoría son proteínas, con excepción de ARN catalítico. Sitio activo, sustrato y producto se distinguen. La actividad depende de cada enzima; frío no implica necesariamente desnaturalización irreversible.

La glucólisis se ubica en el citosol, no requiere directamente oxígeno y da un balance neto pequeño de ATP. La fermentación se introduce como regeneración de NAD⁺ para sostener la glucólisis; en los ejemplos habituales el ATP procede de esta última. No se introducen etapas respiratorias ni tipos de fermentación. Plantas y bacterias también requieren energía; producir ATP no exige universalmente mitocondrias.

Fuentes de consulta verificadas el 2026-10-17: OpenStax Biology 2e 6.1, 6.4 y 6.5, enlazadas al pie. Texto, preguntas y esquemas originales conforme al temario adjunto.

## Verificación

Ejecutar `node --test Casilleros/kenisa/biologia-parte-4/ejercicios/metabolismo-y-atp/modelo.test.mjs`, `node --check Casilleros/kenisa/biologia-parte-4/ejercicios/metabolismo-y-atp/script.mjs`, `npm run catalogo` y `npm run validar`.

Comprobar ATP fuera de orden, conservación de estado y varios ciclos; 18 combinaciones enzimáticas y daño irreversible; nueve relaciones posibles por enzima; casos sin duplicados; 48 preguntas únicas, seis por categoría y copia docente sincronizada. En navegador: vacíos, errores y aciertos de cada estación, pistas, borradores, reinicios, progreso 5/5, rondas 8/16 y repaso de errores con nota original. Revisar menú, continuidad 1 → 2, regreso, teclado, imágenes, consola y tamaños 360/768/1024/1440.

Verificado el 2026-10-18: siete pruebas aprobadas y sintaxis válida. En navegador, diez rutas y ocho situaciones correctas, error/pista/reintento y conteo sin duplicados; ATP fuera de orden y ciclo completo; tres enzimas con vacíos, error y aciertos; cinco predicciones, calentamiento seguido de enfriamiento y recuperación con muestra nueva. Tablero 5/5 y reinicios independientes. Examen 7/8, repaso de errores 1/1 conservando la nota inicial e inicio de ronda de 16. Teclado y foco en ATP, menú por Enter/Escape, sin errores de consola, imágenes rotas ni desbordamiento en los cuatro tamaños. Portada → actividad 1 → actividad 2 y regreso comprobados. El README de sesión registra la auditoría de enlaces y los errores previos del validador general.

Continuidad desde 2026-10-18: el cierre enlaza a la actividad 03 de respiración celular, ya disponible. Fermentación sigue reservada para la actividad 04.
