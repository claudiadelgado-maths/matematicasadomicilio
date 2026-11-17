# Seno y coseno: cinco puntos especiales

Sesión de preparatoria de Alejandrina, fecha editorial 2026-11-14. Entrada: `/Casilleros/alejandrina/seno-y-coseno/index.html`.

Dos partes integradas en la misma página:

1. Formulario de consulta para A sin(Bx+C)+K y A cos(Bx+C)+K, con A y B no nulos: dominio real, rango cerrado, amplitud, período y línea media. Método escolar de inicio x₀=−C/B, salto s=π/(2|B|) y cinco posiciones x₀+zs para z=0,…,4. Incluye los cuatro patrones de alturas y un ejemplo resuelto desplegable.
2. Laboratorio que actualiza fórmula, propiedades, procedimiento, tabla y gráfica SVG al elegir seno/coseno o editar A, B, C y K. Cuatro ejemplos cargables y una breve propuesta de exploración. La gráfica destaca un ciclo, cinco puntos y solo sus cinco abscisas; las referencias de mínimo, medio y máximo se sitúan al lado. Se dibujan prolongaciones a ambos extremos y se conserva desplazamiento horizontal local en móvil.

Todo se trabaja en radianes. El signo de AB decide la orientación inicial del seno; el de A, la del coseno. B negativo no cambia el avance positivo de los saltos. El medio tiene altura K. Si A=0 o B=0 se representa la constante real resultante, rango de un solo valor, amplitud cero y ausencia de período fundamental. Se ocultan procedimiento, leyenda y tabla de ciclo en ese caso.

`modelo.mjs` usa racionales BigInt para conservar decimales, fracciones y múltiplos de π exactamente. A, B y K admiten números o cocientes; C también acepta `pi`, `-pi/2`, `3pi/4` y `π`. Se admiten valores absolutos hasta 1 000 000 y no nulos desde 0.000001, con un máximo de 40 caracteres por campo. No se evalúa código introducido por el alumno. Las entradas incompletas o inválidas ocultan resultados anteriores y muestran un aviso. La gráfica calcula la fase relativa al ciclo para evitar cancelación numérica con inicios muy alejados; su escala se adapta al ciclo y a la amplitud de cada función.

Las coordenadas de los cinco puntos se mantienen exactas. En constantes con B=0, las fases múltiplos de π/2 se resuelven exactamente; otras fases conservan una expresión simbólica y muestran una aproximación decimal en el aviso y la gráfica.

Diseño local en crema, morado y verde, coherente con el casillero. Dependencias: base, navegación, logotipo y pie globales; `estilos.css`, `script.js` y `modelo.mjs` propios. LaTeX mediante KaTeX 0.18.1 y auto-render desde jsDelivr, como otras sesiones. El CDN requiere conexión; si falla, se conserva el código LaTeX y aparece un aviso. Sin JavaScript se puede leer el formulario y abrir el ejemplo; el laboratorio requiere JavaScript. Sin almacenamiento ni paquetes nuevos. Los componentes JSON corresponden a subcarpetas: están desactivados porque ambas partes están integradas en `index.html`.

## Validación

Ejecutar `node --test Casilleros/alejandrina/seno-y-coseno/modelo.test.mjs`, `npm run catalogo` y `npm run validar`.

Revisar por HTTP: renderizado LaTeX; cuatro patrones y ambos signos de B; fracciones y π en C; A=0, B=0 y ambos cero; entradas inválidas y recuperación; cuatro ejemplos; acordeón por teclado; menú/Escape, enlaces y consola; anchuras 360, 768, 1024 y 1440. La tabla y la gráfica pueden desplazarse localmente, sin desbordar la página. No cambiar otros casilleros ni recursos compartidos.
