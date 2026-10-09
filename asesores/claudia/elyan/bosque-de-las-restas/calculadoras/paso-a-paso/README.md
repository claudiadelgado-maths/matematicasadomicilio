# Restas paso a paso

Calculadora `bosque-elyan-paso-a-paso` de la sesión `bosque-restas-elyan`. Acepta dos enteros entre 0 y 999 con el primero mayor o igual que el segundo. Rechaza vacíos, signos, decimales y resultados negativos; nunca intercambia los operandos sin avisar. Los ceros iniciales se interpretan como el mismo entero.

Preparar resta inicia un tablero limpio. Siguiente paso realiza una sola acción: un intercambio C→D o D→U, o una resta de columna. Cada préstamo tiene su explicación y conserva visibles los valores anteriores tachados, también en una cadena a través de cero. Ver todos los pasos recorre el mismo modelo y muestra el mismo procedimiento. Volver al principio permite repetir la última resta preparada; editar campos no altera el tablero hasta preparar otra resta válida.

No usa almacenamiento, servicios externos ni dependencias de producción. `script.mjs` importa únicamente `../../recursos/modelo.mjs` e `interfaz.mjs`; CSS común `bosque.css` de la sesión. Mantiene navegación e identidad globales.

Verificar 305−178, 600−249, 100−1, 999−999, 0−0, vacío, letras, −1, 1.5 y primero menor; comprobar que no aparece NaN ni negativos. Comparar pasos individuales con resolución completa, historial de 0→10→9, reinicio, tabulación, Enter, estado accesible y anchuras 360/768/1024/1440.
