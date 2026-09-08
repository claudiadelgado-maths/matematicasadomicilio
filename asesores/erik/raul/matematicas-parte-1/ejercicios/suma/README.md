# Suma

Página publicada de la sesión Matemáticas, parte 1 de Raúl, después de Polinomios. Ruta: `/asesores/erik/raul/matematicas-parte-1/ejercicios/suma/index.html`.

## Recorrido

Una sola página vertical sin numeración decorativa: signos y recta numérica, suma de enteros, monomios semejantes, trinomios y polinomios de distinto número de términos. Explicaciones directas y LaTeX con la misma versión KaTeX 0.18.1 y SRI de la sesión. Siguiente enlaza a Resta.

## Interacciones y casos especiales

- Recta −10 a 10: dos puntos rojos/azules en alturas distintas para poder seleccionar ambos cuando coinciden. Arrastre Pointer Events, flechas/Home/End y controles range sincronizados. Redondeo a enteros y límites. Desplazamiento = final − inicio, incluso ±20; el cero representa ausencia de movimiento. En móvil la recta puede desplazarse horizontalmente para conservar legibles los 21 enteros, y los sliders permanecen accesibles.
- Enteros: dos sumandos entre −100 y 100; tres opciones únicas mezcladas. Una es la respuesta y otra su opuesto. Para suma cero se muestran cero y dos valores no nulos opuestos, ya que cero no tiene signo contrario. Reintentos y nuevo ejercicio independiente.
- Parejas: seis tarjetas no nulas, exactamente tres partes literales diferentes repetidas dos veces. Letras de x,y,z,w,s,d,t,a,b,c y exponentes 0–9; se omiten potencias cero y factores 1. La identidad ordena letras y elimina exponentes cero. Puede aparecer una pareja constante. Arrastre con autoscroll y Escape, alternativa seleccionar tarjeta y pulsar casilla; una casilla ocupada devuelve su tarjeta y el reemplazo conserva disponibles todas las tarjetas. Entregar revisa cada fila y muestra la suma completa o la razón del error. No duplica tarjetas; ceros se escriben 0.
- Trinomios: tres partes literales distintas, seis coeficientes enteros no nulos, orden mezclado. Seis campos de agrupación y tres finales. Se admite invertir los dos coeficientes de una pareja. Se comprueban ambos procesos contra los trinomios originales; las vistas previas solo interpretan enteros validados y nunca evalúan entrada como código. Hay feedback por grupo y resultado. Eliminar o cambiar respuestas limpia el resultado anterior.
- Polinomios: una variable, potencias distintas 0–5, cantidades 2 y 5 o 3 y 4. Comparten una parte literal y conservan las exclusivas. Hay tres agrupaciones y tres resultados únicos. Distractores: cambiar un signo, perder un término exclusivo o equivocarse en una suma. Cada bloque acepta reintentos y no depende de completar el anterior; Nuevo ejercicio restablece ambos.

## Archivos y dependencias

`algebra.mjs`: generación, identidades canónicas, formato y validación pura. `script.mjs`: enteros, trinomios y polinomios. `parejas.mjs`: tarjetas. `recta.mjs`: recta y controles. `ui.mjs`: renderizado y opciones. `estilos.css` importa el CSS existente de la sesión y añade solo estilos de Suma. `../../recursos/feedback.mjs` conserva la confirmación de Monomios y Polinomios, con movimiento reducido. No se modifica ningún recurso global ni se almacena información.

Sin CDN, las explicaciones conservan su HTML inicial y el renderizado dinámico muestra notación legible con superíndices. Sin JavaScript se indica que las actividades requieren activarlo.

## Comprobaciones

`node --test asesores/erik/raul/matematicas-parte-1/ejercicios/suma/algebra.test.mjs` verifica 5000 generaciones, opciones únicas, signos, suma cero, parejas exactas, exponentes completos, agrupación conmutativa, términos exclusivos y simplificación nula. Ejecutar además `npm run catalogo` y `npm run validar`. Revisar móvil/escritorio 360, 768, 1024 y 1440 px, teclado, recta en extremos/coincidencia, tarjetas incompletas/incorrectas/correctas, previews y validación de ambos pasos, feedback, nuevos ejercicios independientes, enlaces y consola.

Las agrupaciones y vistas previas de trinomios y polinomios normalizan los signos: no muestran +(-n). Los campos de coeficientes se separan con «y» para introducir ambos signos sin una operación ambigua. La expresión se muestra debajo; un menos delante de un grupo invierte sus coeficientes para conservar su valor. `algebra.mjs` y `ui.mjs` reexportan las utilidades compartidas en `../../recursos/algebra.mjs` y `../../recursos/actividad.mjs`, consumidas por Suma y Resta.

En Agrupar coeficientes de trinomios, `coefficientGroups` conserva cada signo dentro de su paréntesis y une los grupos siempre con +: (-7 + 9)x + (-2 - 9)y. El formato de polinomios y resultados no cambia.
