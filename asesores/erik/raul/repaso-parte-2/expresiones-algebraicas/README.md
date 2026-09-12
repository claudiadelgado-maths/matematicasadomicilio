# Laboratorio de expresiones algebraicas

Segunda página de Repaso Parte 2. Reutiliza la pizarra, herramientas, selección, editor de potencia inline, historial y deshacer del laboratorio científico. Continúa hacia `../aritmetica/index.html`.

## Funcionamiento

- Creador: comienza en 1. Nuevo permite un coeficiente entero, decimal exacto o fracción y exponentes independientes de x, y, z. Exponente 0 omite la letra. Se pueden añadir números puros al numerador o denominador.
- Resolver: tres niveles con productos, cocientes y potencias pendientes; prohíbe añadir, eliminar y crear potencias, también desde el motor. Cada modo conserva su estado temporal al alternar.
- Combinar opera coeficientes y exponentes de cada letra por separado. La selección puede estar en una misma fila/grupo o en ambas filas principales. Las potencias deben evaluarse antes de combinarlas con otros factores.
- Los pasos se presentan antes de confirmar si está activado el modo educativo. El historial conserva antes, después y procedimiento. Crear y eliminar se muestran con →; las operaciones equivalentes con =.
- Trasladar un factor invierte el coeficiente y cambia todos sus exponentes de signo. Exponentes positivos mueve solamente las letras con exponentes negativos a la fila opuesta.
- Cancelar exige el mismo factor no nulo arriba y abajo. Comprobar compara racionales BigInt y vectores de exponentes, además de exigir una forma simplificada, sin comparar strings ni evaluar puntos de muestra.

## Dominio y límites

La pizarra declara expresamente **x, y, z ≠ 0** en ambos modos. Es el dominio fijo del laboratorio: permite experimentar con movimientos recíprocos y exponentes negativos sin introducir ni perder restricciones durante una transformación. Incluso x³/x³ → 1 conserva este dominio. No es una afirmación de que todos los monomios necesiten esta restricción fuera del laboratorio.

Coeficientes racionales exactos; exponentes de entrada −99…99, resultados −999…999, potencias exteriores −9…9 y hasta 18 factores principales. Se rechazan cero en denominador, 0⁰ y potencias negativas de cero. Los errores no cambian el estado. No hay persistencia ni envío de datos.

## Teclado

N Nuevo, P Crear potencia, E Evaluar potencia, C Combinar, X Cancelar, S Exponentes positivos, Z Deshacer, flechas Mover, Supr Eliminar, Esc retirar selección. Enter confirma el exponente o comprueba el resultado. Los campos y el diálogo conservan su teclado normal.

## Archivos y comprobaciones

`motor.mjs` contiene operaciones y generadores; `vista.mjs` colorea coeficiente y variables y dibuja fracciones/superíndices HTML; `laboratorio.mjs` conecta controles. `estilos.css` importa los estilos del laboratorio anterior y agrega cambios locales.

Ejecutar `node --test asesores/erik/raul/repaso-parte-2/expresiones-algebraicas/motor.test.mjs`. Cubre productos, cocientes, cancelación, dominio, cero, recíprocos, potencias, restricciones de Resolver y 300 ejercicios generados.
