# Casillero de Daniel

Daniel estudia Geografía y se interesa por la climatología. Su carpeta, ID y slug son `daniel`; la entrada pública es `/Casilleros/daniel/index.html`. Todas las sesiones y sus componentes pertenecen a este identificador.

Sesiones publicadas: **Revisión**, diagnóstico inicial neutral; y **Funciones: tipos, dominio y evaluación**, sesión didáctica con ejemplos e interacciones; y **Operaciones y composición de funciones**, continuación con un par sencillo, composición en ambos órdenes y código Python/SymPy para copiar LaTeX.

El índice carga las sesiones desde academia.json mediante ../recursos/js/alumno.js. El índice no guarda datos; Revisión conserva sus respuestas con la clave `daniel-revision-v1` en el navegador. Funciones y Operaciones y composición no usan almacenamiento.

Identidad meteorológica: `recursos/identidad.css`, `recursos/banner-clima.svg` y su variante `recursos/banner-clima-movil.svg` comparten el banner entre la portada global y el casillero. El único texto del banner es Daniel. El atlas detallado incorpora globo con continentes, meridianos, nubes, lluvia, rayo, sol, rosa de los vientos, isobaras y frentes; son decorativos, no observaciones meteorológicas reales. El fondo de sesiones usa una cuadrícula suave. El nombre permanece en HTML accesible.

La portada y el casillero cargan la identidad y ambos SVG con la versión `20261117-daniel-banner1`. Al actualizar el banner, mantener sincronizados esos parámetros y la versión de `estilos.css` en el índice del casillero para que el navegador solicite los recursos actuales.

`recursos/comun.css` sirve al casillero y a las dos páginas de Revisión. Se preservan base.css, navegacion.js, logotipo, pie y controles flotantes globales. Al cambiar identidad, comprobar portada, casillero y nueva sesión a 360,768,1024,1440 px, consola, teclado, menú/Escape y enlaces. Ejecutar npm run catalogo y npm run validar.

La sesión Funciones conserva `recursos/atmosfera.svg` como fondo propio de su portada. No consume las ilustraciones detalladas del banner. Sus expresiones se representan en LaTeX con KaTeX según su README.

La sesión operaciones-y-composicion-de-funciones/ (2026-11-17) incorpora su código descargable operaciones.py, conservado también como bloque de texto dentro del HTML. Sus ejemplos, pruebas y dependencias están descritos en su README.
