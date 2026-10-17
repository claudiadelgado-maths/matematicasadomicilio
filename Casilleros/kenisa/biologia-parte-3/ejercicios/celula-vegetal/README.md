# 02 · Célula vegetal

Actividad completa de Biología Parte 3 para KENISA (kenisa-erik). Ruta pública: /Casilleros/kenisa/biologia-parte-3/ejercicios/celula-vegetal/index.html.

## Contenido y recorrido

La guía original conserva definición eucariota, pared/celulosa, cloroplastos/clorofila, vacuola/turgencia, organelos compartidos, comparación animal/vegetal, fotosíntesis, nutrición y respiración.

1. Laboratorio celular: diez estructuras y un pigmento (clorofila). Dibujo de célula fotosintética con núcleo, gran vacuola, pared separada de membrana, citoplasma, cloroplastos, mitocondrias, ribosomas, retículo y Golgi. Ampliación del cloroplasto ubica clorofila en sus membranas internas. Botones de nombres y anterior/siguiente actualizan función, explicación, pista y anillo; contador de elementos explorados.
2. Ponme a prueba: once preguntas que combinan identificación visual y función, una por elemento, tres opciones mezcladas. Primera respuesta definitiva, explicación, resultado, revisión y repaso de errores; este último conserva la nota inicial. Volver a explorar conserva los elementos visitados; volver al modo reto inicia una ronda nueva.
3. Clasifica: dieciocho tarjetas, animal/vegetal/ambas, con pistas de origen, estructuras y funciones. Incluye ausencia de cloroplastos compatible con ambos tipos, raíz sin cloroplastos y mitocondrias en plantas. Resultado, explicación y reintento de errores independientes del reto celular y del examen.
4. Fotosíntesis: controles nativos de luz, agua y CO₂. Solo con los tres activos se indica producción posible; al retirar uno se nombra lo que falta. Es un modelo cualitativo que supone las demás condiciones apropiadas; no borra reservas ni afirma que la respiración se detenga.
5. Día/noche: la vista cambia iluminación y fotosíntesis; la respiración permanece activa en ambas. Se explicitan luz diurna, ausencia nocturna y sustratos disponibles. No utiliza hora real ni temporizadores.
6. Repaso: banco conservado de 48 preguntas, ocho categorías de seis variantes. Rondas de 8 o 16, respuestas mezcladas, explicaciones, nota, revisión y práctica de errores con nota inicial conservada. Las variantes se agotan antes de repetirse. Motor existente de Parte 1, sin duplicarlo.

## Archivos y dependencias

- index.html y estilos.css: contenido, estructura y presentación original. recursos/interacciones.css añade estilos exclusivos bajo .vegetal-page.
- script.mjs: explorador, dos prácticas breves independientes, controles de insumos y día/noche; monta el repaso existente.
- modelo.mjs: once elementos con coordenadas, banco de clasificación, ronda de identificación y estados puros de los laboratorios.
- banco-preguntas.mjs: fuente de verdad de las 48 preguntas. preguntas.md: copia legible para revisión docente; conservar ambas sincronizadas.
- recursos/celula-vegetal.svg: ilustración propia consumida por el menú de sesión, cabecera y comparación. Su copia interna en el laboratorio permite seleccionar grupos data-part; debe mantener la misma geometría. Coordenadas en modelo.mjs; el anillo no forma parte del SVG externo.
- ../../recursos/sesion.css, ../../recursos/animal.svg y ../../recursos/organismos.svg#planta: recursos de la familia, reutilizados sin cambios. Fuente local de KENISA, base CSS, marca, navegación, pie y flotantes globales por rutas relativas.
- ../../../biologia-parte-1/recursos/cuestionarios.css y cuestionarios.mjs: presentación y controlador del repaso. modelo-repaso.mjs: mezcla, estado, puntuación y errores compartidos también por las prácticas breves. No se modifican.

## Criterios científicos

Clorofila es pigmento, no un organelo adicional. El detalle ampliado señala la región de membranas que contiene pigmentos, no una molécula a escala. Pared y membrana están separadas en el dibujo. El esquema representa una célula fotosintética, sin sugerir que todas las vegetales tengan cloroplastos, gran vacuola o forma idéntica. La respiración empieza en el citosol y tiene etapas mitocondriales; plantas respiran de día y noche. Autótrofo no significa no necesitar nutrientes. Las clasificaciones comparan células animales y vegetales típicas y evitan usar ausencia de cloroplastos como prueba exclusiva de origen animal.

Fuentes de verificación ya consultadas: OpenStax Biology 2e, secciones 4.3 Eukaryotic Cells, 8.1 Overview of Photosynthesis y 7.2 Glycolysis (enlaces públicos en la página). Redacción, bancos e ilustración propios a partir de la guía del docente.

## Accesibilidad y estado

Botones, casillas y progress nativos; Tab, Enter y Espacio; foco al avanzar y terminar; selección aria-pressed, retroalimentación aria-live, texto y símbolos además del color. No hay arrastre obligatorio, reloj ni bloqueo entre secciones. Respeta movimiento reducido. Sin almacenamiento ni envío de respuestas. Los resultados duran la visita y se reinician al recargar. Componentes opcionales se ocultan si no hay errores.

## Verificación

Desde la raíz: node --test Casilleros/kenisa/biologia-parte-3/ejercicios/celula-vegetal/modelo.test.mjs Casilleros/kenisa/biologia-parte-1/recursos/modelo-repaso.test.mjs. Ejecutar npm run catalogo y npm run validar.

En navegador: recorrer once elementos, completar identificación y clasificación con errores y aciertos, revisar y corregir errores, reiniciar, alternar modos, comprobar ocho combinaciones de insumos, restablecer y alternar día/noche. Completar rondas 8/16 y conservar nota inicial al repasar. Revisar menú → actividad → menú, anclajes, 360/768/1024/1440 px, teclado, consola, imágenes y enlaces. No desarrollar actividades 03 ni 04.

Comprobado el 2026-10-16: nueve pruebas automáticas aprobadas. En navegador: 11/11 elementos explorados; resultados deliberados 10/11, 17/18 y 15/16, con correcciones 1/1 que conservan el resultado original; ronda breve 8/8 y acciones de errores ocultas. Ocho combinaciones de insumos, restablecimiento y día/noche correctos. Sin desbordamiento en los cuatro anchos; imágenes, teclado y consola correctos. Menú de sesión comprobado en móvil y escritorio. Auditoría de las tres páginas: 96 referencias locales válidas. Catálogo generado con 289 módulos. Validación general: diez errores previos ajenos a KENISA, documentados en el README de la sesión.
