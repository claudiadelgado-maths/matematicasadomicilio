# Traslados y asíntotas — Alejandrina

Sesión del 2026-10-29, ID `traslados-y-asintotas-alejandrina`, para preparatoria. Entrada pública: `/Casilleros/alejandrina/traslados-y-asintotas/index.html`. Menú con cuatro actividades; cada una integra explicación, laboratorio y práctica. Solo se declara el componente `ejercicios`, porque contiene esos cuatro módulos completos.

## Contenido real

| Actividad | Laboratorio | Banco de práctica |
| --- | --- | --- |
| `ejercicios/traslados/` | Seis funciones, controles h/k, curva original/trasladada, dominio, recorrido, asíntota, punto de referencia y reto de coincidencia | 120 traslados |
| `ejercicios/horizontales/` | Tres casos por grados, zoom horizontal y tabla de valores lejanos | 52 funciones racionales |
| `ejercicios/verticales/` | Seis casos: dos raíces, raíz doble, ninguna real, hueco, cancelación parcial y dos huecos; aproximación numérica por ambos lados | 55 funciones racionales |
| `ejercicios/ambas/` | Numeradores lineal, cuadrático y cúbico, más cancelación; análisis que se revela a petición | 58 funciones racionales |

285 ejercicios en total (pueden existir funciones compartidas entre actividades que preguntan cosas diferentes). En todos los ejemplos y ejercicios racionales, el denominador original es cuadrático. En la cuarta actividad, el numerador es siempre lineal, cuadrático o cúbico. Las horizontales se resuelven mediante comparación de grados; las verticales mediante raíces y multiplicidad después de cancelar factores. Se distingue una recta asíntota de un punto excluido o hueco. El caso cúbico no tiene horizontal; la oblicua se menciona sin convertirla en objetivo de evaluación.

## Funcionamiento de la práctica

Rondas aleatorias de ocho ejercicios distintos. Se continúa consumiendo el banco durante la visita y solo se vuelve a mezclar al agotarlo; una ronda nunca contiene duplicados. Respuestas escritas, reintentos, pista conceptual, solución con procedimiento y gráfica, y resumen de los ocho ejercicios. Se separan los resueltos por la alumna, los logrados al primer intento sin pista y los trabajados consultando la solución. La solución consultada permite avanzar, pero no cuenta como acierto propio. Las entradas inválidas no suman errores y una respuesta resuelta queda bloqueada para evitar registros dobles.

Acepta enteros, decimales con punto o coma y fracciones como `-3/2`. Rechaza texto, expresiones, campos vacíos y división entre cero. Comparación numérica con tolerancia `1e-8`; las claves del banco son enteros o fracciones exactas sencillas. Las verticales pueden escribirse en cualquier orden y no se acepta repetir una recta. La ausencia de horizontal y el número de verticales se seleccionan explícitamente.

Sin almacenamiento, cuentas, red ni dependencias nuevas. Recargar o salir reinicia el avance. La teoría y navegación permanecen disponibles sin JavaScript; los laboratorios se ocultan y la práctica muestra un aviso. MathML nativo, SVG propios y controles HTML. Colores acompañados de leyendas y texto, foco visible, Enter para comprobar, controles de rango accesibles por teclado y resultados anunciados mediante regiones de estado.

## Recursos y consumidores

- `index.html`, `estilos.css`, `sesion.json`: menú y registro en el catálogo. El casillero descubre la sesión automáticamente.
- Cada carpeta de `ejercicios/` contiene `index.html`, `estilos.css`, `README.md` y `ejercicio.json`.
- `recursos/sesion.css`: estilos exclusivos de las cinco páginas. `portada.svg`: ilustración del menú.
- `recursos/modelo.mjs`: bancos, raíces cuadráticas, cancelación con multiplicidades, asíntotas, huecos, traslados y validación numérica. Polinomios en orden de coeficientes constante, x, x², x³. No usa eval.
- `recursos/formulas.mjs`: MathML y etiquetas accesibles. `graficas.mjs`: SVG, separando ramas en raíces/huecos sin unirlas a través de discontinuidades.
- `recursos/app.mjs`: laboratorios. `practica.mjs`: rondas, formularios y revisión. Ambos compartidos exclusivamente por las cuatro actividades.
- `recursos/modelo.test.mjs`: nueve pruebas del modelo, bancos, entradas y separación de curvas.

Todo cambio en recursos comunes de la sesión requiere revisar sus cuatro actividades y, para CSS, también el menú. La navegación, logotipo, pie y botones flotantes son los globales existentes, sin modificaciones. Enlaces relativos con directorio e `index.html`.

## Verificación

Ejecutar:

```text
node --test Casilleros/alejandrina/traslados-y-asintotas/recursos/modelo.test.mjs
npm run catalogo
npm run validar
```

Las pruebas comprueban las claves de los 285 ejercicios, ausencia de duplicados dentro de cada banco, grados requeridos, límites de huecos y horizontales, ceros del denominador, raíces dobles/fraccionarias, cancelación completa/parcial, dominios y puntos de traslados, formato numérico y discontinuidades gráficas. Verificar además las cinco páginas en móvil/escritorio, teclado, consola, enlaces, laboratorios, respuesta vacía/incorrecta/correcta, pistas, consulta de solución, ronda completa y continuación.

Revisión del 2026-10-29: las cinco páginas comprobadas a 360, 768, 1024 y 1440 px sin desbordamiento horizontal ni imágenes rotas; consola sin errores ni advertencias. Verificados controles de rango y formulario con teclado, menú móvil con Enter/Escape, todos los casos de los laboratorios, coincidencia de traslado, respuestas inválidas/incorrectas/correctas, fracciones, verticales en orden inverso, opción «Ninguna», cancelación parcial/total, ronda completa, resumen y nueva ronda. Acceso desde el casillero confirmado con el catálogo generado.
