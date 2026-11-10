# Funciones: tipos, dominio y evaluación

Sesión de Daniel, estudiante de Geografía interesado en climatología. Ruta `/Casilleros/newstudent/funciones/`; propietario estable `newstudent`. Fecha editorial 2026-11-10.

Tres actividades integradas, en orden: tipos de funciones, dominio real y evaluación numérica/algebraica. Incluye cuatro fichas conceptuales, ejemplos resueltos desplegables, un ejercicio de grado y coeficiente, 8 preguntas de clasificación, 8 de dominio, 6 de evaluación y una gráfica SVG de f(x)=x²−2x+1 controlada por un deslizador. Los ejercicios ofrecen retroalimentación explicativa y se pueden repetir. No se califican logros globales ni se guarda progreso.

La clasificación reconoce el solapamiento entre polinomios y racionales; trata las constantes no nulas y el polinomio cero por separado. El dominio combina restricciones y condiciones de tramos, distingue raíces pares/impares y conserva exclusiones tras cancelar factores. La evaluación incluye f(t+1), f(x+h), entradas fuera del dominio y un modelo de temperatura explícitamente ilustrativo, con dominio contextual [0,2000].

Dependencias: estilos y script propios, SVG decorativo `../recursos/atmosfera.svg`, base, navegación y marca globales. Las expresiones estáticas y dinámicas se escriben en LaTeX y se renderizan con KaTeX 0.18.1 y su auto-render desde jsDelivr, siguiendo la versión usada por otras sesiones. No se añaden paquetes al proyecto. Sin almacenamiento. La representación tipográfica requiere acceso al CDN; si no carga, el contenido conserva su fuente LaTeX. Los componentes educativos están integrados en index.html; los campos componentes del JSON corresponden a subcarpetas, por eso están desactivados. Sin JavaScript se conservan explicaciones y ejemplos; el laboratorio y las preguntas requieren JavaScript.

Validación: npm run catalogo y npm run validar. Revisar ambas respuestas (correcta/incorrecta) en cada banco, completar y reiniciar los bancos, grado/coeficiente con signo, deslizador en −3,1,5 y medios, despliegues por teclado, enlaces internos, retorno al casillero, menú/Escape, consola y anchuras 360,768,1024,1440. Valores de referencia de la gráfica: f(−3)=16, f(1)=0, f(5)=16.

Comprobar LaTeX en fórmulas, trozos, intervalos, preguntas, opciones, retroalimentación y salida del deslizador. Las fórmulas largas tienen desplazamiento local en móvil. Los rótulos breves de los ejes y el título accesible del SVG permanecen como texto.
