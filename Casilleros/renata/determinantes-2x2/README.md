# Renata · Determinantes 2 × 2 — edición interactiva

## Instalación (sustitución directa)

1. Guarda una copia de la carpeta original `determinantes-2x2`.
2. Descomprime el ZIP y sustituye **solo** esa carpeta completa en `Casilleros/renata/`.
3. Conserva exactamente el nombre `determinantes-2x2` y los nombres internos.
4. Abre `/Casilleros/renata/determinantes-2x2/` y recorre las páginas. Comprueba el menú de la web madre en móvil y la navegación de vuelta a Renata.

La URL de entrada no cambia. Las rutas hacia `../../../recursos/` desde la portada y `../../../../recursos/` desde `paginas/` mantienen la misma referencia original al directorio compartido. El encabezado y el pie conservan los vínculos del sitio y el código de navegación general.

## Estructura

- `index.html`: portada y menú de las seis etapas.
- `paginas/descubre.html`: concepto, signos, singularidad.
- `paginas/regla.html`: diagonales y resolución desplegable.
- `paginas/laboratorio.html`: calculadora de entradas numéricas con tres pasos automáticos.
- `paginas/geometria.html`: SVG del cuadrado transformado, signo y área.
- `paginas/practica.html`: ejercicios generados localmente y autocorregibles.
- `paginas/desafio.html`: cinco cuestiones con puntaje y retroalimentación.
- `css/sesion.css`: estilos propios y encapsulados bajo `.det-app`.
- `js/sesion.js`: interacciones JavaScript nativas sin dependencias externas.
- `sesion.json`: ID, usuario, URL y metadatos originales conservados.

## Compatibilidad y límites

- Navegación por enlaces HTML comunes, sin router SPA ni servidor especial; puede abrirse directamente cada subpágina.
- No introduce bibliotecas, fuentes ni recursos remotos.
- Progreso de páginas visitadas y mejor puntuación: `localStorage` opcional. Si está deshabilitado, la sesión sigue funcionando sin guardar progreso.
- Las fórmulas básicas son texto HTML; el navegador no necesita MathJax ni MathML.
- La calculadora usa números de −99 a 99 con precisión visual de seis decimales. Como JavaScript emplea coma flotante, las operaciones decimales pueden ser aproximadas.
- Geometría permite entradas enteras entre −3 y 3, con escala fija para conservar toda la figura dentro del gráfico.
- La práctica no necesita internet ni datos personales, ni envía respuestas a ningún servidor.
- Se mantiene el archivo `sesion.json` en la raíz y el mismo `id`, `slug`, `usuario`, `fecha` y `ruta`.

## Pruebas tras integrar en la web

- Menú móvil, encabezado y pie (dependen del CSS y JS compartidos reales de tu sitio).
- Navegación portada → seis etapas → volver al casillero.
- Laboratorio: `[3,2;1,4] = 10`, `[-1,2;3,4] = −10`, `[2,4;1,2] = 0`.
- Geometría: matriz diagonal `[2,0;0,3]` da área 6; si el determinante es negativo invierte la orientación.
- Teclado, botones, pruebas con entradas vacías o fuera de rango, ejercicios y misión completa.
- Resolución 360, 768, 1024 y 1440 píxeles, sin desplazamiento horizontal ni mensajes de error en consola.

El sitio completo no venía en la carpeta recibida; los vínculos globales se conservaron, pero deben verificarse una vez instalada allí.

## Metadatos de componentes (2026-10-18)

El contenido educativo está integrado en la portada `index.html` y las seis etapas de `paginas/`, con `js/sesion.js`. Los campos de `componentes` representan subcarpetas modulares independientes, no secciones o capacidades de la interfaz. Se declaran `false` para `explicacion`, `demostraciones`, `ejercicios`, `juegos` y `calculadoras`, porque esas cinco carpetas no existen en esta sesión. Las explicaciones, prácticas y herramientas existentes siguen disponibles en sus rutas originales. No se crean carpetas vacías ni se cambian páginas o interacciones.

Regenerar índices con `npm run catalogo` y comprobar `npm run validar` después de modificar metadatos.

Verificación 2026-10-18: catálogo regenerado; sesión sigue publicada. `npm run validar` pasa sin errores ni avisos. Auditoría de referencias locales, incluidos los archivos de esta sesión, sin destinos rotos.
