# Actividad 1 · Partes de la célula animal

Ejercicio exclusivo de Biología parte 1, Kenia → Erik. Entrada pública: `/asesores/erik/kenia/biologia-parte-1/ejercicios/partes-de-la-celula-animal/`.

## Archivos y recursos

- `index.html`, `estilos.css`, `script.js` y `ejercicio.json` forman este módulo.
- `../../recursos/celula-animal.svg` es el dibujo vectorial compartido con el inicio de esta sesión. Revisar ambos consumidores al cambiarlo.
- `../../recursos/biologia.css` contiene la identidad de esta familia.
- Se conservan la base, navegación, marca, pie y controles flotantes globales con rutas relativas a seis niveles.

## Correspondencias y dibujo

La tabla `structures` de `script.js` vincula cada nombre con su casilla, indicador, descripción y punto exacto. El tablero mide 960 × 850; incluye el SVG de 680 × 820 desplazado a (270, 15). La tabla siguiente usa coordenadas del tablero. No cambiar el dibujo sin revisar estos puntos.

| Número | Respuesta | Punto x, y del tablero |
| --- | --- | --- |
| 1 | Membrana plasmática | 560, 50: borde turquesa |
| 2 | Citoplasma | 415, 165: medio azul claro |
| 3 | Núcleo | 590, 248: cuerpo rosado |
| 4 | Nucléolo | 690, 303: círculo amarillo dentro del núcleo |
| 5 | Retículo endoplasmático | 469, 365: membranas verdes plegadas |
| 6 | Ribosomas | 412, 438: grupo de puntos violetas |
| 7 | Aparato de Golgi | 700, 488: sacos anaranjados apilados |
| 8 | Mitocondria | 508, 563: cuerpo coral con crestas |
| 9 | Citoesqueleto | 401, 636: filamento dorado |
| 10 | Centriolo | 720, 697: cilindro azul estriado |
| 11 | Peroxisoma | 538, 751: esfera verde granular |

Las casillas siguen el orden vertical de las estructuras. Sus líneas no se cruzan; al señalar, enfocar o arrastrar sobre una casilla se resalta su recorrido y se muestra una descripción de la forma, sin revelar el nombre. Los puntos extremos son anillos para no tapar la estructura.

## Composición adaptable

- Más de 950 px: banco de palabras en una columna vertical a la izquierda, casillas en otra columna y célula a la derecha, unida mediante líneas.
- Hasta 950 px: ilustración ampliada arriba; debajo, banco vertical izquierdo y casillas numeradas a la derecha. Se conservan los indicadores y líneas cortas sobre las estructuras. El enlace «Ver célula» permite regresar al dibujo.
- Los nombres largos se ajustan dentro de las tarjetas. Se respeta la preferencia de movimiento reducido.

## Interacción

- El banco empieza mezclado y nunca en orden 1–11. Todas las tarjetas siguen disponibles; un pequeño número indica dónde se colocó cada una.
- Ratón: arrastrar del banco a una casilla o mover una respuesta ya colocada con HTML Drag and Drop nativo.
- Pantallas táctiles y lápiz: seleccionar y tocar una casilla, o arrastrar tarjetas y respuestas colocadas mediante Pointer Events. Se puede desplazar la página desde el resto de la superficie.
- Teclado: Tab, Enter/Espacio y Escape. Elegir una tarjeta por teclado lleva el foco a la primera casilla vacía; Tab recorre las siguientes. Escape cancela la selección y el resaltado.
- Cada tarjeta ocupa una sola casilla. Reemplazar una respuesta libera la anterior; tocar una respuesta sin selección la retira y selecciona su tarjeta.
- Cada colocación se evalúa inmediatamente: verde con ✓ si es correcta; rojo con × si es incorrecta. La tachita desaparece a los 1200 ms, mientras el rojo permanece hasta corregir o retirar la respuesta. El estado también aparece en el nombre accesible y en mensajes en vivo.
- Cada error tiene su propio temporizador, cancelado al mover, reemplazar, retirar o reiniciar la respuesta. Los aciertos de otras casillas no se borran.
- Puntaje y barra de progreso se actualizan en cada cambio. Comprobar resume el avance, avisa de las casillas vacías y vuelve a mostrar la tachita en los errores; las casillas vacías permanecen neutrales.
- Reiniciar limpia respuestas, selección, arrastres, temporizadores y puntaje; vuelve a mezclar el banco. No utiliza almacenamiento, red ni servicios externos.

## Navegación y ampliación

«Volver al inicio» apunta a `../../`. «Siguiente actividad» sigue deshabilitado porque no existe la actividad 2. Cuando exista, sustituirlo por un enlace relativo a su carpeta y quitar la nota de indisponibilidad.

## Comprobaciones

Ejecutar desde la raíz `npm run catalogo` y `npm run validar`. Revisar Inicio → Actividad 1 → Inicio, once correspondencias y 11 / 11, arrastre real de ratón y táctil, selección por toque, movimiento y reemplazo, reintentos, comprobación vacía y reinicio con nueva mezcla. Verificar error inmediato, desaparición de la tachita sin borrar el rojo, corrección antes del vencimiento y reinicio durante una animación. Probar 360, 768, 1024 y 1440 px, nombres largos, teclado, menú móvil con Escape, consola, enlaces y ausencia de desplazamiento horizontal.
