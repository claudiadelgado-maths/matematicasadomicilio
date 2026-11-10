# Casillero de Daniel

Daniel estudia Geografía y se interesa por la climatología. Se renombró el perfil anteriormente visible como NewStudent. Se conservan ID `newstudent`, ruta `/Casilleros/newstudent/` y clave `newstudent-revision-v1` para mantener enlaces, relaciones y respuestas anteriores.

Sesiones publicadas: **Revisión**, diagnóstico inicial neutral; y **Funciones: tipos, dominio y evaluación**, sesión didáctica con ejemplos e interacciones.

El índice carga las sesiones desde academia.json mediante ../recursos/js/alumno.js. El índice no guarda datos; Revisión conserva sus respuestas localmente según su README. Funciones no usa almacenamiento.

Identidad meteorológica: `recursos/identidad.css`, `recursos/banner-clima.svg` y su variante `recursos/banner-clima-movil.svg` comparten el banner entre la portada global y el casillero. El único texto del banner es Daniel. El atlas detallado incorpora globo con continentes, meridianos, nubes, lluvia, rayo, sol, rosa de los vientos, isobaras y frentes; son decorativos, no observaciones meteorológicas reales. El fondo de sesiones usa una cuadrícula suave. El nombre permanece en HTML accesible.

`recursos/comun.css` sirve al casillero y a las dos páginas de Revisión. Se preservan base.css, navegacion.js, logotipo, pie y controles flotantes globales. Al cambiar identidad, comprobar portada, casillero y nueva sesión a 360,768,1024,1440 px, consola, teclado, menú/Escape y enlaces. Ejecutar npm run catalogo y npm run validar.

La sesión Funciones conserva `recursos/atmosfera.svg` como fondo propio de su portada. No consume las ilustraciones detalladas del banner. Sus expresiones se representan en LaTeX con KaTeX según su README.
