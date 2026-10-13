# LABORATORIO de fórmulas

Apartado de EXAMEN GEOMETRÍA, casillero KENISA / Erik. Ruta pública: /Casilleros/kenisa/examen-geometria/ejercicios/laboratorio/. Entrada desde la portada de la sesión. Fecha editorial: 2026-10-11.

## Seis estaciones abiertas

Todas se pueden seleccionar desde el inicio. No hay nota final, reloj, requisitos de desbloqueo ni registro de datos personales. Cada estación conserva su pregunta y sus campos al cambiar de pestaña. Los errores se indican con texto y rosa; los aciertos con texto y verde. La paleta no utiliza rojo.

| Estación | Consignas por banco | Funcionamiento |
| --- | ---: | --- |
| Reconoce fórmulas | 27 | 14 preguntas de concepto a fórmula y 13 a la inversa; cuatro opciones, reintento y posiciones aleatorias. Central y exterior comparten una sola respuesta conceptual para evitar ambigüedad. |
| Construye fórmulas | 14 | Completar el miembro derecho de cada fórmula con editor, botones, fracciones verticales y exponentes. Acepta expresiones algebraicamente equivalentes. |
| Despeja un dato | 534 | 14 fórmulas; datos conocidos visibles y una incógnita. Incluye sustitución y despejes de las diferentes variables, resultados enteros y raíces positivas exactas. |
| Lados con x | 240 | Diez figuras con orientación variable, x conocido y expresiones ax+b. Lados de colores identificados también por letra; comprobación individual de cada longitud. No incluye círculos. |
| Plantea y resuelve | 324 | Perímetros, áreas y polígonos con expresiones lineales y relaciones verbales; incógnita x, medidas o magnitud posterior. |
| Círculos con π | 160 | Circunferencia → radio/área y área → radio/circunferencia. π permanece simbólico. |

Total: **1,299 consignas**. Las 27 de reconocimiento y 14 de construcción cubren un repertorio fijo de fórmulas, no 41 fórmulas diferentes. Las demás tienen numerosas variantes numéricas y distintos planteamientos.

## Fórmulas y nivel

Áreas: triángulo bh/2; rectángulo bh; cuadrado L²; trapecio (B+b)h/2; polígono regular Pa/2; círculo πr². Para memorizar y construir perímetros se usan solo **La suma de todos sus lados**, escrita literalmente, y **circunferencia 2πr**. Polígonos: d=N−3, D=N(N−3)/2, central/exterior 360/N, interior **180 − ángulo exterior** y suma 180(N−2). Estas mismas representaciones aparecen en las preguntas, referencias y soluciones.

B y b son distintos; a es apotema, A es área; d y D cuentan diagonales diferentes. N y n se aceptan como la misma variable; L y l también. Los ángulos se expresan en grados. Las áreas y longitudes llevan las unidades fuera del campo de respuesta.

En diagonales totales se calcula D a partir de N; no se pide resolver una ecuación cuadrática para recuperar N. Al recuperar un lado o radio se usa una raíz exacta positiva. Los ejercicios no incluyen álgebra avanzada ni Pitágoras. Los ángulos dados para hallar N siempre son enteros exactos. Los 22 despejes de la fórmula del ángulo interior relacionan el interior y su exterior adyacente, con el nombre completo en los datos. Se admiten cero diagonales para el triángulo.

Los datos propios de área de polígonos regulares corresponden a cuadrados posibles, sin necesidad de identificarlos para despejar. El banco algebraico reutiliza las variantes existentes con apotema redondeada y mantiene sus aclaraciones de aproximación. Ningún dato ni clave de las series A–D o del quinto examen se modifica.

## Editor matemático

editor.mjs construye un árbol de campos nativos, fracciones y potencias. Numerador y denominador se pueden editar directamente con clic o Tab, incluso en fracciones anidadas. Fracción envuelve la selección o lo escrito antes del cursor en ese campo; si está vacío crea dos espacios. Potencia toma la selección o el último número/letra, por lo que πr seguido de x² produce π·r². Limpiar reinicia el editor y Deshacer revierte escritura y cambios de estructura (también Ctrl/Cmd+Z).

Los botones insertan letras, cifras, π, suma, resta, multiplicación, paréntesis, fracciones y exponentes. El perímetro tiene un botón **La suma de todos sus lados** y el ángulo interior uno llamado **ángulo exterior**; ambos insertan el texto completo. El teclado físico funciona; / crea fracción, ^ crea potencia, p escribe π y Enter comprueba. Se puede volver a cualquier campo. Editar una respuesta retira el feedback anterior para no dejar un acierto desactualizado.

matematicas.mjs analiza una gramática acotada sin eval ni Function. Convierte las expresiones a cocientes de polinomios con coeficientes enteros BigInt, representa los decimales como fracciones exactas y compara sus productos cruzados; no prueba solo un valor de las variables. Acepta distributividad, orden conmutativo, multiplicación implícita, fracciones equivalentes y expresiones como 180−360/N. Rechaza sintaxis incompleta, divisiones entre cero, código, exponentes variables o fuera de 0–4 y expresiones excesivas. Las respuestas numéricas no pueden conservar incógnitas; π sí. Por tanto, una aproximación con 3.14 no sustituye a π.

Las fórmulas de referencia y las opciones matemáticas se muestran en MathML nativo, sin CDN ni paquetes de producción. Las opciones del perímetro son frases. El analizador reconoce «La suma de todos sus lados» como una unidad simbólica y «ángulo exterior» como la variable E; MathML conserva sus nombres completos. Las respuestas numéricas siguen exigiendo valores, no esas palabras.

## Aleatoriedad, reintentos y estado

Cada estación mantiene su banco, orden mezclado y conjunto de preguntas ya mostradas. Se evita repetir una pregunta durante la ronda, incluso al cambiar de filtro, y se alternan familias cuando hay alternativas. Nuevo ejercicio permite saltar; la pregunta saltada sigue contando como explorada. No se confunde ese contador con aciertos o calificaciones.

Al agotar una selección se ofrece elegir otro tema o mezclar otra ronda de esa selección. La ronda reinicia únicamente los IDs seleccionados; los otros temas conservan lo explorado. Cambiar a un filtro compatible con la pregunta actual mantiene el ejercicio y los campos. Pistas y procedimientos son opcionales y están siempre disponibles. No se avanza automáticamente después de acertar.

El estado vive solo en memoria: recargar o salir reinicia la práctica. No hay cookies, almacenamiento persistente ni envío de respuestas.

## Archivos y dependencias

- index.html, estilos.css, ejercicio.json: entrada, diseño y catálogo.
- banco.mjs: 14 fórmulas y seis bancos, opciones de memoria, filtros y bolsas.
- matematicas.mjs: analizador, equivalencia simbólica, evaluación de referencia y MathML.
- editor.mjs: editor de campos, fracciones, exponentes, teclado y deshacer.
- figuras.mjs: SVG de lados y etiquetas, misma geometría que se usa para calcular longitudes.
- script.mjs: navegación, preguntas, comprobación, feedback, pistas y procedimientos.
- laboratorio.test.mjs: verificación matemática, banco, opciones y ausencia de repeticiones.

estilos.css importa ../../estilos.css. El recurso compartido tiene siete consumidores: portada, A–D, quinto examen y este laboratorio; revisar todos si se cambia. La navegación, marca, pie y controles flotantes reutilizan recursos globales intactos.

banco.mjs importa únicamente crearBanco y mezclar del banco del quinto examen, dentro de esta misma sesión: ../../examenes/planteamiento-de-ecuaciones-y-despejes/banco.mjs. Reutiliza 300 preguntas de 25 familias de áreas/perímetros/polígonos y añade 24 despejes de apotema lineal. No importa ni modifica el modelo, estado o interfaz del quinto examen. Si cambia aquel banco, ejecutar las pruebas de ambos consumidores.

## Comprobaciones

Desde la raíz:

    node --test Casilleros/kenisa/examen-geometria/ejercicios/laboratorio/laboratorio.test.mjs
    node --test Casilleros/kenisa/examen-geometria/examenes/planteamiento-de-ecuaciones-y-despejes/banco.test.mjs Casilleros/kenisa/examen-geometria/recursos/*.test.mjs
    npm run catalogo
    npm run validar

Las pruebas sustituyen cada respuesta de despeje en su fórmula, calculan las longitudes reales de las 240 figuras, contrastan los círculos sin aproximar π y recorren todas las bolsas. La verificación de las 300 preguntas reutilizadas se complementa con las pruebas del quinto examen.

Revisión en navegador: 1,299 consignas recorridas con respuestas correctas y reintentos; fin y reinicio de las seis bolsas; fracciones verticales, fracciones anidadas, potencias, edición de numerador/denominador, teclado, deshacer y conservación al cambiar de estación. Revisar 360/768/1024/1440 px, fórmulas largas, etiquetas SVG dentro del lienzo, menú/Escape, consola y enlaces. El diseño y la edición priorizan escritorio; en pantallas estrechas se permite desplazamiento dentro del editor o una fórmula larga, no en toda la página.
