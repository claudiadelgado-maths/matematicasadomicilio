# Actividades de Revisión

Ruta: `/Casilleros/newstudent/revision/ejercicios/`. Componente de la sesión `newstudent-revision`, propiedad de `newstudent`. Contiene exactamente las actividades solicitadas, sin explicaciones ni soluciones en la interfaz.

## Contenido y resultados de referencia para mantenimiento

| Área | Ejercicio | Resultado |
| --- | --- | --- |
| Aritmética | 3/4 + 5/6 | 19/12 |
| Aritmética | 7/8 − 7/24 | 7/12 |
| Aritmética | (−2/3) × (9/10) | −3/5 |
| Aritmética | (3/4)/(2/3), fracción compleja | 9/8 |
| Aritmética | Simplificar 84/112 | 3/4, irreducible |
| Aritmética | −4{−3(2+5)−8×6} | 276 |
| Álgebra | 3(2x−1)=4x+7 | x=5 |
| Álgebra | x²−7x+10=0 | 2 y 5, en cualquier orden |
| Álgebra | (2x−1)(x+3) | 2x²+5x−3 |
| Álgebra | 2x(3x²−4x+5) | 6x³−8x²+10x |
| Álgebra | 2/(x+1)+4/(3x) | (10x+4)/(3x(x+1)), x≠0,−1 |
| Geometría | Trapecio isósceles: bases 5 y 11, altura 4, lados 5 | A=32 cm², P=26 cm |
| Geometría | Triángulo rectángulo: catetos 6 y 8, hipotenusa 10 | A=24 cm², P=24 cm |
| Geometría | Pentágono regular: lado 6, apotema ≈4.1291 | A≈61.9 cm², P=30 cm |
| Geometría | Cuadrado: lado 7 | A=49 cm², P=28 cm |
| Geometría | Rectángulo: base 9, altura 5 | A=45 cm², P=28 cm |
| Geometría | Círculo: radio 5 | A=25π cm², P=10π cm |
| Geometría | Recta por A(1,3), B(4,9) | y=2x+1 |

Son 6 ejercicios de aritmética, 5 de álgebra y 7 de geometría; las operaciones con fracciones y cada figura se comprueban independientemente. La apotema del pentágono se muestra como aproximación explícita, consistente con su lado. En geometría se acepta un error absoluto máximo de 0.05, que incluye el redondeo a una cifra decimal.

## Comprobación matemática

`matematicas.mjs` usa coeficientes racionales `BigInt`, polinomios en x/y y productos cruzados; no ejecuta entradas con `eval`, no compara solo cadenas ni decide equivalencia mediante muestras numéricas. Reconoce signos, paréntesis, multiplicación explícita o implícita, `/`, potencias enteras (hasta valor absoluto 8), superíndices, coma decimal y π/`pi` en respuestas numéricas. Las unidades ya están en las etiquetas y no se introducen dentro de los campos.

- Las cuatro operaciones aceptan fracciones equivalentes, estén reducidas o no.
- La simplificación requiere una fracción de enteros coprimos; un decimal equivalente no cumple esa consigna.
- Las raíces cuadráticas se comparan sin orden y deben ser las dos distintas.
- Los resultados numéricos se escriben como número o fracción (también coeficientes de π para geometría); copiar la operación original no cuenta como respuesta. Los productos algebraicos deben estar desarrollados y se comparan por identidad polinómica, permitiendo cambios de orden o coeficientes equivalentes.
- La suma algebraica debe escribirse como una sola fracción. Conserva todas las restricciones introducidas al dividir, incluso si luego se cancelan. Una secuencia de Sturm racional detecta polos reales adicionales: se permiten los originales 0 y −1, pero se rechaza, por ejemplo, un factor cancelado x−2. Los factores sin raíces reales no alteran el dominio real y se aceptan.
- La recta acepta formas lineales explícitas, generales, punto-pendiente y cocientes por constantes no nulas, mediante proporcionalidad de coeficientes. No admite cocientes con denominadores variables ni ecuaciones no lineales.
- Hay límites de longitud (180 caracteres), grado (24) y tamaño de coeficientes para impedir cálculos desmesurados. Errores de formato producen un mensaje neutro sin solución ni pista.

## Interfaz y almacenamiento

`script.mjs` controla las tres áreas, foco al navegar, comprobación individual, resumen y persistencia. Cada comprobación solo indica correcta/incorrecta; área y perímetro tienen veredictos separados. Editar una respuesta retira su veredicto anterior. Finalizar también permite respuestas pendientes, que no cuentan como correctas.

Clave `localStorage`: `newstudent-revision-v1`, objeto `{ version: 1, area, answers }`. Guarda solo respuestas y área, no datos personales ni resultados enviados. Tolera JSON corrupto o almacenamiento bloqueado. Recargar restaura los valores; las comprobaciones se recalculan al solicitarlas.

Depende de `../../recursos/comun.css`, base/navegación/identidad de la raíz y archivos propios. MathML y SVG no requieren red ni librerías. El encabezado, pie y botones flotantes se mantienen mediante los recursos existentes.

## Pruebas

`node --test Casilleros/newstudent/revision/ejercicios/matematicas.test.mjs` cubre resultados, fracciones no reducidas, raíces invertidas, álgebra equivalente, restricciones de dominio, ecuaciones de recta, redondeo, entradas vacías/malformadas y expresiones incorrectas. Además ejecutar `npm run catalogo` y `npm run validar` y revisar el recorrido por HTTP en móvil/escritorio, teclado, consola y enlaces.
