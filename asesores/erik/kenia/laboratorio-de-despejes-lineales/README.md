# Laboratorio de despejes lineales · Kenia · Erik

Actividad estática integrada en index.html. No tiene submódulos opcionales: componentes permanece en false. Conserva navegación, identidad, contador, Reiniciar, Nueva ecuación, Comprobar, historial y animaciones FLIP.

## Modelo e interacción

motor.mjs representa ambos miembros como árboles inmutables de sumas, productos/cocientes, números racionales y x. No hay fases ni ruta obligatoria. Las constantes de una suma pueden cruzar en ambos sentidos con el signo inverso. Los factores numéricos no nulos pueden cruzar si afectan al miembro completo; las sumas del otro miembro permanecen agrupadas. La x puede trasladarse como término completo al sumar/restar, o como factor al multiplicar/dividir. Dividir por x requiere que la solución de la ecuación original sea no nula y muestra la condición x ≠ 0; si admite cero se rechaza sin cambiar el estado. Nunca se divide por cero. No se distribuyen productos ni se trasladan sumandos internos de un paréntesis como si fueran independientes.

Las operaciones pueden acumularse sin combinar. Combinar evalúa únicamente dos números compatibles dentro de la misma suma, producto o cociente, con fracciones exactas reducidas; permite eliminar un cero aditivo seleccionado junto a otro término. Cambiar orden intercambia dos términos de la misma suma principal seleccionando un bloque de cada uno. Los signos viajan con sus términos. Las acciones inválidas conservan el estado. Deshacer restaura el árbol completo; Reiniciar recupera los datos iniciales.

La generación parte de x entero entre -20 y 20, a no nulo entre -30 y 30, b entre -30 y 30 y d divisor positivo de x entre 1 y 20 (para x=0, cualquiera). Reduce a/d y calcula c entero. La exploración admite resultados racionales intermedios sin decimales. La respuesta aparece cuando x está aislada y el otro miembro es un número; Nueva ecuación se habilita tras comprobar correctamente.

## Vista

script.mjs y el visor LaTeX consumen el mismo árbol mediante layout. KaTeX 0.18.1 se carga por CDN; sin él queda la notación textual. Numerador y denominador tienen identidades independientes. Las tarjetas numéricas positivas son azul claro, las negativas rosa y la x verde. Coeficiente y x forman un grupo con selección independiente; los colores representan el tipo/signo, no la operación correcta. Los neutros 0 y +1 se muestran en tarjetas; el cero aditivo y la unidad multiplicativa desaparecen al incorporar otro término o factor. El tablero conserva el igual central y desplazamiento horizontal local para expresiones largas en móvil. La zona de respuesta evita los controles flotantes. Cada tarjeta numérica incluye su signo (+ en los positivos), sin operadores aditivos externos duplicados. El tablero está directamente sobre el fondo y aprovecha el ancho de escritorio. fondo-floral.svg aporta papel punteado, flores y detalles pastel estáticos en los bordes; es un recurso local decorativo que no intercepta controles ni añade dependencias. Los avisos de error incluyen un ! rojo y las acciones correctas un pulgar arriba.

animaciones.mjs conserva desplazamientos y fusiones FLIP, bloquea controles durante el movimiento y respeta movimiento reducido. Se adapta localmente de Raúl/repaso, sin modificar esa sesión.

## Verificación

    node --test asesores/erik/kenia/laboratorio-de-despejes-lineales/*.test.mjs
    npm run catalogo
    npm run validar

Pruebas de ambos órdenes de factores en el dominio entero/fraccionario, reversibilidad, reordenación, paréntesis, errores sin mutaciones y exploración aleatoria equivalente. Revisar también teclado, móvil, escritorio, LaTeX, consola, historial y controles finales. Véase FRACCIONES.md para las reglas algebraicas.
