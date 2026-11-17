# Operaciones y composición de funciones

Sesión de Daniel, fecha editorial 2026-11-17. Propietario estable daniel. Entrada: /Casilleros/daniel/operaciones-y-composicion-de-funciones/index.html. Continúa la sesión Funciones: tipos, dominio y evaluación.

## Contenido

Se reutiliza f(x)=x+1 y g(x)=2x en toda la explicación. Cuatro tarjetas muestran suma, resta, producto y cociente en ambos órdenes, con las restricciones x≠0 para f/g y x≠−1 para g/f. Se distingue el producto fg de la composición f∘g. Ejemplo breve de simplificación: (x+1)−2x=1−x.

Dos tarjetas explican de dentro hacia fuera f(g(x))=2x+1 y g(f(x))=2x+2, nombrando explícitamente función interior y exterior. Un explorador alterna ambos órdenes para entradas 0, 1/2, 1, 2 y −1; mantiene las fracciones exactas. Ambas composiciones del ejemplo tienen dominio real.

La última parte contiene las seis claves, instrucciones, las salidas literales de los ejemplos, un bloque completo copiable y la descarga operaciones.py. Las dos llamadas finales usan el mismo par con p para demostrar detección de variable.

Todo está integrado en index.html: los indicadores de subcarpetas de componentes son false. Sin componentes vacíos ni almacenamiento.

## Contrato del código Python

operaciones.py define of(f, g, operacion, evaluar=None), sin menú ni input. Claves: s, r, m, d, fg y gf. Acepta texto de expresiones propias o expresiones escalares de SymPy. Detecta una única variable de la unión de free_symbols; admite p, v, u, t, x, y, z y otros símbolos. Una función puede ser constante si la otra permite detectar la variable. Si ambas son constantes o hay varias variables, lanza ValueError en vez de escoger una variable arbitraria. Las entradas de texto reutilizan los símbolos con supuestos de las expresiones recibidas.

sympify con evaluate=False y rational=True conserva operaciones de texto y fracciones exactas. Add, Mul y Pow con evaluate=False construyen operaciones sin resolver. La composición sustituye recursivamente conservando el árbol; symbol_names muestra el interior entre paréntesis. Se calcula sp.simplify en otra variable. Se compara el LaTeX de ambos árboles para anunciar «Simplificando» solo si cambia su forma algebraica, sin pasos ficticios por reordenar internamente argumentos. Una expresión que SymPy ya simplificó antes de llamar a of no puede recuperar su forma previa. El soporte está orientado a expresiones algebraicas y funciones elementales de una variable, no a objetos Matrix, ecuaciones, Lambda o múltiples parámetros.

Sin evaluar imprime: «Para las funciones», f, g, «La operación [nombre] es» y la ecuación original; si procede añade «Simplificando» y la ecuación simplificada. Con un valor, incluso 0, imprime solo «Para la función», la operación simplificada, «Al evaluar $variable = número$ obtenemos» y la ecuación numérica. Usa print, cadenas LaTeX y delimitadores literales, sin display, pprint, Markdown ni renderizado de notebook.

Las fracciones de texto y sp.Rational se mantienen exactas, también al evaluar. No se usa evalf. Se verifican valores finitos y polos evidentes antes de sustituir en la simplificada, evitando aceptar un cociente con denominador cero tras una cancelación. No es un analizador completo de dominios reales. Para invertir las cuatro operaciones aritméticas, intercambia los argumentos; f y g en la salida nombran esos argumentos en el nuevo orden.

## Archivos y dependencias

- index.html, estilos.css y sesion.js: presentación, composición interactiva y copia al portapapeles.
- operaciones.py: código descargable, idéntico al bloque HTML.
- test_operaciones.py: pruebas funcionales, formatos, exactitud y sincronización.

Solo se consumen base.css, navegacion.js, logotipo y favicon globales. No se modifica la identidad del casillero. KaTeX 0.18.1 desde jsDelivr renderiza las explicaciones; pre/code se excluyen para conservar código y salidas como texto. Si el CDN falla, queda la fuente LaTeX con un aviso. Sin JavaScript se conservan la explicación, los ejemplos, el bloque completo y su descarga. SymPy es una dependencia del código que el alumno ejecuta en Python; el sitio no ejecuta Python ni incorpora paquetes de producción nuevos.

## Comprobaciones

Desde la raíz: python -B -m unittest discover -s Casilleros/daniel/operaciones-y-composicion-de-funciones -p test_operaciones.py -v; npm run catalogo; npm run validar.

Revisar las seis operaciones con las siete variables, fracciones en funciones y evaluación, evaluar=0, ambas composiciones originales, Simplificando condicional, entradas ambiguas, constantes, denominadores cero y mezcla de texto con símbolos de SymPy.

Por HTTP: móvil/escritorio a 360, 768, 1024 y 1440 px, fórmulas renderizadas y bloque Python sin transformar, copia/descarga, explorador en ambas direcciones con 0 y 1/2, teclado, foco, menú/Escape, consola y enlaces. Las líneas largas de código y fórmulas desplazan localmente sin desbordar la página.

Fuentes técnicas: documentación oficial de SymPy sobre sympify, manipulación de expresiones y latex; enlaces en la página. Verificado con SymPy 1.14.0.
