# Práctica de Matemáticas

Sesión integrada para Raúl, salón de Erik. Cuarenta y seis niveles de opción múltiple y cuatro respuestas únicas por pregunta. Todos son accesibles desde el menú superior. No hay lista fija de preguntas: cada intento genera un lote aleatorio sin repetir expresiones del lote inmediatamente anterior del mismo nivel ni del lote actual.

| Nivel | Contenido | Problemas | Tiempo | Pasos por problema |
|---|---|---:|---:|---:|
| 1 | Sumas 0–20 | 12 | 1:00 | 1 |
| 2 | Mayor menos menor, 0–20 | 12 | 1:00 | 1 |
| 3 | Sumas y restas, enteros −20…20 | 15 | 1:30 | 1 |
| 4 | Signos, letras/números, cuadrados, hasta tres negaciones | 10 | 0:45 | 1 |
| 5 | Fracciones reducibles con uno a tres signos negativos | 10 | 2:10 | 1 |
| 6 | Suma de dos o tres fracciones positivas, mismo denominador | 6 | 3:00 | 1 |
| 7 | Fracciones con signos e igual denominador absoluto | 10 | 4:00 | 2 |
| 8 | Dos fracciones positivas, distintos denominadores | 4 | 1:30 | 1 |
| 9 | Dos fracciones con signos, denominadores absolutos 1–10 distintos | 6 | 2:30 | 2 |
| 10 | Producto positivo, numeradores/denominadores 1–20 | 4 | 1:00 | 1 |
| 11 | Producto con signos mediante paréntesis, posible factor entero | 5 | 1:30 | 1 |

## Reglas

Comenzar inicia un reloj para todo el nivel; no hay temporizador por pregunta ni pausa. Los pasos intermedios también consumen tiempo. Se usa una fecha límite absoluta, comprobada antes de aceptar cada respuesta y al volver a la pestaña. El contador no depende de cuántas veces se ejecuta el intervalo.

Acertar avanza automáticamente. Una respuesta incorrecta detiene el nivel y conserva el problema, la selección equivocada y la respuesta correcta; se ofrece Reiniciar nivel. El tiempo agotado también bloquea las respuestas y requiere reiniciar. No se puede continuar un intento fallido. Reiniciar genera todo el lote de nuevo. Cambiar de nivel abandona el intento y muestra su pantalla inicial; no inicia el reloj hasta pulsar Comenzar.

Los niveles 7 y 9 mantienen visible el mismo problema y presentan dos preguntas consecutivas: reacomodo y resultado. Al llegar al segundo paso se conserva visible el reacomodo correcto. El progreso distingue problema, paso y total de respuestas. Las marcas de niveles completados duran esta visita; no hay almacenamiento, cuentas ni envío de respuestas. La página no es una evaluación supervisada ni pretende impedir reinicios mediante recarga.

## Generación matemática

AST para números, letras, negación, suma, resta, fracción, multiplicación y cuadrado. Racionales BigInt reducidos, denominador positivo y comparación canónica exacta. El nivel 4 permite monomios simbólicos simples; no se comparan mediante sustituciones de prueba. Las opciones se filtran por valor matemático para que no haya dos equivalentes y se barajan.

En el nivel 5 se construye primero una fracción reducida y se amplifican ambos términos por un mismo factor 2–9. En 7 se normalizan signos y se suman numeradores. En 9 se usa el producto de denominadores positivos como denominador común (no necesariamente el mínimo) y se muestran los productos cruzados. Los resultados de los niveles 5–11 se presentan como fracciones reducidas, incluso enteros sobre 1. El cero se presenta como 0/1.

Rangos elegidos donde no se especificaron: nivel 3 −20…20; coeficientes del nivel 4 1–6; nivel 5 base inicial 1–12 sobre 2–15 antes de reducir; nivel 6 denominador 2–12 y numeradores 1–12; nivel 7 denominador absoluto 1–10 y numeradores 1–12; nivel 8 denominadores 2–10 y numeradores 1–12; nivel 9 numeradores 1–12.

## Archivos y extensión

- `generador.mjs`: catálogo `levels`, familias parametrizadas, validación y lotes nuevos. Para añadir un nivel, agregar su definición y generador; la interfaz y navegación se adaptan al catálogo.
- `partida.mjs`: estados ready/running/failed/timeout/complete, reloj inyectable y avance de pasos.
- `vista.mjs`: matemáticas KaTeX con alternativa HTML de fracciones y superíndices.
- `actividad.mjs`: menú, controles, progreso, temporizador y teclas 1–4.
- `index.html`, `estilos.css`: interfaz aislada, navegación e identidad globales.
- `sesion.json`: registro automático. Componentes opcionales falsos porque el juego completo está integrado en esta página.

Sin paquetes npm nuevos. KaTeX utiliza la versión con SRI empleada en las demás sesiones; si no carga, se usan fracciones y superíndices HTML locales.

## Verificación

`node --test asesores/erik/raul/practica-de-matematicas/pruebas.test.mjs`

Prueba 21000 problemas, configuración de niveles, unicidad y equivalencia, límites, lotes nuevos, fallos, vencimiento incluso entre ticks y avance de dos pasos. Después ejecutar `npm run catalogo` y `npm run validar`. Revisar navegador en móvil/escritorio, teclado, menú global, error y reinicio, fin de tiempo real, final del nivel, navegación y consola.

## Ampliación: sustitución

| Nivel | Contenido | Problemas | Tiempo |
|---|---|---:|---:|
| 12 | Sustitución básica positiva | 8 | 2:00 |
| 13 | Sustitución con signos | 8 | 2:30 |
| 14 | Sustitución avanzada | 8 | 3:00 |
| 15 | Una fracción positiva | 6 | 2:00 |
| 16 | Una fracción con signos | 6 | 2:30 |
| 17 | Dos o tres fracciones con igual denominador | 6 | 3:00 |

Todos tienen un paso por problema. El valor de x permanece visible junto a la expresión, incluso al fallar. Las familias aleatorias abarcan monomios, binomios, trinomios, cuadrados y fracciones según el nivel. x está entre 1 y 6 en los niveles positivos; en los demás su magnitud está entre 1 y 5, con un 70 % de valores negativos para reforzar su práctica. Coeficientes de magnitud 1–4, constantes 1–6 y denominadores constantes 2–8 mantienen cálculos razonables. En 15 y 16 se alterna x en numerador, denominador o ambos; se comprueba el denominador tras sustituir y se corrige antes de construir las opciones si fuera cero. El nivel 17 usa un denominador constante común positivo.

La expresión original se conserva como AST; substitute crea una copia numérica que evalúa el mismo motor racional exacto. El identificador incluye expresión y valor de x. Los resultados enteros se muestran como enteros y los restantes como fracciones reducidas. No se modifican el controlador de partida ni sus reglas.

## Edición de niveles

Editar nivel aparece antes de comenzar y tras fallo, tiempo agotado o finalización. Permite aplicar entre 1 y 100 problemas y un tiempo de 0–5999 minutos y 0–59 segundos, con duración total positiva. La configuración es independiente por nivel y dura la visita; recargar recupera los valores originales. Restaurar valores originales recupera la configuración del catálogo. No cambia generadores ni dificultad. En un intento terminado se conserva la revisión original; el reinicio toma inmediatamente los nuevos valores. En niveles de dos pasos se cuentan problemas completos.

## Despejes

Niveles 18 (10 problemas, 2:00), 19 (9, 2:45), 20 (8, 3:00), 21 (7, 3:15) y 22 (6, 3:15). Un paso por problema: ¿Cuánto vale x? Conservan la edición de cantidad/tiempo y todas las reglas.

18–21 construyen c = ax + b a partir de x entero de magnitud 1–10 (hasta 12 en el nivel 18 para admitir dos lotes de 100 sin repetición), coeficientes de magnitud 1–6 y constantes de magnitud 1–12. 18 alterna ax=c y x+b=c; 18–19 son positivos. 20 incorpora signos y 21 cambia el orden de los términos y los miembros. 22 genera ecuaciones con una letra constante y, opcionalmente, a en el coeficiente de x (a ≠ 0 explícito). Se generan factores comunes de 1–3 que se cancelan en las opciones. Las respuestas se comparan por coeficientes racionales exactos de la forma (u+v·letra)/(d·parametro), no por apariencia ni por sustitución puntual. La ecuación se representa con un nodo de igualdad separado del valor de la solución.

## Factorización

Niveles 23–25: positiva, con signos y con dos letras, respectivamente. Cada uno comienza con 12 problemas (dos de cada tipo) y 10 minutos (tiempo elegido al no especificarse; editable). Todos incluyen factor común, agrupación, cuadrado perfecto, diferencia de cuadrados, trinomio general y diferencia de cubos. No se muestra el tipo en la interfaz.

factorizacion.mjs construye factores, expande con polinomios multivariables BigInt y obtiene el enunciado. Los distractores alteran factores y se deduplican mediante expansión exacta. El reparto reserva floor(cantidad/6) por tipo y asigna los sobrantes sin repetición a tipos barajados. Se baraja el orden final y se excluyen expresiones del intento anterior; funciona con la edición de 1–100 problemas. La agrupación usa cuatro términos (cúbicos con una letra o producto de binomios con dos letras). Las diferencias conservan los signos negativos imprescindibles incluso en el nivel positivo. Solo se usan dos letras simultáneamente en el 25.

## Fracciones algebraicas

26: 5 problemas/2:00, operaciones de 2–3 fracciones con factores lineales distintos y productos relacionados; 27: 6/2:00, monomios con factores cancelables; 28: 5/2:30, productos o cocientes de dos fracciones monomiales; 29: 6/3:00, ecuaciones racionales construidas para resultar lineales tras eliminar denominadores, con solución entera válida. Todos mantienen edición, temporizador y reinicio. Se indican restricciones del dominio original, incluso si se cancela un factor. Las equivalencias se comprueban exactamente mediante productos cruzados de polinomios BigInt. Las ecuaciones usan x+p y x+q, con p y q distintos y no necesariamente opuestos.

## Cuadráticas y sistemas

30: 6 problemas/3:00; 31: 6/4:00; 32–35: 4/5:00 cada uno. Conservan edición, generación de lotes nuevos y todas las reglas. cuadraticas-sistemas.mjs utiliza racionales BigInt reducidos. Las cuadráticas se expanden desde dos raíces: enteros −10…10 en 30, fracciones pequeñas de denominador 2–5 en 31. Existe una probabilidad de raíz repetida; ambas se muestran siempre. Los pares de raíces se deduplican sin importar el orden.

Los sistemas se construyen desde una solución elegida y se rechazan matrices con determinante cero. 32 usa coeficientes de magnitud 1–3 y soluciones 0–6; 33 usa signos y soluciones −6…6; 34 usa un denominador común 2, 3 o 5 en los cuatro coeficientes; 35 varía denominadores 2–5 y permite soluciones fraccionarias. Las constantes se calculan exactamente a partir de la solución; en 35 se limitan a numeradores de magnitud 60 y denominadores de hasta 30. Cada opción muestra el par completo; el orden x,y sí importa. Pares y sistemas se renderizan con LaTeX y alternativa HTML local.

## Lenguaje algebraico y problemas verbales

36: 15/6:00; 37: 15/6:00; 38: 10/5:00; 39: 8/6:00; 40: 6/6:00; 41: 5/7:00; 42: 5/8:00. problemas-verbales.mjs genera familias parametrizadas y variaciones de redacción; no contiene un banco de preguntas fijas. Los enunciados permanecen visibles al fallar. Las respuestas numéricas incluyen todos los números solicitados, etiquetas cuando importa el orden y unidades.

36 incluye multiplicar, dividir, aumentar y restar en ambos órdenes; 37 combina operaciones y paréntesis; 38 construye ecuaciones desde soluciones enteras; 39 incluye diferencias, consecutivos enteros/pares/impares y múltiplos; 40 plantea ecuaciones lineales de una incógnita con tarifas, perímetros, edades, repartos y movimiento; 41 plantea sistemas lineales de dos incógnitas con compras, números, edades, productividad y paquetes; 42 incluye edades, encuentro en movimiento, repartos, recetas, equilibrio de palancas y entradas con dos precios. Se explicitan las hipótesis de productividad constante y barra de peso despreciable.

Cada problema valida sus cuatro opciones con las relaciones originales antes de mostrarse; en traducciones la comparación es algebraica exacta mediante productos cruzados. Se filtran opciones equivalentes o repetidas. Las familias numéricas se construyen a partir de soluciones enteras, y sus condiciones lineales determinan un único resultado. Pruebas recorren todas las familias, respuestas, lotes editados y reinicios.

## División exacta de polinomios

43: 6 problemas/4:00; 44: 6/5:00; 45: 5/6:00. division-polinomios.mjs construye divisor A y cociente B con coeficientes enteros pequeños y signos variados; multiplica y expande A·B con polinomios BigInt. Cada opción se verifica por el producto A·opción, con exactamente una coincidencia. Los polinomios se simplifican y ordenan por grado total descendente y orden lexicográfico entre monomios del mismo grado.

43 usa solo x, divisor lineal el 85 % de las veces (cuadrático en el resto) y cociente de dos términos de grado 1–2. 44 usa x, divisor lineal/cuadrático y cociente de 2–4 términos de grado 2–3, con posibles términos faltantes. 45 mezcla una variable con dos variables (75 %), divisores de grado 2 y cocientes de grado 2–3, con posible constante adicional. Se limitan los dividendos a ocho términos y coeficientes de magnitud 36. Los ejercicios muestran siempre «entre», nunca el signo de división. Mantienen edición de 1–100 problemas y todas las reglas de juego.

## Residuo

46: 6 problemas/4:00. remainderProblem construye D, Q y R y expande DQ+R. D tiene grado 1–2; Q, 1–2. R alterna cero, constantes positivas, constantes negativas y binomios lineales (solo si D tiene grado 2). Las opciones tienen grado menor que D y se deduplican algebraicamente. Conserva «entre», edición, temporizador y reinicio.

La progresión 36–41 es: expresiones simples, compuestas, ecuaciones en palabras, relaciones entre números, ecuaciones lineales contextualizadas y sistemas lineales contextualizados. Se conservan tiempos y cantidades. Los contextos son variantes de un objetivo algebraico, no categorías temáticas. Al fallar en 40–41 se muestra el planteamiento numérico correspondiente.
