# Repaso Parte 2

Tres páginas integradas para Raúl (`raul-erik`), conectadas mediante Continuar:

1. `index.html`: laboratorio de notación científica existente.
2. `expresiones-algebraicas/index.html`: laboratorio de monomios, productos, cocientes y potencias, con Creador y Resolver.
3. `aritmetica/index.html`: práctica rápida con tres niveles, nueve categorías y Mezcla todo. Incluye formulario, soluciones, contadores y tablas 2–10.

Cada nueva área tiene su propio README. El resto de este documento describe el laboratorio científico original.

## Modos

- **Creador** comienza en 1. Permite agregar, eliminar, crear potencias o valor absoluto sobre factores de una misma fila/grupo, redondear y realizar las operaciones exactas. Los cambios de construcción se indican con →; el redondeo con ≈.
- **Resolver** genera problemas básicos, intermedios y avanzados y ofrece el ejemplo de fuerza eléctrica que da 720 N. Solo admite operaciones equivalentes. No permite agregar, eliminar, inventar potencias ni redondear, también en el motor y los atajos. Reiniciar recupera el problema original. Otro ejercicio genera uno nuevo; cambiar nivel también.
- Cambiar de modo conserva temporalmente la expresión y el historial independientes. No hay almacenamiento al recargar/cerrar.

## Pizarra y selección

Cada factor tiene un botón principal. Las fichas científicas ofrecen «Solo 10» para seleccionar la potencia de diez independientemente. Los grupos de potencia y valor absoluto muestran delimitadores y un botón para seleccionarlos completos; sus factores interiores siguen seleccionables. Selección múltiple, Ctrl/cmd + clic y Seleccionar todos. No permite seleccionar simultáneamente un grupo y sus descendientes.

Potencia crea un editor de exponente en la propia expresión. Al confirmar, queda una estructura pendiente; **Evaluar potencia** calcula todo el grupo posteriormente. No existe un modal de potencia. El único diálogo es Nuevo término.

## Reglas matemáticas

La regla anterior que cambiaba el valor al cruzar la barra está eliminada. Mover el factor completo crea su recíproco pendiente con potencia −1; mover solo la potencia de diez invierte su exponente y deja el coeficiente en su fila. Ambas conservan exactamente el valor. Los factores interiores se pueden combinar/reordenar; para cruzar la barra se selecciona un factor principal o se evalúa primero su grupo.

Combinar multiplica coeficientes y suma exponentes dentro de una misma fila/grupo. En selección de ambas filas, divide coeficientes y resta exponentes; deja el resultado en el numerador incluso con exponente negativo. No combina simultáneamente grupos sin evaluar con factores simples. El modo educativo (activado inicialmente) enseña coeficientes y potencias antes de confirmar el cambio; puede desactivarse. El historial conserva antes, después, relación y procedimiento.

Cancelar requiere dos factores no nulos exactamente iguales en valor, uno en cada fila principal. Normalizar y las conversiones decimal/científica son exactas. El valor absoluto está integrado y permite combinar primero sus factores o evaluar el grupo completo. Cada operación presentada con igualdad comprueba además el valor racional completo antes y después.

La comprobación final compara valores matemáticos exactos y exige una sola expresión atómica sin cocientes ni grupos pendientes. Si el problema pide notación científica normalizada, también verifica el formato. Una expresión original todavía sin simplificar no se da por terminada. En simplificación general, 720 y 7.2×10² son respuestas equivalentes.

## Teclado

N nuevo (Creador), P crear potencia (Creador), E evaluar potencia o valor absoluto según selección, C combinar, X cancelar factores, S normalizar, D decimal, T científica, R redondear (Creador), Z deshacer, Supr/Retroceso eliminar (Creador), flechas mover, Esc retirar selección/cancelar editor. Enter confirma el editor de potencia o comprueba en Resolver cuando no está activando otro control. No se interceptan los atajos mientras se escribe ni dentro del diálogo. Escape cierra Nuevo de forma nativa. Foco visible en los controles.

## Precisión y límites

Fracciones BigInt; sin coma flotante ni redondeos implícitos. Decimal conserva cifras periódicas con barra o informa cuando excede el límite visual. Las entradas decimales conservan inicialmente ceros escritos (por ejemplo 0.060). Redondear deja dos decimales en el coeficiente y señala aproximación si cambia el valor. Cero se normaliza a 0×10⁰. Se rechazan denominadores nulos, 0⁰ y potencias negativas de cero.

24 factores principales, 60 componentes, seis niveles de agrupación; exponentes −999…999 y potencias −12…12; 350 cifras en expansión decimal y 100 acciones deshacibles. Los errores no modifican la expresión ni consumen historial.

## Archivos

- `index.html`, `estilos.css`: diseño y controles propios.
- `laboratorio.mjs`: modos, selección, editor inline, diálogo, eventos y estado deshacible.
- `motor.mjs`: árbol numérico y operaciones racionales exactas.
- `vista.mjs`: notación HTML con superíndices, fracciones y procedimiento.
- `motor.test.mjs`: invariantes de equivalencia, restricciones, generador y ejemplo completo.
- `sesion.json`: publicación y metadatos. Componentes opcionales falsos porque todo está integrado en las tres páginas secuenciales.

El laboratorio científico no usa dependencias externas. La práctica aritmética usa el mismo KaTeX por CDN que otras sesiones, con renderizado HTML alternativo; no se agregaron paquetes npm ni se envían respuestas a servidores.

## Verificación

Ejecutar `node --test asesores/erik/raul/repaso-parte-2/motor.test.mjs`, `npm run catalogo` y `npm run validar`. Revisar modos, selección interior/externa, editor inline, recíprocos, educación previa, historial, deshacer, reinicio, comprobación, atajos, diálogo, consola y anchos 360/768/1024/1440 px. El ejemplo de fuerza eléctrica admite distintas rutas exactas hasta 720 N.

## Verificación de la ampliación

`node --test asesores/erik/raul/repaso-parte-2/motor.test.mjs asesores/erik/raul/repaso-parte-2/expresiones-algebraicas/motor.test.mjs asesores/erik/raul/repaso-parte-2/aritmetica/pruebas.test.mjs`

Después: `npm run catalogo` y `npm run validar`. Los estilos globales no se modificaron.
