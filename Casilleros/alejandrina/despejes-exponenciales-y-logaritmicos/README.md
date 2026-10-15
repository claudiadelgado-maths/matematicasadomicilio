# Despejes exponenciales y logarítmicos — Alejandrina

Sesión del 2026-10-15 para preparatoria, usuario `alejandrina`, ID `despejes-exponenciales-logaritmicos-alejandrina`. Ruta: `/Casilleros/alejandrina/despejes-exponenciales-y-logaritmicos/index.html`. Exclusivamente práctica; sin teoría ni lecciones introductorias. Solo se declara `ejercicios`.

## Contenido real

1. **Práctica por tipo:** 35 ecuaciones fijas distintas, cinco de cada uno de siete tipos. Orden: exponenciales directas; igualación de bases; exponenciales con logaritmos; coeficientes y base e; logaritmos directos; logaritmos con expresiones; logaritmos naturales. Se resuelven las cinco de un tipo antes de avanzar al siguiente.
2. **Desafío mezclado:** 14 ecuaciones exclusivas, dos por tipo, sin repetir ninguna de la práctica. Se mezcla al entrar/reiniciar evitando dos tipos iguales consecutivos. No se indica el tipo en las preguntas. Al terminar muestra ecuación, solución, intentos y si se consultó el procedimiento.

Ambas actividades presentan una ecuación a la vez, campo para x, validación, reintentos y despeje a petición. Solo una respuesta correcta permite avanzar. Una respuesta confirmada correcta no puede duplicar el acierto. Contadores: resueltos, aciertos al primer intento e intentos incorrectos. Entradas inválidas no suman errores. Resumen final y repetición, menú y cambio de actividad disponibles.

## Matemática y validación

`recursos/modelo.mjs` construye un banco editorial de 49 ecuaciones desde siete grupos de parámetros. Cada caso incluye solución exacta numérica, ecuación, procedimiento, dominio cuando corresponde y residual para sustituir/verificar la solución. No usa eval. Bases positivas distintas de uno, miembros exponenciales positivos y argumentos logarítmicos válidos. Los resultados redondeados también cumplen los dominios.

Se aceptan enteros o decimales de hasta dos cifras, signos y punto/coma. Se rechazan vacíos, letras, fórmulas, fracciones de entrada, notación científica y más de dos decimales. La comparación se hace contra la solución redondeada a centésimas, con tolerancia de 1e-9 para representación numérica: no acepta la centésima vecina. La entrada no se interpreta como cero si está vacía. Los procedimientos conservan expresiones exactas con ln, potencias, fracciones y e antes de aproximar.

Notación MathML nativa con bases, exponentes, paréntesis y fracciones, acompañada de etiquetas accesibles en las ecuaciones. Sin KaTeX, red ni dependencias nuevas. No se guardan datos ni respuestas: recargar, salir o reiniciar borra el avance.

## Archivos

Menú `index.html`/`estilos.css`; dos módulos en `ejercicios/`, cada uno con README y `ejercicio.json`. Recursos compartidos exclusivamente por esta sesión: `sesion.css`, `modelo.mjs` y `practica.mjs`. Modelo compartido por ambas actividades; CSS también por el menú. Cualquier cambio requiere revisar sus consumidores.

Base, menú, marca y flotantes globales sin cambios. Rutas relativas a `index.html`. El casillero obtiene la sesión desde el catálogo. Botones y formulario nativos, Enter para comprobar, foco visible, resultados accesibles, procedimiento con details/summary y tabla final desplazable por teclado en móvil. Sin JS se mantiene navegación y aviso de activación.

## Verificación

`node --test Casilleros/alejandrina/despejes-exponenciales-y-logaritmicos/recursos/modelo.test.mjs`, `npm run catalogo`, `npm run validar`.

Seis pruebas verifican cantidades/ausencia de duplicados, siete claves independientes, sustitución de las 49 soluciones, dominios, redondeo, punto/coma/formato, mezcla y registro de reintentos. Revisar 360/768/1024/1440 px, teclado, MathML, consola, enlaces, respuestas vacías/incorrectas/correctas, los 35 ejercicios, los 14 del desafío, procedimientos, resumen y reinicio. No modificar módulos anteriores de Alejandrina.
