# Resta

Página publicada después de Suma, en la sesión Matemáticas, parte 1 de Raúl. Una sola página vertical, colores pastel, sin numeraciones decorativas. Conserva cabecera, pie y navegación global.

## Contenido e interacciones

- Opuesto de un número o monomio. Memorama de ocho tarjetas y cuatro parejas únicas: una constante y tres partes literales distintas. Empieza boca abajo y blanco; cada pareja encontrada conserva un color diferente. Clic, Enter y Espacio; los errores se ocultan tras 1,3 segundos. Nuevo memorama cancela el temporizador y restablece el estado. No se conserva información al salir.
- Un menos externo cambia todos los signos. Cuatro términos distintos, propuesta con al menos un acierto y un error. ✓ y ✕ son botones exclusivos por término. Entregar exige todas las decisiones, marca cada tarjeta y muestra la transformación correcta. Editar limpia la revisión; Nuevo ejercicio cambia también el patrón de errores.
- Resta de trinomios con explicación, tres opciones distintas, reintento y desarrollo al acertar. Los distractores suman sin invertir signos o dejan un signo sin cambiar. Se omiten coeficientes uno y términos cero; una cancelación total muestra cero.
- Regreso a Suma. Siguiente enlaza a Multiplicación de polinomios, última página de la sesión.

## Archivos y dependencias

`motor.mjs` genera los ejercicios; `script.mjs` maneja el DOM; `estilos.css` importa `../../recursos/sesion.css`. Suma y Resta comparten `../../recursos/algebra.mjs` y `../../recursos/actividad.mjs`, que reutiliza `feedback.mjs`. KaTeX 0.18.1 con SRI, igual que la sesión; respaldo legible si no carga. No agrega dependencias ni recursos globales.

## Validación

Ejecutar `node --test asesores/erik/raul/matematicas-parte-1/ejercicios/resta/motor.test.mjs` y las pruebas de Suma. Ejecutar `npm run catalogo` y `npm run validar`. Comprobar escritorio/móvil, teclado, enlaces, consola, parejas erróneas y correctas, reinicio durante la espera, revisión incompleta y completa, distractores y solución.

El memorama escribe explícitamente el signo interior: -(+10) y -(-10). Usa azul claro en lugar de rosa. Al completar las cuatro parejas, muestra sus cuatro igualdades debajo del tablero; Nuevo memorama las oculta y borra.
