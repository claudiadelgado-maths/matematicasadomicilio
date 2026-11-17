# Crecimiento y decrecimiento exponencial

Sesión de preparatoria de Andrés. Fecha editorial: 2026-11-15. Entrada: /Casilleros/andres/crecimiento-y-decrecimiento-exponencial/index.html. Identidad estable: crecimiento-y-decrecimiento-exponencial-andres, usuario andres, estado publicado.

## Continuidad y alcance

Continúa **Interés simple y compuesto** (2026-10-13), apoyándose también en **Porcentajes** (2026-08-10). Tales (2026-09-22) es otro bloque. La sesión anterior ya permite comparar interés simple y compuesto y calcular montos finales; esta amplía el modelo multiplicativo a decrecimiento, interpretación del factor, cambio porcentual acumulado y recuperación de la cantidad inicial.

Todo está integrado en index.html, por eso los indicadores de subcarpetas en componentes son false. No hay carpetas opcionales vacías.

1. Explicación: diferencia constante frente a razón constante; Q_n=Q_0 b^n; factores mayores que 1, entre 0 y 1 y caso constante. Se trabaja con cantidades iniciales positivas, factores positivos y períodos enteros no negativos. Tasa y tiempo deben usar la misma unidad.
2. Tres ejemplos resueltos: 500 al +20 % durante 3 períodos (864), 1000 al −20 % durante 2 períodos (640) e inicio de 968 tras +10 % durante 2 períodos (800). Se explica el período cero y por qué +10 % seguido de −10 % no se cancela. No se introducen logaritmos ni tiempos fraccionarios.
3. Laboratorio: cantidad inicial de 0.01 a 1 000 000, tasa con signo entre −90 % y 100 %, ambas con hasta dos decimales; entre 1 y 12 períodos. Actualiza fórmula, factor, resultado, cambio acumulado, gráfica SVG y tabla. Inspector de cada período desde cero. Tres ejemplos precargados. Entradas incompletas o inválidas ocultan resultados anteriores y marcan el campo.
4. Práctica: diez retos fijos y progresivos, respuesta numérica, pistas, reintentos y procedimiento. Acepta punto o coma decimal sin separadores de miles, con tolerancia de 0.005 para el redondeo a dos decimales. Cada reto se cuenta una sola vez; consultar su solución lo clasifica como repasado, separado de los resueltos. Resumen y reinicio completo. No se guarda progreso.

## Recursos y comportamiento

- estilos.css: diseño propio en verde, crema y dorado; selectores bajo .exponential-session. La utilidad [hidden] usa !important para conservar los estados ocultos.
- sesion.js: IIFE, carga del modelo, laboratorio, gráfica y flujo de práctica.
- modelo.mjs: cálculo sin redondeo intermedio, lectura de números, validación y banco de retos.
- modelo.test.mjs: pruebas de crecimiento, disminución, constantes, extremos, recuperación inicial, entradas y respuestas del banco.

Solo se reutilizan base, navegación, logotipo y favicon globales. El enlace a la sesión anterior es navegación, no una dependencia de código. Se conservan encabezado, menú, pie y controles flotantes globales.

Las matemáticas estáticas y dinámicas usan LaTeX, renderizado con KaTeX 0.18.1 desde jsDelivr, versión ya usada por otras sesiones. No hay paquetes nuevos de producción. El CDN necesita conexión; si falla se conserva el código LaTeX y aparece un aviso. Sin JavaScript quedan accesibles la explicación y los ejemplos desplegables.

La gráfica conecta únicamente los puntos de períodos completos; no afirma que se midan tiempos fraccionarios. Parte de cero y ajusta su escala vertical. La tabla redondea a dos decimales: una cantidad positiva pequeña puede mostrarse como 0.00, aclarado en la interfaz. Los resultados destacados y el inspector conservan más cifras o usan notación científica cuando hace falta. Los contextos son modelos hipotéticos; no hay datos personales, recomendaciones financieras ni predicciones.

## Validación

Desde la raíz:
- node --test Casilleros/andres/crecimiento-y-decrecimiento-exponencial/modelo.test.mjs
- npm run catalogo
- npm run validar

Revisar por HTTP a 360, 768, 1024 y 1440 px: LaTeX sin errores, gráfica/tabla con desplazamiento local sin desbordamiento de página, tasas positivas/negativas/cero, extremos admitidos, campos vacíos y recuperación, inspector y presets. Probar respuesta vacía/incorrecta/correcta, pista, solución, los diez retos, resumen y reinicio. Revisar teclado, foco, menú/Escape, enlaces y consola.
